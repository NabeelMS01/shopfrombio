import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connections...');
    
    // Test regular client
    const { data: regularData, error: regularError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    console.log('Regular client test:', { data: regularData, error: regularError });
    
    // Test admin client
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    console.log('Admin client test:', { data: adminData, error: adminError });
    
    // Test admin client with insert
    const testUser = {
      first_name: 'Test',
      last_name: 'User',
      email: `test-${Date.now()}@example.com`,
      password: 'testpass123'
    };
    
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('users')
      .insert(testUser)
      .select()
      .single();
    
    console.log('Admin insert test:', { data: insertData, error: insertError });
    
    // Clean up if insert was successful
    if (insertData) {
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', insertData.id);
    }
    
    return NextResponse.json({
      regularClient: { success: !regularError, data: regularData, error: regularError?.message },
      adminClient: { success: !adminError, data: adminData, error: adminError?.message },
      adminInsert: { success: !insertError, data: insertData, error: insertError?.message },
      message: 'Check console for detailed logs'
    });
    
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json({ 
      error: 'Connection test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 