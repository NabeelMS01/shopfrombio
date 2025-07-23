'use server';

import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
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
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: 'User with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    
  } catch (e) {
    console.error(e);
    return { message: 'Something went wrong. Please try again.' };
  }

  // Set session cookie
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  redirect('/dashboard');
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
    await dbConnect();
    user = await User.findOne({ email });

    if (!user) {
      return { message: 'Invalid credentials.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { message: 'Invalid credentials.' };
    }
  } catch (error) {
    console.error(error);
    return { message: 'Something went wrong. Please try again.' };
  }

  // Set session cookie
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  redirect('/dashboard');
}


export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
