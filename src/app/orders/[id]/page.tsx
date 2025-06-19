
"use client"; 

import React, { useEffect, useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ChevronLeft, Clock, Package, Truck, Loader2, ShoppingBag, MapPin, PhoneCall, ClipboardList, Activity } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AuthGuard from '@/components/guards/AuthGuard'; 
import { Separator } from '@/components/ui/separator';

interface OrderDetailsPageParams {
  params: { id: string };
}
type PageProps = OrderDetailsPageParams;

interface MockOrderDetails {
  id: string;
  date: string;
  total: number;
  status: OrderStatus; // Using a more specific type
  items: Array<{ name: string; quantity: number; price: number }>;
  estimatedDeliveryTime: string;
  deliveryAddress: string;
  contactNumber: string;
}

type OrderStatus = "Pending" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";


async function getOrderDetails(orderId: string): Promise<MockOrderDetails | null> {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  if (orderId.startsWith('mock')) {
     const baseOrder = {
        id: orderId,
        date: '2024-05-18',
        total: orderId === 'mock123' ? 35.99 : 22.50,
        items: [
            { name: orderId === 'mock123' ? 'Margherita Pizza' : 'Sushi Platter', quantity: 1, price: orderId === 'mock123' ? 20.99 : 17.50 },
            { name: orderId === 'mock123' ? 'Coke' : 'Miso Soup', quantity: 2, price: orderId === 'mock123' ? 2.50 : 2.50 },
        ],
        deliveryAddress: '123 Foodie Lane, Flavor Town, FT 54321',
        contactNumber: '(555) 987-6543',
     }
     if (orderId === 'mock123') {
        return { ...baseOrder, status: 'Delivered' as OrderStatus, estimatedDeliveryTime: 'Delivered on May 18, 2024, 7:30 PM' }
     }
     return { ...baseOrder, status: 'Preparing' as OrderStatus, estimatedDeliveryTime: 'May 18, 2024, 8:00 PM - 8:30 PM' }
  }
  if (!orderId.startsWith('mock') && orderId.length === 9) { 
    return {
      id: orderId,
      date: new Date().toISOString(),
      total: Math.random() * 50 + 20, 
      status: 'Preparing' as OrderStatus,
      items: [
        { name: 'Personalized Meal Recommendation', quantity: 1, price: 25.00 },
        { name: 'Delivery Fee', quantity: 1, price: 5.00 },
      ],
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryAddress: '123 Main St, Anytown, USA', 
      contactNumber: '(555) 123-4567',
    };
  }

  return null; 
}

