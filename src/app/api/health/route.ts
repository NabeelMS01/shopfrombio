import { NextResponse } from 'next/server';
import { checkSupabaseConnection } from '@/lib/supabase-connection-check';

export async function GET() {
  try {
    const isConnected = await checkSupabaseConnection();
    
    if (isConnected) {
      return NextResponse.json(
        { 
          status: 'healthy', 
          message: 'Database connected successfully',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          status: 'unhealthy', 
          message: 'Database connection failed',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 