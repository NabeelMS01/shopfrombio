import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the session cookie
    (await cookies()).delete('session');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Session cleared successfully' 
    });
  } catch (error) {
    console.error('Clear session error:', error);
    return NextResponse.json({ 
      error: 'Failed to clear session' 
    }, { status: 500 });
  }
} 