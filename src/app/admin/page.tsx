
"use client"; 

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ListOrdered, Utensils, Users, AlertTriangle, Settings, BarChart3, UserCircle, Flame } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const stats = {
    pendingOrders: 5, 
    totalRestaurants: 12,
    activeUsers: 150, // Example data
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        {user && user.email && (
          <Badge variant="outline" className="text-sm font-normal py-1.5 px-3">
            <UserCircle className="mr-2 h-4 w-4" />
            Admin: {user.email}
          </Badge>
        )}
      </div>
      
      <Alert variant="destructive" className="bg-yellow-50 border-yellow-400 text-yellow-800 [&>svg]:text-yellow-600 shadow-sm">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Admin ID Information</AlertTitle>
        <AlertDescription>
          To access the admin features, log in with the email: <code className="font-mono p-0.5 bg-yellow-200/70 rounded text-yellow-900">admin@quickplate.com</code>. This is defined in the <code className="font-mono p-0.5 bg-yellow-200/70 rounded text-yellow-900">src/context/AuthContext.tsx</code> file and can be changed if needed.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ListOrdered className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Orders awaiting processing.</p>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
            <Flame className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRestaurants}</div>
             <p className="text-xs text-muted-foreground">Currently listed on the platform.</p>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
             <p className="text-xs text-muted-foreground">Users active in the last 30 days.</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold font-headline pt-4 border-t border-border mt-10">Management Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <ListOrdered className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-medium font-headline">Order Management</CardTitle>
            </div>
            <CardDescription className="text-sm">
              View, track, and update customer orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow"></CardContent> {/* Spacer */}
          <CardFooter>
            <Link href="/admin/orders" passHref className="w-full">
              <Button className="w-full" variant="outline">Manage Orders</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
           <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-medium font-headline">Restaurant Management</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Add, edit, or remove restaurants and menus.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow"></CardContent>
           <CardFooter>
            <Link href="/admin/restaurants" passHref className="w-full">
              <Button className="w-full" variant="outline">Manage Restaurants</Button>
            </Link>
          </CardFooter>
        </Card>

         <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-medium font-headline">User Management</CardTitle>
            </div>
            <CardDescription className="text-sm">
              View and manage registered user accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow"></CardContent>
          <CardFooter>
            <Link href="/admin/users" passHref className="w-full">
              <Button variant="outline" className="w-full">Manage Users</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-medium font-headline">Site Settings</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Configure global application settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow"></CardContent>
          <CardFooter>
            <Link href="/admin/settings" passHref className="w-full">
              <Button variant="outline" className="w-full">
                  Go to Settings
              </Button>
            </Link>
          </CardFooter>
        </Card>
         <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-medium font-headline">Analytics</CardTitle>
            </div>
            <CardDescription className="text-sm">
              View sales reports and performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow"></CardContent>
          <CardFooter>
            <Link href="/admin/analytics" passHref className="w-full">
              <Button variant="outline" className="w-full">
                  View Analytics
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
