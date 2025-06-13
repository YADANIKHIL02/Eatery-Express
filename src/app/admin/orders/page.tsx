
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ListOrdered, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";

// Mock data for initial orders
const initialAdminOrders = [
  { id: "order101", customerName: "Alice Wonderland", date: "2024-05-20", total: 45.50, status: "Preparing" as OrderStatus, items: 3 },
  { id: "order102", customerName: "Bob The Builder", date: "2024-05-20", total: 22.00, status: "Out for Delivery" as OrderStatus, items: 1 },
  { id: "order103", customerName: "Charlie Brown", date: "2024-05-19", total: 78.90, status: "Delivered" as OrderStatus, items: 5 },
  { id: "order104", customerName: "Diana Prince", date: "2024-05-18", total: 15.25, status: "Cancelled" as OrderStatus, items: 2 },
];

type OrderStatus = "Pending" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";

interface AdminOrder {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
}

const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Delivered": return "default"; // Default is primary
    case "Preparing": return "secondary";
    case "Out for Delivery": return "outline"; // Use outline for a distinct look, or create a blueish variant
    case "Cancelled": return "destructive";
    default: return "secondary";
  }
};
const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="mr-1.5 h-3.5 w-3.5" />;
      case "Preparing": return <Package className="mr-1.5 h-3.5 w-3.5" />;
      case "Out for Delivery": return <Truck className="mr-1.5 h-3.5 w-3.5" />;
      case "Cancelled": return <XCircle className="mr-1.5 h-3.5 w-3.5" />;
      default: return <Package className="mr-1.5 h-3.5 w-3.5" />;
    }
};


export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>(initialAdminOrders);

  const statusCycle: Record<OrderStatus, OrderStatus> = {
    "Pending": "Preparing",
    "Preparing": "Out for Delivery",
    "Out for Delivery": "Delivered",
    "Delivered": "Delivered", 
    "Cancelled": "Cancelled" 
  };

  const handleUpdateOrder = (orderId: string) => {
    const orderToUpdate = orders.find(o => o.id === orderId);

    if (!orderToUpdate || orderToUpdate.status === "Cancelled" || orderToUpdate.status === "Delivered") {
      toast({
        title: "Update Action",
        description: `Order ${orderId} is already ${orderToUpdate?.status} and cannot be updated further.`,
        variant: "default",
      });
      return;
    }

    const newStatus = statusCycle[orderToUpdate.status];

    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    });
  };

  const handleCancelOrder = (orderId: string) => {
    const orderToCancel = orders.find(o => o.id === orderId);

    if (!orderToCancel || orderToCancel.status === "Cancelled" || orderToCancel.status === "Delivered") {
      toast({
        title: "Cancel Action",
        description: `Order ${orderId} is already ${orderToCancel?.status} and cannot be cancelled.`,
        variant: "default",
      });
      return;
    }
    
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      )
    );

    toast({
      title: "Order Cancelled",
      description: `Order ${orderId} has been cancelled.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <ListOrdered className="w-8 h-8 text-primary" /> Order Management
        </h1>
        <Link href="/admin" passHref>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
          </Button>
        </Link>
      </div>
      
      <CardDescription>
        View, track, and manage all customer orders.
      </CardDescription>

      {orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Orders Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There are currently no orders to display.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>All Orders ({orders.length})</CardTitle>
            <CardDescription>A list of all orders placed through the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary hover:underline">
                        <Link href={`/orders/${order.id}`}>{order.id}</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{order.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{order.date}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{order.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                           {getStatusIcon(order.status)}
                           {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2" 
                          onClick={() => handleUpdateOrder(order.id)}
                          disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                        >
                          Update
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    