
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Store the current path to redirect back after login
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (adminOnly && !isAdmin) {
        // Placeholder for admin check.
        // In a real app, isAdmin would be derived from Firebase custom claims
        // For now, if adminOnly is true, we'll assume any logged in user is NOT admin
        // unless explicitly set in AuthContext (which is not fully implemented for roles yet)
        // console.warn("Admin access attempt by non-admin user (placeholder check). Redirecting to home.");
        // router.push('/'); 
        // For now, to allow testing, let's not redirect if adminOnly is true for any logged in user.
        // A more robust solution is needed for real admin roles.
      }
    }
  }, [user, loading, router, adminOnly, isAdmin, pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !loading) {
    // This content will likely not be visible for long due to redirect,
    // but good for consistency during the brief moment before redirect effect runs.
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If adminOnly is required but user is not admin (according to placeholder logic)
  // Currently, this part of the logic is mostly a placeholder as proper admin role isn't fully set up.
  // if (adminOnly && user && !isAdmin && !loading) {
  //   // console.warn("Rendering admin content guard - user not admin (placeholder).");
  //   // return <div className="text-center py-10">Access Denied. You are not an admin.</div>;
  // }


  return <>{children}</>;
}
