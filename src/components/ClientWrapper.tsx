'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the connection check component with no SSR
const SupabaseConnectionCheck = dynamic(
  () => import("./SupabaseConnectionCheck"),
  { ssr: false }
);

export default function ClientWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until the component is mounted on the client
  if (!isMounted) {
    return null;
  }

  return <SupabaseConnectionCheck />;
} 