import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('Testing database schema...');
    
    // Test user data
    const testUser = {
      first_name: 'Schema',
      last_name: 'Test',
      email: `schema-test-${Date.now()}@example.com`,
      password: 'testpass123'
    };
    
    console.log('Attempting to insert test user:', testUser);
    
    // Try to insert a test user
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(testUser)
      .select()
      .single();
    
    console.log('Insert result:', { data, error });
    
    if (error) {
      console.error('Insert error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      return NextResponse.json({ 
        error: 'Schema test failed', 
        details: error,
        suggestion: 'Database schema may not be properly applied'
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
      message: 'Database schema is working correctly',
      user: data 
    });
    
  } catch (error) {
    console.error('Schema test error:', error);
    return NextResponse.json({ 
      error: 'Schema test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 