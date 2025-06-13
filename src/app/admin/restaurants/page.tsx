
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Utensils, Construction } from "lucide-react";

export default function AdminRestaurantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Utensils className="w-8 h-8 text-primary" /> Restaurant Management
        </h1>
        <Link href="/admin" passHref>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
          </Button>
        </Link>
      </div>
      
      <CardDescription>
        Add, edit, or remove restaurants, manage menus, and update restaurant details.
      </CardDescription>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="w-6 h-6 text-amber-500" /> 
            Feature Under Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The restaurant management functionality is currently under development. 
            This section will allow administrators to control all aspects of restaurant listings on the QuickPlate platform.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Planned Features:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
              <li>View a list of all restaurants.</li>
              <li>Add new restaurants with details (name, cuisine, location, images).</li>
              <li>Edit existing restaurant information.</li>
              <li>Manage menus for each restaurant (add, edit, delete dishes).</li>
              <li>Set restaurant operating hours.</li>
              <li>Temporarily deactivate or activate restaurant listings.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

