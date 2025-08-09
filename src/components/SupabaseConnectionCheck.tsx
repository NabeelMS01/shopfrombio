'use client';

import { useEffect } from 'react';
import { checkSupabaseConnection } from '@/lib/supabase-connection-check';

export default function SupabaseConnectionCheck() {
  useEffect(() => {
    const checkConnection = async () => {
      await checkSupabaseConnection();
    };

    checkConnection();
  }, []);

  // This component doesn't render anything visible
  return null;
} 