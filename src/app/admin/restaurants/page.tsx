
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Flame, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminRestaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  isActive: boolean;
}

const initialAdminRestaurants: AdminRestaurant[] = [
  { id: 'resto_001', name: 'Pizza Palace', cuisine: 'Italian', location: '123 Main St', isActive: true },
  { id: 'resto_002', name: 'Sushi Central', cuisine: 'Japanese', location: '456 Oak Ave', isActive: true },
  { id: 'resto_003', name: 'Burger Barn', cuisine: 'American', location: '789 Pine Rd', isActive: false },
  { id: 'resto_004', name: 'Taco Town', cuisine: 'Mexican', location: '101 Maple Dr', isActive: true },
];

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>(initialAdminRestaurants);
  const { toast } = useToast();

  const handleEditRestaurant = (restaurantId: string) => {
    toast({ title: "Edit Restaurant", description: `Placeholder for editing restaurant ${restaurantId}. Feature not implemented.` });
  };

  const handleDeleteRestaurant = (restaurantId: string) => {
    setRestaurants(prevRestaurants => prevRestaurants.filter(r => r.id !== restaurantId));
    toast({ title: "Restaurant Deleted", description: `Restaurant ${restaurantId} has been removed (mock).`, variant: "destructive" });
  };

  const handleToggleActive = (restaurantId: string) => {
    setRestaurants(prevRestaurants =>
      prevRestaurants.map(r =>
        r.id === restaurantId ? { ...r, isActive: !r.isActive } : r
      )
    );
    toast({ title: "Restaurant Status Updated", description: `Restaurant ${restaurantId} status changed (mock).`});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Flame className="w-8 h-8 text-primary" /> Restaurant Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Restaurant
            </Button>
            <Link href="/admin" passHref className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Admin
            </Button>
            </Link>
        </div>
      </div>
      
      <CardDescription>
        Add, edit, or remove restaurants, manage menus, and update restaurant details. (Mock data operations)
      </CardDescription>

      {restaurants.length === 0 ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>No Restaurants Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There are currently no restaurants to display. Click "Add New Restaurant" to begin.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>All Restaurants ({restaurants.length})</CardTitle>
            <CardDescription>A list of all restaurants on the QuickPlate platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Cuisine</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium text-primary">{restaurant.id}</TableCell>
                      <TableCell>{restaurant.name}</TableCell>
                      <TableCell>{restaurant.cuisine}</TableCell>
                      <TableCell>{restaurant.location}</TableCell>
                      <TableCell>
                        <Badge variant={restaurant.isActive ? "default" : "secondary"}>
                          {restaurant.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-1">
                          <Button variant="ghost" size="sm" className="hover:text-primary" onClick={() => handleEditRestaurant(restaurant.id)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant={restaurant.isActive ? "outline" : "default"} 
                            size="sm" 
                            onClick={() => handleToggleActive(restaurant.id)}
                            className={restaurant.isActive ? "hover:bg-yellow-500/10 hover:text-yellow-600" : "hover:bg-green-500/10 hover:text-green-600"}
                          >
                            {restaurant.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:text-destructive">
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete restaurant {restaurant.name}? This action cannot be undone (for this mock setup).
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRestaurant(restaurant.id)} className="bg-destructive hover:bg-destructive/90">
                                  Delete Restaurant
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
