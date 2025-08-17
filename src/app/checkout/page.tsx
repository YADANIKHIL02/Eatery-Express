
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart, type CartItem } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Home, Loader2, Smartphone, ShoppingBag, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthGuard from '@/components/guards/AuthGuard';
import type { MockOrderDetails } from '@/types';

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(2, "City is required."),
  postalCode: z.string().min(5, "Valid postal code is required."),
  phoneNumber: z.string().min(10, "Valid phone number is required.").regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Invalid phone number format."),
  paymentMethod: z.enum(["creditCard", "cashOnDelivery", "upi"], { required_error: "Please select a payment method." }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  upiId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "upi") {
    if (!data.upiId || data.upiId.length < 3 || !data.upiId.includes('@')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid UPI ID (e.g., name@bank) is required.",
        path: ["upiId"],
      });
    }
  }
  if (data.paymentMethod === "creditCard") {
    if (!data.cardNumber || !/^\d{13,19}$/.test(data.cardNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid card number (13-19 digits) is required.",
        path: ["cardNumber"],
      });
    }
    if (!data.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)) {
       ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid expiry date (MM/YY) is required.",
        path: ["expiryDate"],
      });
    } else {
        const [month, year] = data.expiryDate.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Card has expired.",
                path: ["expiryDate"],
            });
        }
    }
    if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid CVV (3 or 4 digits) is required.",
        path: ["cvv"],
      });
    }
  }
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
      toast({
        title: "Your cart is empty",
        description: "Redirecting you to the homepage.",
        variant: "default"
      });
      router.push('/home');
    }
  }, [hasMounted, cartItems, isProcessing, router, toast]);

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
      upiId: "",
    },
  });
  
  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    setIsProcessing(true);
    console.log("Checkout Data:", data);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderId = `qp_${Math.random().toString(36).substr(2, 9)}`;
    const deliveryFee = 5.00;
    const totalAmount = cartTotal + deliveryFee;

    // Create the order details object
    const newOrder: MockOrderDetails = {
        id: orderId,
        date: new Date().toISOString(),
        total: totalAmount,
        status: 'Preparing',
        items: cartItems.map((item: CartItem) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            description: item.description,
            imageUrl: item.imageUrl,
            restaurantId: item.restaurantId,
            category: item.category,
        })),
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        deliveryAddress: `${data.address}, ${data.city}, ${data.postalCode}`,
        contactNumber: data.phoneNumber,
    };

    // Save to localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem(orderId, JSON.stringify(newOrder));
    }
    
    toast({
      title: "Order Placed Successfully!",
      description: `Your order ID is ${orderId}. We'll notify you about its status.`,
      duration: 5000,
    });
    
    clearCart();
    router.push(`/orders/${orderId}?new=true`);
  };

  const deliveryFee = 5.00;
  const totalAmount = cartTotal + deliveryFee;

  if (!hasMounted || (cartItems.length === 0 && !isProcessing)) {
    return (
      <AuthGuard>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AuthGuard>
    );
  }
  
  const selectedPaymentMethod = form.watch("paymentMethod");

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-8 text-center">Secure Checkout</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="md:col-span-1 space-y-8">
              <Card className="shadow-lg">
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
                                  <Label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary cursor-pointer transition-colors">
                                      <Input
                                        type="radio"
                                        name={field.name}
                                        value="creditCard"
                                        checked={field.value === "creditCard"}
                                        onChange={() => field.onChange("creditCard")}
                                        className="sr-only"
                                      />
                                      <CreditCard className="w-6 h-6 text-primary" /> 
                                      <span className="font-medium">Credit Card</span>
                                  </Label>
                                  <Label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary cursor-pointer transition-colors">
                                      <Input
                                        type="radio"
                                        name={field.name}
                                        value="cashOnDelivery"
                                        checked={field.value === "cashOnDelivery"}
                                        onChange={() => field.onChange("cashOnDelivery")}
                                        className="sr-only"
                                      />
                                      <Wallet className="w-6 h-6 text-primary" /> 
                                      <span className="font-medium">Cash on Delivery</span>
                                  </Label>
                                  <Label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary cursor-pointer transition-colors">
                                      <Input
                                        type="radio"
                                        name={field.name}
                                        value="upi"
                                        checked={field.value === "upi"}
                                        onChange={() => field.onChange("upi")}
                                        className="sr-only"
                                      />
                                      <Smartphone className="w-6 h-6 text-primary" /> 
                                      <span className="font-medium">UPI Payment</span>
                                  </Label>
                              </div>
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />

                  {selectedPaymentMethod === "creditCard" && (
                    <div className="space-y-4 pt-2">
                      <FormField control={form.control} name="cardNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="expiryDate" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="cvv" render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl><Input placeholder="123" type="password" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "upi" && (
                     <div className="space-y-4 pt-2">
                        <FormField
                          control={form.control}
                          name="upiId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>UPI ID</FormLabel>
                              <FormControl>
                                <Input placeholder="yourname@bank" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter your UPI ID for payment.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Secure payment processing by QuickPlate.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card className="shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary"/>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
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
                    {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </AuthGuard>
  );
}
