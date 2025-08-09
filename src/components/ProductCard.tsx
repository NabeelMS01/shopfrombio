'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";

type Product = {
    id: string;
    title: string;
    price: number;
    images?: string[];
};

type ProductCardProps = {
    product: Product;
    currencySymbol?: string;
};

export default function ProductCard({ product, currencySymbol = '$' }: ProductCardProps) {
    const { addItem } = useCart();
    const router = useRouter();

    const handleBuyNow = () => {
        addItem(product, 1);
        router.push('/checkout');
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0 border-b">
                <Image
                    src={product.images?.[0] || "https://placehold.co/600x400.png"}
                    alt={product.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-64"
                    data-ai-hint="product fashion"
                />
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
