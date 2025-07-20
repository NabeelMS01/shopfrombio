'use client';

import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Briefcase className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">ShopFromBio</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost" onClick={() => router.push('/login')}>
            Login
        </Button>
        <Button onClick={() => router.push('/signup')}>
            Sign Up
        </Button>
      </nav>
    </header>
  );
}
