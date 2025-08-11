'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import CartSheet from "./CartSheet";

export default function StoreHeader({ storeName, subdomain }: { storeName: string; subdomain: string }) {
  const { totalItems, openCart } = useCart();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b sticky top-0 z-40">
      <Link href={`/${subdomain}`} className="flex items-center justify-center" prefetch={false}>
        <Briefcase className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">{storeName}</span>
      </Link>
      <nav className="ml-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={openCart} 
          className="relative hover:bg-muted/80 transition-colors"
          aria-label={`Shopping cart with ${totalItems} items`}
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full border-2 border-background shadow-sm">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
          <span className="sr-only">Open Cart</span>
        </Button>
      </nav>
      <CartSheet />
    </header>
  );
}
