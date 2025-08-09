'use client';

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";

// We don't have store data here easily without another db call,
// so we can either pass it via props/context or just use a generic name.
// For now, let's just use a placeholder for the store name.
const STORE_NAME = "Your Store"; 

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would integrate with a payment provider like Razorpay or Stripe
        console.log("Processing payment for:", items);
        alert("Thank you for your order! (This is a demo)");
        clearCart();
        router.push('/'); // Redirect to home page after "purchase"
    };

    if (items.length === 0) {
        return (
             <div className="flex flex-col min-h-screen">
                <StoreHeader storeName={STORE_NAME} />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
                        <p className="text-muted-foreground mt-2">Add some products to get started.</p>
                        <Button onClick={() => router.back()} className="mt-4">
                            Continue Shopping
                        </Button>
                    </div>
                </main>
                 <StoreFooter storeName={STORE_NAME} />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <StoreHeader storeName={STORE_NAME} />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Shipping & Payment Form */}
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                     <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="you@example.com" required />
                                    </div>
                                </div>
                            </div>
                           
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                                 <div className="space-y-4">
                                    <Input placeholder="Full Name" required />
                                    <Input placeholder="Address" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="City" required />
                                        <Input placeholder="State / Province" required />
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="ZIP / Postal Code" required />
                                        <Input placeholder="Country" required />
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" size="lg">
                                Complete Purchase
                            </Button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-muted/50 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Image 
                                            src={item.images?.[0] || 'https://placehold.co/64x64.png'} 
                                            alt={item.title}
                                            width={64}
                                            height={64}
                                            className="rounded-md object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">${(item.price * (item.quantity ?? 1)).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-6" />
                        <div className="flex justify-between font-semibold text-lg">
                            <p>Total</p>
                            <p>${totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </main>
            <StoreFooter storeName={STORE_NAME} />
        </div>
    );
}
