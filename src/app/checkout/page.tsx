
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Home, Phone, User, Loader2, Wallet, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(2, "City is required."),
  postalCode: z.string().min(5, "Valid postal code is required."),
  phoneNumber: z.string().min(10, "Valid phone number is required."),
  paymentMethod: z.enum(["creditCard", "cashOnDelivery", "upi"], { required_error: "Please select a payment method." }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && cartItems.length === 0 && !isProcessing) {
      router.push('/');
    }
  }, [hasMounted, cartItems, isProcessing, router]);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      phoneNumber: "",
      paymentMethod: "creditCard",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  if (!hasMounted) {
    return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (cartItems.length === 0 && !isProcessing) {
    // Still show loader while redirecting to prevent flash of content
    return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    setIsProcessing(true);
    console.log("Checkout Data:", data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const orderId = Math.random().toString(36).substr(2, 9);
    
    toast({
      title: "Order Placed Successfully!",
      description: `Your order ID is ${orderId}. We'll notify you about its status.`,
      duration: 5000,
    });
    clearCart();
    router.push(`/orders/${orderId}?new=true`);
    // No need to setIsProcessing(false) here as the component will unmount or re-evaluate.
  };

  const deliveryFee = 5.00;
  const totalAmount = cartTotal + deliveryFee;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-8 text-center">Checkout</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="md:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Home className="w-5 h-5 text-primary"/>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="postalCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl><Input placeholder="12345" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary"/>Payment Method</CardTitle>
                 <CardDescription>This is a simplified payment section for demo purposes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormControl>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary cursor-pointer">
                                    <Input
                                      type="radio"
                                      name={field.name}
                                      value="creditCard"
                                      checked={field.value === "creditCard"}
                                      onChange={() => field.onChange("creditCard")}
                                      className="sr-only"
                                    />
                                    <CreditCard className="w-5 h-5" /> Credit Card
                                </Label>
                                <Label className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary cursor-pointer">
                                    <Input
                                      type="radio"
                                      name={field.name}
                                      value="cashOnDelivery"
                                      checked={field.value === "cashOnDelivery"}
                                      onChange={() => field.onChange("cashOnDelivery")}
                                      className="sr-only"
                                    />
                                    <Wallet className="w-5 h-5" /> Cash on Delivery
                                </Label>
                                <Label className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary cursor-pointer">
                                    <Input
                                      type="radio"
                                      name={field.name}
                                      value="upi"
                                      checked={field.value === "upi"}
                                      onChange={() => field.onChange("upi")}
                                      className="sr-only"
                                    />
                                    <Smartphone className="w-5 h-5" /> UPI Payment
                                </Label>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <p className="text-sm text-muted-foreground">
                  Secure payment processing by Eatery Express.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" size="lg" className="w-full" disabled={isProcessing || cartItems.length === 0}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
