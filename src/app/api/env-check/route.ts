import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
  };

  console.log('Environment check:', envCheck);

  return NextResponse.json({
    environment: envCheck,
    message: 'Check console for details'
  });
} 