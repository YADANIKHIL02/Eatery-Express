
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
        // If adminOnly route and user is not admin, redirect to homepage.
        // console.warn("Access to admin route denied. User is not an admin. Redirecting to home.");
        toast({
          title: "Access Denied",
          description: "You do not have permission to view this page.",
          variant: "destructive",
        });
        router.push('/'); 
      }
    }
  }, [user, loading, isAdmin, adminOnly, router, pathname]);

  if (loading || (!user && !loading) || (adminOnly && !isAdmin && user && !loading)) {
    // Show loader if:
    // 1. Auth state is loading.
    // 2. Auth state finished loading, no user (redirect will occur).
    // 3. Auth state finished loading, user exists, but it's an adminOnly route and user isn't admin (redirect will occur).
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  // At this point, user is loaded, and if it's an adminOnly route, user is an admin.
  return <>{children}</>;
}

// Basic toast for AuthGuard (cannot use useToast directly here easily without context issues in redirects)
// A more robust solution might involve a global non-React toast or passing toast via props.
const toast = (options: {title: string, description: string, variant: string}) => {
  // This is a simplified toast for the guard. In a real app, you might use a global toast instance.
  console.warn(`AuthGuard Toast: ${options.title} - ${options.description} (${options.variant})`);
};
