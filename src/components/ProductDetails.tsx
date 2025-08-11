'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useStore } from '@/hooks/use-store';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

type ProductVariant = {
  id: string;
  variant_type: string;
  variant_name: string;
  stock: number;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  product_variants: ProductVariant[];
};

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const { store, currencySymbol } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract subdomain from pathname
  const subdomain = pathname.split('/')[1];
  
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Group variants by type
  const variantGroups = product.product_variants.reduce((groups, variant) => {
    if (!groups[variant.variant_type]) {
      groups[variant.variant_type] = [];
    }
    groups[variant.variant_type].push(variant);
    return groups;
  }, {} as Record<string, ProductVariant[]>);

  // Calculate final price based on selected variants
  const getFinalPrice = () => {
    // For now, variants don't affect price - they're just options
    return product.price;
  };

  // Check if all required variants are selected
  const isVariantSelectionComplete = () => {
    return Object.keys(variantGroups).length === 0 || 
           Object.keys(variantGroups).every(type => selectedVariants[type]);
  };

  // Check if selected variants have stock
  const hasStock = () => {
    if (Object.keys(variantGroups).length === 0) {
      return true; // No variants, check base product stock
    }
    
    return Object.values(selectedVariants).every(variantId => {
      const variant = product.product_variants.find(v => v.id === variantId);
      return variant && variant.stock > 0;
    });
  };

  const handleVariantSelect = (variantType: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: variantId
    }));
  };

  const handleAddToCart = () => {
    if (!isVariantSelectionComplete()) {
      alert('Please select all required variants');
      return;
    }

    if (!hasStock()) {
      alert('Selected variants are out of stock');
      return;
    }

    // Create a product item with variant information
    const productWithVariants = {
      ...product,
      price: getFinalPrice(),
      selectedVariants,
      variantInfo: Object.entries(selectedVariants).map(([type, variantId]) => {
        const variant = product.product_variants.find(v => v.id === variantId);
        return `${type}: ${variant?.variant_name}`;
      }).join(', ')
    };

    addItem(productWithVariants, quantity);
  };

  const handleBuyNow = () => {
    if (!isVariantSelectionComplete()) {
      alert('Please select all required variants');
      return;
    }

    if (!hasStock()) {
      alert('Selected variants are out of stock');
      return;
    }

    // Add to cart first, then redirect to checkout
    const productWithVariants = {
      ...product,
      price: getFinalPrice(),
      selectedVariants,
      variantInfo: Object.entries(selectedVariants).map(([type, variantId]) => {
        const variant = product.product_variants.find(v => v.id === variantId);
        return `${type}: ${variant?.variant_name}`;
      }).join(', ')
    };

    addItem(productWithVariants, quantity);
    router.push(`/${subdomain}/checkout`);
  };

  const goBack = () => {
    router.push(`/${subdomain}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader storeName={store.name} subdomain={subdomain} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={goBack}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <Image
                src={product.images?.[selectedImage] || "https://placehold.co/600x600.png"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-md border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8 • 127 reviews)</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {currencySymbol}{getFinalPrice().toFixed(2)}
              </p>
            </div>

            <Separator />

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Variants */}
            {Object.keys(variantGroups).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Options</h3>
                {Object.entries(variantGroups).map(([variantType, variants]) => (
                  <div key={variantType} className="space-y-2">
                    <label className="text-sm font-medium capitalize">
                      {variantType.replace('_', ' ')}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantSelect(variantType, variant.id)}
                          className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                            selectedVariants[variantType] === variant.id
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50'
                          } ${
                            variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={variant.stock === 0}
                        >
                          {variant.variant_name}

                          {variant.stock === 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isVariantSelectionComplete() || !hasStock()}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!isVariantSelectionComplete() || !hasStock()}
                  className="flex-1"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>

              {!isVariantSelectionComplete() && (
                <p className="text-sm text-destructive">
                  Please select all required options before adding to cart.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <StoreFooter storeName={store.name} />
    </div>
  );
} 