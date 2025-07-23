import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { getUserFromSession } from "@/lib/session";

export default async function Header() {
  const user = await getUserFromSession();

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
