
"use client";

import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/guards/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Mail, Edit3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isAdmin } = useAuth(); // Assuming isAdmin is available from AuthContext
  const router = useRouter();

  const getUserInitials = (email?: string | null) => {
    if (!email) return 'U';
    const nameParts = user?.displayName?.split(' ') || [];
    if (nameParts.length >= 2) {
      return nameParts[0][0] + nameParts[1][0];
    }
    return email.substring(0, 2).toUpperCase();
  };

  if (!user) {
    // AuthGuard should handle redirect, but this is a fallback
    return <p>Loading user information or redirecting...</p>;
  }

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
            <UserCircle className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold font-headline">My Profile</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center text-center p-6 bg-muted/30 rounded-t-lg">
            <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-md">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
              <AvatarFallback className="text-3xl">{getUserInitials(user.email)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-headline">
              {user.displayName || "Valued User"}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" /> {user.email}
            </CardDescription>
            {isAdmin && (
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/50">
                <Shield className="h-3 w-3 mr-1.5" /> Admin
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Details</h3>
              <Separator className="mb-3"/>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-muted-foreground">Email:</span> {user.email}</p>
                <p><span className="font-medium text-muted-foreground">User ID:</span> {user.uid}</p>
                <p><span className="font-medium text-muted-foreground">Email Verified:</span> {user.emailVerified ? 'Yes' : 'No'}</p>
                 <p><span className="font-medium text-muted-foreground">Last Sign-in:</span> {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}</p>
                <p><span className="font-medium text-muted-foreground">Account Created:</span> {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : 'N/A'}</p>
              </div>
            </div>

            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" disabled className="w-full sm:w-auto">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Coming Soon)
                </Button>
                 <Button variant="outline" disabled className="w-full sm:w-auto">
                  Change Password (Coming Soon)
                </Button>
              </div>
            </div>
            
            {isAdmin && (
               <>
                <Separator />
                <div>
                    <h3 className="text-lg font-semibold mb-3">Admin Actions</h3>
                    <Button variant="default" onClick={() => router.push('/admin')} className="w-full sm:w-auto">
                        <Shield className="mr-2 h-4 w-4" /> Go to Admin Panel
                    </Button>
                </div>
               </>
            )}

          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
