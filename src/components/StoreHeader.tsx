'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import CartSheet from "./CartSheet";

export default function StoreHeader({ storeName }: { storeName: string }) {
  const { totalItems, openCart } = useCart();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b sticky top-0 z-40">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Briefcase className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">{storeName}</span>
      </Link>
      <nav className="ml-auto">
        <Button variant="ghost" size="icon" onClick={openCart}>
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open Cart</span>
        </Button>
      </nav>
      <CartSheet />
    </header>
  );
}
