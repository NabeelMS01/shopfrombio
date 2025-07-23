'use server';

import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';
import Store from '@/models/Store';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getUserFromSession } from '@/lib/session';

// This is a placeholder for getting the current user's ID
// In a real app, you'd get this from the session (e.g., NextAuth.js)
async function getStoreId() {
    const user = await getUserFromSession();
    if (!user) throw new Error("User not authenticated");
    await dbConnect();
    const store = await Store.findOne({ userId: user._id });
    if (!store) throw new Error("No store found for the current user.");
    return store._id;
}

const variantOptionSchema = z.object({
    name: z.string().min(1, "Option name cannot be empty."),
    stock: z.coerce.number().optional(),
});

const variantSchema = z.object({
    type: z.string().min(1, "Variant type cannot be empty."),
    options: z.array(variantOptionSchema).min(1, "At least one option is required for a variant."),
});

const productSchema = z.object({
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
  const validatedFields = productSchema.safeParse(
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
      if (variantsJSON) {
        variants = JSON.parse(variantsJSON);
        z.array(variantSchema).parse(variants);
      }
  } catch (e) {
      return { message: 'Invalid variant data format.' };
  }

  try {
    await dbConnect();
    const storeId = await getStoreId();

    const newProduct = {
      storeId: storeId,
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

const updateProductSchema = productSchema.extend({
    productId: z.string().min(1, { message: 'Product ID is required' }),
});

export async function updateProduct(prevState: any, formData: FormData) {
    const validatedFields = updateProductSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please correct the errors below.',
        };
    }

    const { productId, title, price, cost, stock, productType, discountValue, discountType, variants: variantsJSON } = validatedFields.data;

    let variants = [];
    try {
        if (variantsJSON) {
            variants = JSON.parse(variantsJSON);
            z.array(variantSchema).parse(variants);
        }
    } catch (e) {
        return { message: 'Invalid variant data format.' };
    }

    try {
        await dbConnect();
        const storeId = await getStoreId();
        
        const productToUpdate = await Product.findOne({ _id: productId, storeId: storeId });

        if (!productToUpdate) {
            return { message: 'Product not found.' };
        }

        productToUpdate.title = title;
        productToUpdate.price = price;
        productToUpdate.cost = cost;
        productToUpdate.stock = stock;
        productToUpdate.productType = productType;
        productToUpdate.variants = variants;
        productToUpdate.discount = (discountValue && discountType) ? { value: discountValue, type: discountType } : undefined;

        await productToUpdate.save();

        revalidatePath('/dashboard/products');
        return { success: true, message: 'Product updated successfully!' };

    } catch (e: any) {
        console.error(e);
        return { message: 'Something went wrong. Please try again.' };
    }
}
