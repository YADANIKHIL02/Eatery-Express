
"use client"; // Required for AuthGuard and hooks

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ListOrdered, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/guards/AuthGuard'; // Import AuthGuard
import { useEffect, useState } from 'react'; // For mock data fetching
import { Loader2 } from 'lucide-react';

// In a real app, this would fetch user's orders
async function getOrdersForUser() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  // Mock: Return an empty array or a few sample orders if needed for UI
  return [
    { id: 'mock123', date: '2024-05-15', total: 35.99, status: 'Delivered', itemsPreview: "Pizza, Coke" },
    { id: 'mock456', date: '2024-05-18', total: 22.50, status: 'Preparing', itemsPreview: "Sushi Platter" },
  ];
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  itemsPreview: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const userOrders = await getOrdersForUser(); // In a real app, pass user ID or token
      setOrders(userOrders);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <AuthGuard>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-2">
          <ListOrdered className="w-8 h-8 text-primary" /> Your Orders
        </h1>
        <p className="text-muted-foreground">
          View your past and current order history.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12 shadow-md">
            <CardHeader>
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="font-headline text-2xl">No Orders Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-6">
                You haven't placed any orders with us. Start exploring restaurants and find your next favorite meal!
              </CardDescription>
              <Link href="/" passHref>
                <Button size="lg">Browse Restaurants</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>Date: {new Date(order.date).toLocaleDateString()}</CardDescription>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">Items: {order.itemsPreview}</p>
                  <p className="text-md font-semibold">Total: ${order.total.toFixed(2)}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/orders/${order.id}`} passHref>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
