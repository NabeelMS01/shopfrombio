import { NextResponse } from 'next/server';
import { userModel } from '@/lib/models';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    console.log('Testing signup with:', { firstName, lastName, email });

    // Check if user exists
    const exists = await userModel.existsByEmail(email);
    console.log('User exists:', exists);

    if (exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create user
    const user = await userModel.createWithPassword({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });

    console.log('User created:', user);

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name,
        last_name: user.last_name 
      } 
    });

  } catch (error) {
    console.error('Test signup error:', error);
    return NextResponse.json({ 
      error: 'Signup failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 