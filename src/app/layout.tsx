
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/context/CartContext';
import AppLayout from '@/components/layout/AppLayout';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Eatery Express',
  description: 'Delicious food, delivered fast.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <CartProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

