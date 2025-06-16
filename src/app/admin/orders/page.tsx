
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ListOrdered, Package, Truck, CheckCircle, XCircle, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for initial orders
const initialAdminOrders = [
  { id: "order101", customerName: "Alice Wonderland", date: "2024-05-20", total: 45.50, status: "Preparing" as OrderStatus, items: 3, restaurant: "Pizza Palace" },
  { id: "order102", customerName: "Bob The Builder", date: "2024-05-20", total: 22.00, status: "Out for Delivery" as OrderStatus, items: 1, restaurant: "Sushi Central" },
  { id: "order103", customerName: "Charlie Brown", date: "2024-05-19", total: 78.90, status: "Delivered" as OrderStatus, items: 5, restaurant: "Burger Barn" },
  { id: "order104", customerName: "Diana Prince", date: "2024-05-18", total: 15.25, status: "Cancelled" as OrderStatus, items: 2, restaurant: "Pasta Perfection" },
  { id: "order105", customerName: "Edward Elric", date: "2024-05-21", total: 33.10, status: "Pending" as OrderStatus, items: 2, restaurant: "Taco Town" },
];

type OrderStatus = "Pending" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";

interface AdminOrder {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
  restaurant: string;
}

const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Delivered": return "default"; // Default is primary (often green-ish with themes)
    case "Preparing": return "secondary";
    case "Out for Delivery": return "outline"; 
    case "Cancelled": return "destructive";
    case "Pending": return "outline"; 
    default: return "secondary";
  }
};

const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="mr-1.5 h-3.5 w-3.5 text-green-600" />;
      case "Preparing": return <Package className="mr-1.5 h-3.5 w-3.5 text-yellow-600" />;
      case "Out for Delivery": return <Truck className="mr-1.5 h-3.5 w-3.5 text-blue-600" />;
      case "Cancelled": return <XCircle className="mr-1.5 h-3.5 w-3.5 text-red-600" />;
      case "Pending": return <ListOrdered className="mr-1.5 h-3.5 w-3.5 text-gray-500" />;
      default: return <Package className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />;
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
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
        View, track, and manage all customer orders. (Using mock data for interactions)
      </CardDescription>

      {orders.length === 0 ? (
        <Card className="shadow-md">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-primary hover:underline">
                        <Link href={`/orders/${order.id}`}>{order.id}</Link>
                      </TableCell>
                      <TableCell className="text-foreground">{order.customerName}</TableCell>
                      <TableCell className="text-muted-foreground">{order.restaurant}</TableCell>
                      <TableCell className="text-muted-foreground">{order.date}</TableCell>
                      <TableCell className="text-muted-foreground text-center">{order.items}</TableCell>
                      <TableCell className="text-foreground">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize whitespace-nowrap">
                           {getStatusIcon(order.status)}
                           {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:text-primary"
                          onClick={() => toast({title: "View Order", description: "Navigating to order details (placeholder)"})}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:text-yellow-600"
                          onClick={() => handleUpdateOrder(order.id)}
                          disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Update Status
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:text-destructive"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
