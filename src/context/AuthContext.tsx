
"use client";

import type { User } from 'firebase/auth';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

// --- IMPORTANT ---
// For demonstration purposes, admin access is granted if the user's email matches ADMIN_EMAIL.
// In a production application, use Firebase Custom Claims for secure role management.
// This client-side check is NOT secure for production.
const ADMIN_EMAIL = 'admin@eateryexpress.com';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (email: string, pass: string) => Promise<any>;
  signin: (email: string, pass: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if the logged-in user's email matches the designated admin email.
        // REMINDER: This is NOT a secure way to handle admin roles in production.
        setIsAdmin(currentUser.email === ADMIN_EMAIL);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  }

  const signin = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signup, signin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
