import { createClient } from '@supabase/supabase-js';

// Only use client-side safe environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client-side only client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    // Test the connection by making a simple query to a public table
    // Use stores table which has public read access
    const { data, error } = await supabase
      .from('stores')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
}

// Function to check connection on app startup
export async function initializeSupabaseConnection(): Promise<void> {
  console.log('🔌 Checking Supabase connection...');
  
  const isConnected = await checkSupabaseConnection();
  
  if (isConnected) {
    console.log('🚀 Supabase connection established successfully');
  } else {
    console.error('💥 Failed to connect to Supabase. Please check your environment variables.');
  }
} 