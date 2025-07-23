'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/products", label: "Products", icon: ShoppingBag },
    { href: "/dashboard/sales", label: "Sales", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                pathname === link.href && "text-foreground"
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === link.href && "bg-muted text-primary"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </>
  );
}
