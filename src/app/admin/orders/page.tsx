
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ListOrdered } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from 'react';

// Mock data for initial orders
const initialAdminOrders = [
  { id: "order101", customerName: "Alice Wonderland", date: "2024-05-20", total: 45.50, status: "Preparing", items: 3 },
  { id: "order102", customerName: "Bob The Builder", date: "2024-05-20", total: 22.00, status: "Out for Delivery", items: 1 },
  { id: "order103", customerName: "Charlie Brown", date: "2024-05-19", total: 78.90, status: "Delivered", items: 5 },
  { id: "order104", customerName: "Diana Prince", date: "2024-05-18", total: 15.25, status: "Cancelled", items: 2 },
];

type OrderStatus = "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";

interface AdminOrder {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
}

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>(initialAdminOrders);

  const statusCycle: Record<OrderStatus, OrderStatus> = {
    "Preparing": "Out for Delivery",
    "Out for Delivery": "Delivered",
    "Delivered": "Delivered", // Stays delivered
    "Cancelled": "Cancelled" // Stays cancelled
  };

  const handleUpdateOrder = (orderId: string) => {
    const orderToUpdate = orders.find(o => o.id === orderId);

    if (orderToUpdate && (orderToUpdate.status === "Cancelled" || orderToUpdate.status === "Delivered")) {
      toast({
        title: "Update Action",
        description: `Order ${orderId} is already ${orderToUpdate.status} and cannot be updated further.`,
        variant: "default",
      });
      return;
    }

    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          // The check for "Cancelled" or "Delivered" is done above,
          // so if we reach here, the order is updatable.
          const newStatus = statusCycle[order.status];
          toast({
            title: "Order Updated",
            description: `Order ${orderId} status changed to ${newStatus}.`,
          });
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  const handleCancelOrder = (orderId: string) => {
    const orderToCancel = orders.find(o => o.id === orderId);

    if (orderToCancel && (orderToCancel.status === "Cancelled" || orderToCancel.status === "Delivered")) {
      toast({
        title: "Cancel Action",
        description: `Order ${orderId} is already ${orderToCancel.status} and cannot be cancelled.`,
        variant: "default",
      });
      return;
    }

    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
           // The check for "Cancelled" or "Delivered" is done above.
          toast({
            title: "Order Cancelled",
            description: `Order ${orderId} has been cancelled.`,
            variant: "destructive",
          });
          return { ...order, status: "Cancelled" };
        }
        return order;
      })
    );
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
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
