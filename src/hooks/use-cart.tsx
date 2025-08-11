'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Product = {
    id: string;
    title: string;
    price: number;
    images?: string[];
    quantity?: number;
    selectedVariants?: Record<string, string>;
    variantInfo?: string;
};

type CartItem = Product & {
    quantity: number;
};

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string, selectedVariants?: Record<string, string>) => void;
    updateItemQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Load cart from localStorage on initial render
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setItems(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addItem = (product: Product, quantity = 1) => {
        setItems(prevItems => {
            // Create a unique key for products with variants
            const variantKey = product.selectedVariants ? 
                `${product.id}-${JSON.stringify(product.selectedVariants)}` : 
                product.id;
            
            const existingItem = prevItems.find(item => {
                const itemVariantKey = item.selectedVariants ? 
                    `${item.id}-${JSON.stringify(item.selectedVariants)}` : 
                    item.id;
                return itemVariantKey === variantKey;
            });
            
            if (existingItem) {
                return prevItems.map(item => {
                    const itemVariantKey = item.selectedVariants ? 
                        `${item.id}-${JSON.stringify(item.selectedVariants)}` : 
                        item.id;
                    return itemVariantKey === variantKey
                        ? { ...item, quantity: item.quantity + quantity }
                        : item;
                });
            }
            return [...prevItems, { ...product, quantity }];
        });
        openCart();
    };

    const removeItem = (productId: string, selectedVariants?: Record<string, string>) => {
        setItems(prevItems => {
            if (!selectedVariants) {
                return prevItems.filter(item => item.id !== productId);
            }
            
            const variantKey = `${productId}-${JSON.stringify(selectedVariants)}`;
            return prevItems.filter(item => {
                const itemVariantKey = item.selectedVariants ? 
                    `${item.id}-${JSON.stringify(item.selectedVariants)}` : 
                    item.id;
                return itemVariantKey !== variantKey;
            });
        });
    };

    const updateItemQuantity = (productId: string, quantity: number, selectedVariants?: Record<string, string>) => {
        if (quantity <= 0) {
            removeItem(productId, selectedVariants);
        } else {
            setItems(prevItems =>
                prevItems.map(item => {
                    const itemVariantKey = item.selectedVariants ? 
                        `${item.id}-${JSON.stringify(item.selectedVariants)}` : 
                        item.id;
                    const targetVariantKey = selectedVariants ? 
                        `${productId}-${JSON.stringify(selectedVariants)}` : 
                        productId;
                    
                    return itemVariantKey === targetVariantKey ? { ...item, quantity } : item;
                })
            );
        }
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateItemQuantity, clearCart, totalItems, totalPrice, isCartOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
