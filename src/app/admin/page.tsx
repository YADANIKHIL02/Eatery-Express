"use client"; // Use client for potential future interactivity, though not strictly needed for this static content

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListOrdered, Utensils, Users, AlertTriangle, Settings } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboardPage() {
  // In a real app, you'd fetch stats or summaries here
  const stats = {
    pendingOrders: 5, // example data
    totalRestaurants: 12, // example data
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        {/* <Button>
          <Settings className="mr-2 h-4 w-4" />
          Site Settings
        </Button> */}
      </div>
      
      <Alert variant="destructive" className="bg-yellow-50 border-yellow-300 text-yellow-800 [&>svg]:text-yellow-600">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Security Notice</AlertTitle>
        <AlertDescription>
          This admin panel currently lacks authentication and authorization. Please ensure this section is secured before any production deployment.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of current operations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Pending Orders: <span className="font-semibold text-primary">{stats.pendingOrders}</span></p>
            <p>Total Restaurants: <span className="font-semibold text-primary">{stats.totalRestaurants}</span></p>
          </CardContent>
        </Card>
         <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>Configure global application settings.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Manage site-wide configurations and preferences.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled>
              <Settings className="mr-2 h-4 w-4" /> Go to Settings (Coming Soon)
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold font-headline pt-4">Management Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Order Management</CardTitle>
            <ListOrdered className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              View, track, and update customer orders.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/orders" passHref className="w-full">
              <Button className="w-full" variant="outline">Manage Orders</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Restaurant Management</CardTitle>
            <Utensils className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Add, edit, or remove restaurants and their menus.
            </p>
          </CardContent>
           <CardFooter>
            <Link href="/admin/restaurants" passHref className="w-full">
              <Button className="w-full" variant="outline">Manage Restaurants</Button>
            </Link>
          </CardFooter>
        </Card>

         <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">User Management</CardTitle>
            <Users className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              View and manage registered users.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">Manage Users (Coming Soon)</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
