import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Check if users table exists and has data
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('count', { count: 'exact', head: true });

    console.log('Users table check:', { users, usersError });

    // Check if stores table exists
    const { data: stores, error: storesError } = await supabaseAdmin
      .from('stores')
      .select('count', { count: 'exact', head: true });

    console.log('Stores table check:', { stores, storesError });

    // Check if products table exists
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('count', { count: 'exact', head: true });

    console.log('Products table check:', { products, productsError });

    // Try to get table structure (simplified)
    let tableInfo = null;
    try {
      const { data, error } = await supabaseAdmin
        .rpc('get_table_info', { table_name: 'users' });
      tableInfo = { data, error };
    } catch (e) {
      tableInfo = { data: null, error: 'RPC function not available' };
    }

    return NextResponse.json({
      tables: {
        users: { exists: !usersError, count: users, error: usersError?.message },
        stores: { exists: !storesError, count: stores, error: storesError?.message },
        products: { exists: !productsError, count: products, error: productsError?.message },
      },
      tableInfo,
      message: 'Check console for detailed logs'
    });

  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json({ 
      error: 'Database check failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 