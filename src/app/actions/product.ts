'use server';

import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';
import Store from '@/models/Store';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// This is a placeholder for getting the current user's ID
// In a real app, you'd get this from the session (e.g., NextAuth.js)
async function getUserId() {
    const User = (await import('@/models/User')).default;
    await dbConnect();
    const user = await User.findOne().sort({_id: -1});
    if (!user) throw new Error("No user found to associate the store with.");
    return user._id;
}

const variantOptionSchema = z.object({
    name: z.string().min(1, "Option name cannot be empty."),
    stock: z.coerce.number().optional(),
});

const variantSchema = z.object({
    type: z.string().min(1, "Variant type cannot be empty."),
    options: z.array(variantOptionSchema).min(1, "At least one option is required for a variant."),
});

const addProductSchema = z.object({
  title: z.string().min(1, { message: 'Product title is required' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  cost: z.coerce.number().optional(),
  discountValue: z.coerce.number().optional(),
  discountType: z.enum(['percentage', 'amount']).optional(),
  stock: z.coerce.number().min(0, { message: 'Stock must be a positive number' }),
  productType: z.enum(['product', 'service']),
  variants: z.string() // Expecting a JSON string for variants
});

export async function addProduct(prevState: any, formData: FormData) {
  const validatedFields = addProductSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }
  
  const { title, price, cost, stock, productType, discountValue, discountType, variants: variantsJSON } = validatedFields.data;
  
  let variants = [];
  try {
      variants = JSON.parse(variantsJSON);
      // Further validation on parsed variants
      z.array(variantSchema).parse(variants);
  } catch (e) {
      return { message: 'Invalid variant data format.' };
  }

  try {
    await dbConnect();
    const userId = await getUserId();
    const store = await Store.findOne({ userId });

    if (!store) {
      return { message: 'Store not found for the current user.' };
    }

    const newProduct = {
      storeId: store._id,
      title,
      price,
      cost,
      stock,
      productType,
      variants,
      discount: (discountValue && discountType) ? { value: discountValue, type: discountType } : undefined,
    };

    await Product.create(newProduct);
    
    revalidatePath('/dashboard/products');
    return { success: true, message: 'Product added successfully!' };

  } catch (e: any) {
    console.error(e);
    return { message: 'Something went wrong. Please try again.' };
  }
}
