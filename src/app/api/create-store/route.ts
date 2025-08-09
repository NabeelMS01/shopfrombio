import { NextRequest, NextResponse } from 'next/server';
import { createStore } from '@/app/actions/store';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Call the existing createStore action
    const result = await createStore({}, formData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Create store API error:', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
} 