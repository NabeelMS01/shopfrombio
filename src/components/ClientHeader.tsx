'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";

export default function ClientHeader() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/user', { credentials: 'same-origin' });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          await fetch('/api/clear-session', { method: 'POST' });
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold">ShopFromBio</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        </nav>
      </header>
    );
  }

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Briefcase className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">ShopFromBio</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {user ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
} 