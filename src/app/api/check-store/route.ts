import { NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await getUserFromSession();
    
    if (!user) {
      return NextResponse.json({ hasStore: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    // Check if user has a store
    const { data: store, error } = await supabaseAdmin
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking store:', error);
      return NextResponse.json({ hasStore: false, error: 'Database error' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      hasStore: !!store,
      storeId: store?.id || null
    });
    
  } catch (error) {
    console.error('Check store error:', error);
    return NextResponse.json({ 
      hasStore: false, 
      error: 'Failed to check store' 
    }, { status: 500 });
  }
} 