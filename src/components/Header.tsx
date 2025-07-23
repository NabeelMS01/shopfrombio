import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = jwt.verify(sessionCookie, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    return null;
  }
}


export default function Header() {
  const session = getSession();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Briefcase className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">ShopFromBio</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {session ? (
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
