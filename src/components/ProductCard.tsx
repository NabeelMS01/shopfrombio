'use client';

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useStore } from "@/hooks/use-store";
import { ShoppingCart, Eye } from "lucide-react";

type Product = {
    id: string;
    title: string;
    price: number;
    images?: string[];
};

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const { currencySymbol } = useStore();

    const handleBuyNow = () => {
        addItem(product, 1);
        // If we are on a tenant route /{subdomain}/..., keep the prefix
        const parts = pathname.split('/').filter(Boolean);
        const maybeSub = parts[0];
        const target = maybeSub ? `/${maybeSub}/checkout` : '/checkout';
        router.push(target);
    };

    return (
        <Card className="flex flex-col group cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="p-0 border-b relative">
                <Image
                    src={product.images?.[0] || "https://placehold.co/600x400.png"}
                    alt={product.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-64"
                    data-ai-hint="product fashion"
                />
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            const parts = pathname.split('/').filter(Boolean);
                            const maybeSub = parts[0];
                            const target = maybeSub ? `/${maybeSub}/product/${product.id}` : `/product/${product.id}`;
                            router.push(target);
                        }}
                        className="bg-white/90 hover:bg-white text-black"
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg">{product.title}</CardTitle>
                <CardDescription className="text-primary font-semibold text-xl mt-2">
                    {currencySymbol}{product.price.toFixed(2)}
                </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full" onClick={() => addItem(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
                <Button className="w-full" onClick={handleBuyNow}>Buy Now</Button>
            </CardFooter>
        </Card>
    );
}
