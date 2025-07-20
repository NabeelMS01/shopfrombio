'use server';

import dbConnect from '@/lib/mongoose';
import Store from '@/models/Store';
import { z } from 'zod';
import { redirect } from 'next/navigation';

// This is a placeholder for getting the current user's ID
// In a real app, you'd get this from the session (e.g., NextAuth.js)
async function getUserId() {
    // For now, let's find a user to associate the store with.
    // This is NOT secure and is for demonstration purposes only.
    const User = (await import('@/models/User')).default;
    await dbConnect();
    const user = await User.findOne().sort({_id: -1}); // Get the latest user
    if (!user) throw new Error("No user found to associate the store with.");
    return user._id;
}


const createStoreSchema = z.object({
  name: z.string().min(1, { message: 'Store name is required' }),
  subdomain: z.string().min(3, { message: 'Subdomain must be at least 3 characters' }).regex(/^[a-z0-9-]+$/, {message: "Subdomain can only contain lowercase letters, numbers, and hyphens."}),
  currency: z.string().min(1, { message: 'Currency is required' }),
});

export async function createStore(prevState: any, formData: FormData) {
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
    const userId = await getUserId();

    const existingSubdomain = await Store.findOne({ subdomain });
    if(existingSubdomain) {
        return { ...prevState, message: 'Subdomain is already taken.' };
    }

    await Store.create({
      name,
      subdomain,
      currency,
      userId,
    });

    return { ...prevState, success: true, message: 'Store created successfully!' };

  } catch (e: any) {
    console.error(e);
    if (e.message.includes('No user found')) {
      return { ...prevState, message: 'Could not create store: No user session found.' };
    }
    return { ...prevState, message: 'Something went wrong. Please try again.' };
  }

  // This redirect will now be handled on the client
  // redirect('/dashboard');
}

const updateStoreSchema = z.object({
  name: z.string().min(1, { message: 'Store name is required' }),
  subdomain: z.string().min(3, { message: 'Subdomain must be at least 3 characters' }).regex(/^[a-z0-9-]+$/, {message: "Subdomain can only contain lowercase letters, numbers, and hyphens."}),
  razorpayKeyId: z.string().optional(),
  theme: z.string().optional(),
});


export async function updateStore(prevState: any, formData: FormData) {
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
        const userId = await getUserId();
    
        const store = await Store.findOne({ userId });
        if (!store) {
            return { message: "Store not found." };
        }

        const existingSubdomain = await Store.findOne({ subdomain, userId: { $ne: userId } });
        if(existingSubdomain) {
            return { message: 'Subdomain is already taken.' };
        }
    
        store.name = name;
        store.subdomain = subdomain;
        store.razorpayKeyId = razorpayKeyId;
        store.theme = theme;
        
        await store.save();

        return { message: 'Settings saved successfully!' };
    
      } catch (e) {
        console.error(e);
        return { message: 'Something went wrong. Please try again.' };
      }
}
