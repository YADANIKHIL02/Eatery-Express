
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Users, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type UserRole = "Admin" | "User";
type UserStatus = "Active" | "Suspended" | "Pending";

interface AdminUser {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: string; // Using string for simplicity, could be Date
  status: UserStatus;
}

const initialAdminUsers: AdminUser[] = [
  { id: 'usr_123', email: 'alice@example.com', displayName: 'Alice Wonderland', role: 'User', createdAt: '2024-01-15', status: 'Active' },
  { id: 'usr_456', email: 'bob@example.com', displayName: 'Bob The Builder', role: 'User', createdAt: '2024-02-10', status: 'Active' },
  { id: 'usr_789', email: 'admin@quickplate.com', displayName: 'Admin User', role: 'Admin', createdAt: '2023-12-01', status: 'Active' },
  { id: 'usr_000', email: 'charlie@example.com', displayName: 'Charlie Brown', role: 'User', createdAt: '2024-03-01', status: 'Suspended' },
  { id: 'usr_001', email: 'diana@example.com', displayName: 'Diana Prince', role: 'User', createdAt: '2024-04-05', status: 'Pending' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers);
  const { toast } = useToast();

  const handleEditUser = (userId: string) => {
    toast({ title: "Edit User", description: `Placeholder for editing user ${userId}. Feature not implemented.`});
  };

  const handleDeleteUser = (userId: string) => {
    // In a real app, this would involve a confirmation dialog and an API call
    // For now, we'll just filter the user out of the local state for demo purposes
    // setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({ title: "Delete User", description: `Placeholder for deleting user ${userId}. Feature not implemented.`, variant: "destructive" });
  };

  const getRoleBadgeVariant = (role: UserRole): "default" | "secondary" | "outline" => {
    if (role === "Admin") return "default"; // Primary color
    return "secondary";
  };

  const getStatusBadgeVariant = (status: UserStatus): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "Active") return "default"; // Primary color (often green-like in themes)
    if (status === "Suspended") return "destructive";
    if (status === "Pending") return "outline"; // Yellow-like or distinct
    return "secondary";
  };
  
  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case "Active": return <UserCheck className="mr-1.5 h-3.5 w-3.5" />;
      case "Suspended": return <UserX className="mr-1.5 h-3.5 w-3.5" />;
      default: return <UserCheck className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />; // Default or pending
    }
  };


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

      {users.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Users Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There are currently no users to display.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
            <CardDescription>A list of all registered users on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-primary">{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.displayName || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)} className="capitalize">
                           {getStatusIcon(user.status)}
                           {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="hover:text-primary mr-1" onClick={() => handleEditUser(user.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit User</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete User</span>
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
