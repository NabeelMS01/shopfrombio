'use server';

import { productModel, storeModel } from '@/lib/models';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getUserFromSession } from '@/lib/session';

async function getStoreId() {
    const user = await getUserFromSession();
    if (!user) return null;
    
    const store = await storeModel.getByUserId(user.id);
    if (!store) return null;
    return store.id;
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
  variants: z.string(), // Expecting a JSON string for variants
  images: z.string().optional(), // JSON stringified array of image URLs
});

export async function addProduct(prevState: any, formData: FormData) {
  const storeId = await getStoreId();
  if (!storeId) {
    return { message: 'You must be logged in and have a store to add a product.' };
  }

  const validatedFields = productSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }
  
  const { title, price, cost, stock, productType, discountValue, discountType, variants: variantsJSON, images: imagesJSON } = validatedFields.data;
  
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
    // Parse images JSON if provided
    const images = imagesJSON ? (JSON.parse(imagesJSON) as string[]).filter(Boolean) : undefined;

    // Create product with variants
    await productModel.createWithVariants({
      store_id: storeId,
      title,
      price,
      cost,
      stock,
      product_type: productType,
      discount_type: discountType,
      discount_value: discountValue,
      images,
    }, variants.flatMap((variant: any) =>
      variant.options.map((option: any) => ({
        variant_type: variant.type,
        variant_name: option.name,
        stock: option.stock,
      }))
    ));
    
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
    const storeId = await getStoreId();
    if (!storeId) {
        return { message: 'You must be logged in and have a store to update a product.' };
    }

    const validatedFields = updateProductSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please correct the errors below.',
        };
    }

    const { productId, title, price, cost, stock, productType, discountValue, discountType, variants: variantsJSON, images: imagesJSON } = validatedFields.data;

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
        // Check if product exists and belongs to user's store
        const existingProduct = await productModel.getById(productId);
        if (!existingProduct || existingProduct.store_id !== storeId) {
            return { message: 'Product not found or you do not have permission to edit it.' };
        }

        // Parse images JSON if provided
        const images = imagesJSON ? (JSON.parse(imagesJSON) as string[]).filter(Boolean) : undefined;

        // Update product with variants
        await productModel.updateWithVariants(productId, {
            title,
            price,
            cost,
            stock,
            product_type: productType,
            discount_type: discountType,
            discount_value: discountValue,
            images,
        }, variants.flatMap((variant: any) =>
            variant.options.map((option: any) => ({
                variant_type: variant.type,
                variant_name: option.name,
                stock: option.stock,
            }))
        ));

        revalidatePath('/dashboard/products');
        return { success: true, message: 'Product updated successfully!' };

    } catch (e: any) {
        console.error(e);
        return { message: 'Something went wrong. Please try again.' };
    }
}
