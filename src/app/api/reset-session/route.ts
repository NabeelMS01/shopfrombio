import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear all possible session cookies
    cookieStore.delete('session');
    cookieStore.delete('supabase-auth-token');
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');
    
    // Set a new session cookie with the correct JWT secret to override any old ones
    const response = NextResponse.json({ 
      success: true, 
      message: 'Session reset successfully' 
    });
    
    // Clear cookies in the response as well
    response.cookies.delete('session');
    response.cookies.delete('supabase-auth-token');
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    
    return response;
  } catch (error) {
    console.error('Reset session error:', error);
    return NextResponse.json({ 
      error: 'Failed to reset session' 
    }, { status: 500 });
  }
} 