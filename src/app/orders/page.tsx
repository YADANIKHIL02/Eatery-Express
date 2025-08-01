
"use client"; 

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ListOrdered, ShoppingBag, ChevronRight, Package, Clock, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/guards/AuthGuard'; 
import { useEffect, useState } from 'react'; 
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MockOrder {
  id: string;
  date: string;
  total: number;
  status: "Pending" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  itemsPreview: string; 
  restaurantName: string; 
}

async function getOrdersForUser(): Promise<MockOrder[]> {
  await new Promise(resolve => setTimeout(resolve, 700));
  return [
    { id: 'mock123', date: '2024-05-15', total: 35.99, status: 'Delivered', itemsPreview: "Margherita Pizza, Coke (x2)", restaurantName: "Pizza Palace" },
    { id: 'mock456', date: '2024-05-18', total: 22.50, status: 'Preparing', itemsPreview: "Sushi Platter, Miso Soup", restaurantName: "Sushi Central" },
    { id: 'mock789', date: '2024-05-20', total: 18.75, status: 'Out for Delivery', itemsPreview: "Classic Burger, Fries", restaurantName: "Burger Barn" },
    { id: 'mock101', date: '2024-05-19', total: 42.00, status: 'Cancelled', itemsPreview: "Spaghetti Carbonara", restaurantName: "Pasta Perfection" },
  ];
}


const getStatusInfo = (status: MockOrder['status']) => {
    switch (status) {
      case 'Delivered': return { icon: <CheckCircle className="w-4 h-4 text-green-600" />, text: 'Delivered', color: 'text-green-700 bg-green-100/80 border-green-300',textColor: 'text-green-700' };
      case 'Out for Delivery': return { icon: <Truck className="w-4 h-4 text-blue-600" />, text: 'Out for Delivery', color: 'text-blue-700 bg-blue-100/80 border-blue-300', textColor: 'text-blue-700' };
      case 'Preparing': return { icon: <Clock className="w-4 h-4 text-yellow-600" />, text: 'Preparing', color: 'text-yellow-700 bg-yellow-100/80 border-yellow-300', textColor: 'text-yellow-700' };
      case 'Cancelled': return { icon: <Package className="w-4 h-4 text-red-600" />, text: 'Cancelled', color: 'text-red-700 bg-red-100/80 border-red-300', textColor: 'text-red-700' };
      default: return { icon: <Package className="w-4 h-4 text-muted-foreground" />, text: 'Pending', color: 'text-muted-foreground bg-muted/50 border-border', textColor: 'text-muted-foreground' };
    }
};


export default function OrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const userOrders = await getOrdersForUser(); 
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
          <Card className="text-center py-12 shadow-lg">
            <CardHeader>
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="font-headline text-2xl">No Orders Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-6">
                You haven't placed any orders with us. Start exploring restaurants and find your next favorite meal!
              </CardDescription>
              <Link href="/home" passHref>
                <Button size="lg">Browse Restaurants</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <Card key={order.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardHeader className="p-5 bg-muted/30">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground">ORDER ID</span>
                        <CardTitle className="font-headline text-lg text-primary">#{order.id}</CardTitle>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.text}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-3">
                     <div>
                        <p className="text-sm font-semibold text-foreground">{order.restaurantName}</p>
                        <p className="text-xs text-muted-foreground">
                          Ordered on: {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                     </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">Items: {order.itemsPreview}</p>
                    <div className="flex justify-between items-center pt-2">
                        <p className="text-lg font-bold text-foreground">${order.total.toFixed(2)}</p>
                        <Link href={`/orders/${order.id}`} passHref>
                            <Button variant="outline" size="sm" className="group">
                                View Details <ChevronRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
