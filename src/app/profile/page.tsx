
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/guards/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Mail, Edit3, Shield, LockKeyhole, Loader2, CalendarDays, Info, CheckCircle, XCircle, ClipboardUser, Settings2, Edit } from 'lucide-react';
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
    if (nameParts.length >= 2 && nameParts[0] && nameParts[1]) {
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
  
  if (!user) return null; // AuthGuard should handle this, but as a fallback.

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
            <UserCircle className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold font-headline">My Profile</h1>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="flex flex-col items-center text-center p-6 bg-muted/20 rounded-t-lg">
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
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
                <Shield className="h-3.5 w-3.5 mr-1.5" /> Admin Access
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground/90 flex items-center gap-2">
                <ClipboardUser className="w-5 h-5 text-primary" />
                Account Details
              </h3>
              <Separator className="mb-4"/>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <UserCircle className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium text-muted-foreground">Display Name:</span>
                    <p className="text-foreground">{user.displayName || 'Not set'}</p>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium text-muted-foreground">Email:</span>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-muted-foreground" />
                   <div>
                    <span className="font-medium text-muted-foreground">User ID:</span>
                    <p className="text-foreground text-xs">{user.uid}</p>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                   {user.emailVerified ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" /> }
                  <div>
                    <span className="font-medium text-muted-foreground">Email Verified:</span>
                    <p className="text-foreground">{user.emailVerified ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <span className="font-medium text-muted-foreground">Last Sign-in:</span>
                        <p className="text-foreground">{user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <span className="font-medium text-muted-foreground">Account Created:</span>
                        <p className="text-foreground">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : 'N/A'}</p>
                    </div>
                </div>
              </div>
            </div>

            <Separator className="my-6"/>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground/90 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Manage Account
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={handleOpenEditProfileDialog} className="w-full sm:w-auto justify-start sm:justify-center">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center">
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
                <Separator className="my-6"/>
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground/90 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Admin Area
                    </h3>
                    <Button variant="default" onClick={() => router.push('/admin')} className="w-full sm:w-auto justify-start sm:justify-center">
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
