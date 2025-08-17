
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    if (!user) {
      // Store the current path to redirect back after login
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (adminOnly && !isAdmin) {
      // If adminOnly route and user is not admin, redirect to homepage.
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this page.",
        variant: "destructive",
      });
      router.push('/home'); 
    }
  }, [user, loading, isAdmin, adminOnly, router, pathname, toast]);

  if (loading || !user) {
    // Show loader if:
    // 1. Auth state is loading.
    // 2. Auth state finished loading, but no user (redirect will occur).
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (adminOnly && !isAdmin) {
     // Still show loader while redirecting non-admin from admin page
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // At this point, user is loaded, and if it's an adminOnly route, user is an admin.
  return <>{children}</>;
}
