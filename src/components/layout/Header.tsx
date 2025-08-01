
"use client";

import Link from 'next/link';
import { Home, ListOrdered, ShoppingCart, Utensils, Shield, LogIn, LogOut, UserCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Header() {
  const { cartCount } = useCart();
  const { user, loading, isAdmin } = useAuth(); // Added isAdmin
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getUserInitials = (email?: string | null) => {
    if (!email) return 'U';
    const nameParts = user?.displayName?.split(' ') || [];
    if (nameParts.length >= 2) {
      return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Utensils className="h-7 w-7" />
          <span className="font-headline">Eatery Express</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          <Link href="/home" passHref>
            <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-primary px-2 sm:px-3">
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          
          {user && (
            <>
              <Link href="/orders" passHref>
                <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-primary px-2 sm:px-3">
                  <ListOrdered className="h-5 w-5" />
                  <span className="hidden sm:inline">Orders</span>
                </Button>
              </Link>
              {isAdmin && ( // Conditionally render Admin link
                <Link href="/admin" passHref>
                  <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-primary px-2 sm:px-3">
                    <Shield className="h-5 w-5" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}
            </>
          )}

          <Link href="/cart" passHref>
            <Button variant="ghost" className="relative flex items-center gap-1 text-foreground hover:text-primary px-2 sm:px-3">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {hasMounted && cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full px-0 sm:px-3 sm:w-auto sm:gap-2">
                     <Avatar className="h-7 w-7 sm:h-6 sm:w-6">
                       <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
                       <AvatarFallback>{getUserInitials(user.email)}</AvatarFallback>
                     </Avatar>
                     <span className="hidden sm:inline text-sm">{user.displayName || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/orders')}>
                    <ListOrdered className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  {isAdmin && ( // Conditionally render Admin Panel link in dropdown
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                     <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/" passHref>
                <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-primary px-2 sm:px-3">
                  <LogIn className="h-5 w-5" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )
          )}
          {loading && (
             <Button variant="ghost" className="flex items-center gap-1 text-foreground px-2 sm:px-3" disabled>
                <Loader2 className="h-5 w-5 animate-spin" />
             </Button>
          )}

        </nav>
      </div>
    </header>
  );
}
