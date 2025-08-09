import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    console.log('Testing admin insert with:', { firstName, lastName, email });

    // Try direct insert with admin client
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        password: 'hashed_password_placeholder', // We'll hash this properly in the real implementation
      })
      .select()
      .single();

    if (error) {
      console.error('Admin insert error:', error);
      return NextResponse.json({ error: 'Admin insert failed', details: error }, { status: 500 });
    }

    console.log('Admin insert successful:', data);

    // Clean up - delete the test user
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', data.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Admin client is working correctly',
      user: data 
    });

  } catch (error) {
    console.error('Test admin error:', error);
    return NextResponse.json({ 
      error: 'Admin test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 