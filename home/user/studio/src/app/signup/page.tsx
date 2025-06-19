'use client';

import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import Link from 'next/link';
import {useAuth} from '@/context/AuthContext';
import {toast} from '@/components/ui/use-toast';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const {signup, currentUser} = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/login';

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setPasswordError('');
    setEmailError('');

    try {
      await signup(values.email, values.password);
      toast({
        title: 'Signup Successful!',
        description: 'You have successfully created an account.',
      });
      router.push('/');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('Email already in use.');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Password is too weak.');
      } else {
        toast({
          title: 'Signup Failed',
          description: error.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    } 
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Sign Up</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  {emailError && (
                    <p className="text-sm font-medium text-red-500">
                      {emailError}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  {passwordError && (
                    <p className="text-sm font-medium text-red-500">
                      {passwordError}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href={redirectUrl} className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}