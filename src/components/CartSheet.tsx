'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

export default function CartSheet() {
  const { items, removeItem, updateItemQuantity, totalPrice, isCartOpen, closeCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
    closeCart();
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
        </SheetHeader>
        <Separator />
        {items.length > 0 ? (
            <>
                <ScrollArea className="my-4 flex-1 px-6">
                    <div className="flex flex-col gap-6">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center space-x-4">
                                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                                    <Image
                                        src={item.images?.[0] || 'https://placehold.co/80x80.png'}
                                        alt={item.title}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col gap-1 self-start text-sm">
                                    <span className="font-medium">{item.title}</span>
                                    <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                                            className="w-16 p-1 border rounded-md text-center"
                                        />
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <SheetFooter className="px-6 py-4 bg-background border-t">
                    <div className="w-full space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                         <Button onClick={handleCheckout} className="w-full" size="lg">
                            Proceed to Checkout
                        </Button>
                    </div>
                </SheetFooter>
            </>
        ) : (
            <div className="flex flex-1 items-center justify-center text-center px-6">
                <div>
                    <h3 className="text-lg font-semibold">Your cart is empty</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Add some items to see them here.
                    </p>
                </div>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
