'use server';

import { userModel } from '@/lib/models';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
  let user;
  
  try {
    // Check if user already exists
    const exists = await userModel.existsByEmail(email);
    if (exists) {
      return { message: 'User with this email already exists.' };
    }

    // Create new user with password hashing
    user = await userModel.createWithPassword({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
    
    console.log('User created successfully:', user);
    
    // Set session cookie
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return { success: true, redirect: '/dashboard' };
    
  } catch (e) {
    console.error('Signup error:', e);
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
  let user;
  try {
    // Verify user credentials
    user = await userModel.verifyPassword(email, password);
    if (!user) {
      return { message: 'Invalid credentials.' };
    }
  } catch (error) {
    console.error(error);
    return { message: 'Something went wrong. Please try again.' };
  }

  // Set session cookie
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { success: true, redirect: '/dashboard' };
}


export async function logout() {
  (await cookies()).delete('session');
  redirect('/login');
}
