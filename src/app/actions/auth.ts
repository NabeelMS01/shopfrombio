'use server';

import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { signIn } from '@/lib/auth'; // Assuming you have authjs setup
import Store from '@/models/Store';

const signupSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export async function signup(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }
  
  const { firstName, lastName, email, password } = validatedFields.data;

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: 'User with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const store = await Store.findOne({ userId: user._id });
    if (store) {
      redirect('/dashboard');
    } else {
      redirect('/dashboard/create-store');
    }
    
  } catch (e) {
    console.error(e);
    return { message: 'Something went wrong. Please try again.' };
  }
}


const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid credentials.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return { message: 'Invalid credentials.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { message: 'Invalid credentials.' };
    }

    const store = await Store.findOne({ userId: user._id });
    if (store) {
      redirect('/dashboard');
    } else {
      redirect('/dashboard/create-store');
    }
  } catch (error) {
    console.error(error);
    if ((error as any).type === 'NextRedirect') {
      throw error;
    }
    return { message: 'Something went wrong. Please try again.' };
  }
}
