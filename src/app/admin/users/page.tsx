
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Users, Construction } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" /> User Management
        </h1>
        <Link href="/admin" passHref>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
          </Button>
        </Link>
      </div>
      
      <CardDescription>
        View, manage, and edit user accounts on the platform.
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
            The full user management functionality, including listing, editing, and deleting users, is currently under development. 
            This page serves as a placeholder for these upcoming features.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Planned Features:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
              <li>View a list of all registered users.</li>
              <li>Search and filter users.</li>
              <li>View individual user details.</li>
              <li>Edit user roles and permissions (e.g., assign admin rights).</li>
              <li>Suspend or ban user accounts.</li>
              <li>Delete user accounts (with appropriate safeguards).</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
