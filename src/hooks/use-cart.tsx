'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Product = {
    _id: string;
    title: string;
    price: number;
    images?: string[];
    quantity?: number;
};

type CartItem = Product & {
    quantity: number;
};

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateItemQuantity: (productId: string, quantity: number) => void;
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
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
        openCart();
    };

    const removeItem = (productId: string) => {
        setItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    const updateItemQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
        } else {
            setItems(prevItems =>
                prevItems.map(item =>
                    item._id === productId ? { ...item, quantity } : item
                )
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