export default function OrderDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params as Promise<{ id: string }> | { id: string });
  const searchParamsHook = useSearchParams(); 
  const isNewOrder = searchParamsHook.get('new') === 'true';
  const [orderDetails, setOrderDetails] = useState<MockOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resolvedParams && typeof resolvedParams.id === 'string') {
      async function fetchData() {
        setLoading(true);
        const data = await getOrderDetails(resolvedParams.id);
        setOrderDetails(data);
        setLoading(false);
      }
      fetchData();
    } else {
      console.error("Order ID not available from resolved params.");
      setLoading(false);
      setOrderDetails(null);
    }
  }, [resolvedParams?.id]); 

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return { icon: <CheckCircle className="w-5 h-5 text-green-600" />, text: 'Delivered', color: 'text-green-700 bg-green-100/80 border-green-300' };
      case 'Out for Delivery': return { icon: <Truck className="w-5 h-5 text-blue-600" />, text: 'Out for Delivery', color: 'text-blue-700 bg-blue-100/80 border-blue-300' };
      case 'Preparing': return { icon: <Clock className="w-5 h-5 text-yellow-600" />, text: 'Preparing', color: 'text-yellow-700 bg-yellow-100/80 border-yellow-300' };
      case 'Cancelled': return { icon: <Package className="w-5 h-5 text-red-600" />, text: 'Cancelled', color: 'text-red-700 bg-red-100/80 border-red-300' };
      default: return { icon: <Package className="w-5 h-5 text-muted-foreground" />, text: 'Pending', color: 'text-muted-foreground bg-muted/50 border-border' };
    }
  };

  const statusInfo = orderDetails ? getStatusInfo(orderDetails.status) : getStatusInfo('Pending');

  return (
    <AuthGuard>
      {loading ? (
         <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : !orderDetails ? (
        <Card className="text-center py-10 shadow-lg">
            <CardHeader>
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-2xl font-semibold font-headline">Order Not Found</CardTitle>
                <CardDescription>We couldn't find details for this order. It might have been cancelled or there was an issue.</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
                <Link href="/orders" passHref>
                    <Button variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" /> View All Orders
                    </Button>
                </Link>
            </CardFooter>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <Link href="/orders" passHref>
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Orders
              </Button>
            </Link>
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                {statusInfo.icon}
                <span>{statusInfo.text}</span>
            </div>
          </div>

          {isNewOrder && (
            <Alert variant="default" className="bg-green-50 border-green-400 text-green-700 [&>svg]:text-green-600">
              <CheckCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Order Placed Successfully!</AlertTitle>
              <AlertDescription>
                Your order <span className="font-medium">#{orderDetails.id}</span> has been confirmed. You can track its progress below.
              </AlertDescription>
            </Alert>
          )}

          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="font-headline text-2xl md:text-3xl">Order #{orderDetails.id}</CardTitle>
                  <CardDescription className="text-sm">
                    Placed on: {new Date(orderDetails.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </div>
                <div className="text-right">
                    <p className="text-muted-foreground text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">${orderDetails.total.toFixed(2)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Estimated Delivery:</h3>
                <p className="text-primary font-medium">{orderDetails.estimatedDeliveryTime}</p>
              </div>
              
              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Package className="w-5 h-5 text-primary" />Items Ordered:</h3>
                <ul className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                        <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground"> (x{item.quantity})</span>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/>Delivery Address:</h3>
                  <p className="text-sm text-muted-foreground">{orderDetails.deliveryAddress}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><PhoneCall className="w-5 h-5 text-primary"/>Contact:</h3>
                  <p className="text-sm text-muted-foreground">{orderDetails.contactNumber}</p>
                </div>
              </div>

              <Separator />
              
              <div className="pt-2">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-primary" />Order Progress</h3>
                <div className="flex items-start space-x-2 md:space-x-4 text-xs md:text-sm">
                  {[
                    { label: 'Order Placed', status: 'Pending', icon: Package },
                    { label: 'Preparing', status: 'Preparing', icon: Clock },
                    { label: 'Out for Delivery', status: 'Out for Delivery', icon: Truck },
                    { label: 'Delivered', status: 'Delivered', icon: CheckCircle },
                  ].map((step, index, arr) => {
                    const isActive = orderDetails.status === step.status || 
                                     (orderDetails.status === 'Delivered' && step.status !== 'Cancelled') ||
                                     (orderDetails.status === 'Out for Delivery' && (step.status === 'Pending' || step.status === 'Preparing')) ||
                                     (orderDetails.status === 'Preparing' && step.status === 'Pending');
                    const isCompleted = (orderDetails.status === 'Delivered' && step.status !== 'Cancelled') ||
                                        (orderDetails.status === 'Out for Delivery' && (step.status === 'Pending' || step.status === 'Preparing')) ||
                                        (orderDetails.status === 'Preparing' && step.status === 'Pending' && orderDetails.status !== step.status);

                    const IconComponent = step.icon;
                    return (
                      <React.Fragment key={step.label}>
                        <div className={`flex flex-col items-center text-center ${isActive || isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isActive || isCompleted ? 'border-primary bg-primary/10' : 'border-border'}`}>
                            <IconComponent className={`w-5 h-5 ${isActive || isCompleted ? 'text-primary' : ''}`} />
                          </div>
                          <span className={`mt-1.5 font-medium ${isActive || isCompleted ? 'text-primary' : ''}`}>{step.label}</span>
                        </div>
                        {index < arr.length - 1 && (
                          <div className={`flex-grow h-0.5 mt-5 ${isCompleted || (isActive && step.status !== orderDetails.status) ? 'bg-primary' : 'bg-border'}`}></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      )}
    </AuthGuard>
  );
}
