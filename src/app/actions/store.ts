'use server';

import { storeModel } from '@/lib/models';
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
    // Check if subdomain already exists
    const exists = await storeModel.subdomainExists(subdomain);
    if (exists) {
      return { ...prevState, message: 'Subdomain is already taken.' };
    }

    // Create new store
    await storeModel.create({
      name,
      subdomain,
      currency,
      user_id: user.id,
    });
    
    revalidatePath('/dashboard');
    return { success: true, message: 'Store created successfully!', redirect: '/dashboard' };

  } catch (e: any) {
    console.error(e);
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
        // Get current store
        const store = await storeModel.getByUserId(user.id);
        if (!store) {
          return { message: "Store not found. You must create a store first." };
        }

        // Check if subdomain is taken by another user
        const exists = await storeModel.subdomainExistsForOtherUser(subdomain, user.id);
        if (exists) {
          return { message: 'Subdomain is already taken.' };
        }

        // Update store
        await storeModel.updateSettings(store.id, {
          name,
          subdomain,
          razorpay_key_id: razorpayKeyId,
          theme,
        });

        revalidatePath('/dashboard/settings');
        return { success: true, message: 'Settings saved successfully!' };
    
      } catch (e) {
        console.error(e);
        return { message: 'Something went wrong. Please try again.' };
      }
}
