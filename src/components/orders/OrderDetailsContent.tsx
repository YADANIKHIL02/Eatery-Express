
"use client"; 

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ChevronLeft, Clock, Package, Truck, ShoppingBag, MapPin, PhoneCall, Activity, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import type { MockOrderDetails, OrderStatus } from '@/types';

// This is now the Client Component
export default function OrderDetailsContent({ initialOrderDetails }: { initialOrderDetails: MockOrderDetails | null }) {
  const searchParams = useSearchParams();
  const isNewOrder = searchParams.get('new') === 'true';
  const [orderDetails, setOrderDetails] = useState(initialOrderDetails);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialOrderDetails?.id?.startsWith('qp_')) {
      const storedOrderData = localStorage.getItem(initialOrderDetails.id);
      if (storedOrderData) {
        try {
          const parsedOrder = JSON.parse(storedOrderData) as MockOrderDetails;
          setOrderDetails(parsedOrder);
        } catch (e) {
          console.error("Failed to parse order from localStorage", e);
        }
      }
    }
    setLoading(false);
  }, [initialOrderDetails]);


  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return { icon: <CheckCircle className="w-5 h-5 text-green-600" />, text: 'Delivered', color: 'text-green-700 bg-green-100/80 border-green-300' };
      case 'Out for Delivery': return { icon: <Truck className="w-5 h-5 text-blue-600" />, text: 'Out for Delivery', color: 'text-blue-700 bg-blue-100/80 border-blue-300' };
      case 'Preparing': return { icon: <Clock className="w-5 h-5 text-yellow-600" />, text: 'Preparing', color: 'text-yellow-700 bg-yellow-100/80 border-yellow-300' };
      case 'Cancelled': return { icon: <Package className="w-5 h-5 text-red-600" />, text: 'Cancelled', color: 'text-red-700 bg-red-100/80 border-red-300' };
      default: return { icon: <Package className="w-5 h-5 text-muted-foreground" />, text: 'Pending', color: 'text-muted-foreground bg-muted/50 border-border' };
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!orderDetails) {
    return (
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
    );
  }

  const statusInfo = getStatusInfo(orderDetails.status);

  return (
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
                {orderDetails.items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center text-sm">
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
                  const statusOrder: OrderStatus[] = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
                  const currentStatusIndex = statusOrder.indexOf(orderDetails.status);
                  const stepStatusIndex = statusOrder.indexOf(step.status as OrderStatus);

                  const isCompleted = stepStatusIndex < currentStatusIndex;
                  const isActive = stepStatusIndex === currentStatusIndex;
                  
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
                        <div className={`flex-grow h-0.5 mt-5 ${isCompleted ? 'bg-primary' : 'bg-border'}`}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
  );
}
