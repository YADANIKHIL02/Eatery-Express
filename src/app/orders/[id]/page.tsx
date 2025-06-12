"use client"; // For using useSearchParams

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ChevronLeft, Clock, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OrderDetailsPageParams {
  params: { id: string };
}

// Mock function to get order details. In a real app, this would fetch from a backend.
async function getOrderDetails(orderId: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  // This is mock data. A real app would have a database.
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
        return { ...baseOrder, status: 'Delivered', estimatedDeliveryTime: 'Delivered on May 18, 2024, 7:30 PM' }
     }
     return { ...baseOrder, status: 'Preparing', estimatedDeliveryTime: 'May 18, 2024, 8:00 PM - 8:30 PM' }
  }

  return {
    id: orderId,
    date: new Date().toISOString(),
    total: Math.random() * 50 + 20, // Random total
    status: 'Preparing',
    items: [
      { name: 'Personalized Meal Recommendation', quantity: 1, price: 25.00 },
      { name: 'Delivery Fee', quantity: 1, price: 5.00 },
    ],
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    deliveryAddress: '123 Main St, Anytown, USA',
    contactNumber: '(555) 123-4567',
  };
}

// This page should be a client component if it uses hooks like useSearchParams directly.
// Or, fetch data in a server component and pass to a client component if needed.
// For simplicity with useSearchParams, making it client.
export default function OrderDetailsPage({ params }: OrderDetailsPageParams) {
  const searchParams = useSearchParams();
  const isNewOrder = searchParams.get('new') === 'true';
  const [orderDetails, setOrderDetails] = React.useState<Awaited<ReturnType<typeof getOrderDetails>> | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getOrderDetails(params.id);
      setOrderDetails(data);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-10">Loading order details...</div>;
  }

  if (!orderDetails) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold">Order not found.</h1>
        <Link href="/orders" passHref>
          <Button variant="link" className="mt-4">View all orders</Button>
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    if (status === 'Delivered') return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (status === 'Out for Delivery') return <Truck className="w-6 h-6 text-blue-500" />;
    if (status === 'Preparing') return <Clock className="w-6 h-6 text-yellow-500" />;
    return <Package className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="space-y-8">
      <Link href="/orders" passHref>
        <Button variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Orders
        </Button>
      </Link>

      {isNewOrder && (
        <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Order Placed Successfully!</AlertTitle>
          <AlertDescription>
            Your order <span className="font-medium">#{orderDetails.id}</span> has been confirmed. You can track its progress below.
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl">Order #{orderDetails.id}</CardTitle>
              <CardDescription>
                Placed on: {new Date(orderDetails.date).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
              ${orderDetails.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                orderDetails.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                orderDetails.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700' }
            ">
              {getStatusIcon(orderDetails.status)}
              <span>{orderDetails.status}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-1">Estimated Delivery:</h3>
            <p className="text-primary">{orderDetails.estimatedDeliveryTime}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Items:</h3>
            <ul className="space-y-1 text-sm list-disc list-inside pl-1">
              {orderDetails.items.map((item, index) => (
                <li key={index}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)}</li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Delivery Address:</h3>
              <p className="text-sm text-muted-foreground">{orderDetails.deliveryAddress}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Contact:</h3>
              <p className="text-sm text-muted-foreground">{orderDetails.contactNumber}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Total Amount:</h3>
            <p className="text-lg font-bold text-primary">${orderDetails.total.toFixed(2)}</p>
          </div>
          
          {/* Simplified Progress Tracker */}
          <div className="pt-4">
            <h3 className="font-semibold mb-3">Order Progress</h3>
            <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm">
              <div className={`flex flex-col items-center text-center ${orderDetails.status === 'Pending' || orderDetails.status === 'Preparing' || orderDetails.status === 'Out for Delivery' || orderDetails.status === 'Delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Package className="w-7 h-7 mb-1"/><span>Order Placed</span>
              </div>
              <div className="flex-grow h-0.5 bg-border"></div>
              <div className={`flex flex-col items-center text-center ${orderDetails.status === 'Preparing' || orderDetails.status === 'Out for Delivery' || orderDetails.status === 'Delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Clock className="w-7 h-7 mb-1"/><span>Preparing</span>
              </div>
              <div className="flex-grow h-0.5 bg-border"></div>
              <div className={`flex flex-col items-center text-center ${orderDetails.status === 'Out for Delivery' || orderDetails.status === 'Delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Truck className="w-7 h-7 mb-1"/><span>Out for Delivery</span>
              </div>
              <div className="flex-grow h-0.5 bg-border"></div>
              <div className={`flex flex-col items-center text-center ${orderDetails.status === 'Delivered' ? 'text-green-500' : 'text-muted-foreground'}`}>
                <CheckCircle className="w-7 h-7 mb-1"/><span>Delivered</span>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
