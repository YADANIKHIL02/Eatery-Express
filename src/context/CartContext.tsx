"use client";

import type { CartItem, Dish } from '@/types';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (dish: Dish) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'eateryExpressCart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (dish: Dish) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === dish.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== dishId));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === dishId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
