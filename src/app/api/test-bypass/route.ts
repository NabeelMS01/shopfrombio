import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    console.log('Testing RLS bypass with:', { firstName, lastName, email });

    // Try to disable RLS temporarily and insert
    const { data: disableData, error: disableError } = await supabaseAdmin
      .rpc('disable_rls_temporarily', { table_name: 'users' })
      .catch(() => ({ data: null, error: 'RPC function not available' }));

    console.log('Disable RLS result:', { disableData, disableError });

    // Try direct insert with admin client
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        password: 'hashed_password_placeholder',
      })
      .select()
      .single();

    console.log('Direct insert result:', { data, error });

    if (error) {
      // Try to get more details about the error
      console.error('Insert error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      return NextResponse.json({ 
        error: 'Insert failed', 
        details: error,
        suggestion: 'Check if service role has proper permissions'
      }, { status: 500 });
    }

    console.log('Insert successful:', data);

    // Clean up - delete the test user
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', data.id);

    return NextResponse.json({ 
      success: true, 
      message: 'RLS bypass successful',
      user: data 
    });

  } catch (error) {
    console.error('Test bypass error:', error);
    return NextResponse.json({ 
      error: 'Bypass test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 