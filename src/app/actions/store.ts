'use server';

import dbConnect from '@/lib/mongoose';
import Store from '@/models/Store';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getUserFromSession } from '@/lib/session';

const createStoreSchema = z.object({
  name: z.string().min(1, { message: 'Store name is required' }),
  subdomain: z.string().min(3, { message: 'Subdomain must be at least 3 characters' }).regex(/^[a-z0-9-]+$/, {message: "Subdomain can only contain lowercase letters, numbers, and hyphens."}),
  currency: z.string().min(1, { message: 'Currency is required' }),
});

export async function createStore(prevState: any, formData: FormData) {
  const user = await getUserFromSession();
  if (!user) {
    return { message: 'You must be logged in to create a store.' };
  }

  const validatedFields = createStoreSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }

  const { name, subdomain, currency } = validatedFields.data;

  try {
    await dbConnect();

    const existingSubdomain = await Store.findOne({ subdomain });
    if(existingSubdomain) {
        return { ...prevState, message: 'Subdomain is already taken.' };
    }

    await Store.create({
      name,
      subdomain,
      currency,
      userId: user._id,
    });
    
    revalidatePath('/dashboard');
    return { ...prevState, success: true, message: 'Store created successfully!' };

  } catch (e: any) {
    console.error(e);
    if (e.code === 11000) { // Catch duplicate key error for userId
        return { ...prevState, message: 'A store already exists for this user.' };
    }
    return { ...prevState, message: 'Something went wrong. Please try again.' };
  }
}

const updateStoreSchema = z.object({
  name: z.string().min(1, { message: 'Store name is required' }),
  subdomain: z.string().min(3, { message: 'Subdomain must be at least 3 characters' }).regex(/^[a-z0-9-]+$/, {message: "Subdomain can only contain lowercase letters, numbers, and hyphens."}),
  razorpayKeyId: z.string().optional(),
  theme: z.string().optional(),
});


export async function updateStore(prevState: any, formData: FormData) {
    const user = await getUserFromSession();
    if (!user) {
      return { message: 'You must be logged in to update store settings.' };
    }

    const validatedFields = updateStoreSchema.safeParse(
        Object.fromEntries(formData.entries())
      );
    
      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Please correct the errors below.',
        };
      }
    
      const { name, subdomain, razorpayKeyId, theme } = validatedFields.data;
    
      try {
        await dbConnect();
    
        const store = await Store.findOne({ userId: user._id });
        if (!store) {
            return { message: "Store not found. You must create a store first." };
        }

        const existingSubdomain = await Store.findOne({ subdomain, userId: { $ne: user._id } });
        if(existingSubdomain) {
            return { message: 'Subdomain is already taken.' };
        }
    
        store.name = name;
        store.subdomain = subdomain;
        store.razorpayKeyId = razorpayKeyId;
        store.theme = theme;
        
        await store.save();

        revalidatePath('/dashboard/settings');
        return { success: true, message: 'Settings saved successfully!' };
    
      } catch (e) {
        console.error(e);
        return { message: 'Something went wrong. Please try again.' };
      }
}
