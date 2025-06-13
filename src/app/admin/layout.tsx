import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Panel - Eatery Express',
  description: 'Manage Eatery Express operations.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-semibold text-primary">
            <ShieldCheck className="h-7 w-7" />
            <span className="font-headline">Admin Panel</span>
          </Link>
          {/* Admin-specific navigation links can go here later */}
          <nav className="space-x-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              Back to Site
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-4 border-t bg-card">
        <p className="text-center text-xs text-muted-foreground">
          Eatery Express Admin Panel &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
