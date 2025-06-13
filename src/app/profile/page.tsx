
"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/guards/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Mail, Edit3, Shield, LockKeyhole, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import EditProfileDialog from '@/components/profile/EditProfileDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ProfilePage() {
  const { user, isAdmin, loading: authLoading } = useAuth(); 
  const router = useRouter();
  const { toast } = useToast();
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);

  const getUserInitials = (email?: string | null) => {
    if (!email) return 'U';
    const nameParts = user?.displayName?.split(' ') || [];
    if (nameParts.length >= 2) {
      return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const handleOpenEditProfileDialog = () => {
    setIsEditProfileDialogOpen(true);
  };

  const handleSendPasswordReset = async () => {
    if (!user || !user.email) {
      toast({ variant: "destructive", title: "Error", description: "No user email found to send reset link." });
      return;
    }
    setIsPasswordResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email inbox (and spam folder) for instructions to reset your password.",
        duration: 7000,
      });
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send Email",
        description: error.message || "Could not send password reset email. Please try again later.",
      });
    } finally {
      setIsPasswordResetLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // AuthGuard should handle redirect, but this is a fallback
    // It might briefly show if AuthGuard's redirect hasn't kicked in yet.
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
         <p className="ml-4">Loading user information or redirecting...</p>
       </div>
    );
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
                <p><span className="font-medium text-muted-foreground">Display Name:</span> {user.displayName || 'Not set'}</p>
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
                <Button variant="outline" onClick={handleOpenEditProfileDialog} className="w-full sm:w-auto">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <LockKeyhole className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Change Password</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to change your password? We will send a password reset link to your registered email address: <span className="font-semibold">{user.email}</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isPasswordResetLoading}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSendPasswordReset} disabled={isPasswordResetLoading}>
                        {isPasswordResetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Email
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
      <EditProfileDialog isOpen={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen} />
    </AuthGuard>
  );
}
