
"use client";
import { Suspense, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, UserPlus, Eye, EyeOff, Utensils } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const signupSchema = z.object({
  email: z.string().min(1, "Email or Phone Number is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], 
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
 return (
    <Suspense fallback={<div>Loading...</div>}>
 {/* The component that uses useSearchParams should be rendered inside the Suspense boundary */}
      <SignupForm />
    </Suspense>
 );
}

function SignupForm() {
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const router = useRouter();
 const searchParams = useSearchParams();
 const { toast } = useToast();

 const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
 });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    const redirectUrl = searchParams.get('redirect') || '/';

    setIsLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Signup Successful!", description: "Welcome! You can now login." });
      router.push(redirectUrl);
    } catch (e: any) { 
      let friendlyMessage = "Failed to sign up. Please try again.";
      if (e.code === 'auth/invalid-email') {
        friendlyMessage = "Invalid email format. Please enter a valid email address for sign up.";
      } else if (e.code === 'auth/email-already-in-use') {
        friendlyMessage = "This email is already in use. Please try logging in or use a different email.";
      }
      setError(friendlyMessage);
      toast({ variant: "destructive", title: "Signup Failed", description: friendlyMessage });
    } finally {
      setIsLoading(false);
    }
  };

 return (
 <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12 px-4">
 <Card className="w-full max-w-md shadow-xl">
 <CardHeader className="text-center">
 <div className="flex items-center justify-center gap-2 mb-3">
 <Link href="/home" className="flex items-center gap-2 text-2xl font-semibold text-primary">
 <Utensils className="h-7 w-7" />
 <span className="font-headline">Eatery Express</span>
 </Link>
 </div>
 <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
 <UserPlus className="h-6 w-6 text-primary" /> Create your Account
 </CardTitle>
 <CardDescription>
              Join Eatery Express to order delicious food.
 </CardDescription>
 </CardHeader>
 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)}>
 <CardContent className="space-y-6">
 <FormField
                  control={form.control}
 name="email"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Email or Phone Number</FormLabel>
 <FormControl>
 <Input type="text" placeholder="you@example.com or 123-456-7890" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
                  control={form.control}
 name="password"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Password</FormLabel>
 <FormControl>
 <div className="relative">
 <Input
 type={showPassword ? "text" : "password"}
 placeholder="••••••••"
                            {...field}
 className="pr-10"
                        />
 <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
 <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
 </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
 </FormItem>
 )}
 />
 <FormField
                  control={form.control}
 name="confirmPassword"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Confirm Password</FormLabel>
 <FormControl>
 <div className="relative">
 <Input
 type={showConfirmPassword ? "text" : "password"}
 placeholder="••••••••"
                            {...field}
 className="pr-10"
                          />
 <Button
 type="button"
 variant="ghost"
 size="icon"
 className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
 <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
 </Button>
 </div>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account? <Link href="/" className="text-primary hover:underline font-medium">Log in</Link>
              </p> 
             </CardFooter>
           </form>
         </Form>
 </Card>
 </div>
 );
}
