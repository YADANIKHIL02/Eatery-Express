"use client";

import Link from 'next/link';
import { Home, ListOrdered, ShoppingCart, Utensils } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Utensils className="h-7 w-7" />
          <span className="font-headline">Eatery Express</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-primary">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Button>
          </Link>
          <Link href="/orders" passHref>
            <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-primary">
              <ListOrdered className="h-5 w-5" />
              <span>Orders</span>
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button variant="ghost" className="relative flex items-center gap-1 text-foreground hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
