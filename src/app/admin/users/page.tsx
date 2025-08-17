
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Users, Edit, Trash2, UserCheck, UserX, ShieldAlert, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({ title: "User Deleted", description: `User ${userId} has been removed.`, variant: "destructive" });
  };

  const handleToggleUserStatus = (userId: string) => {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;

      if (userToUpdate.role === 'Admin') {
          toast({ title: "Action Denied", description: "Admin user status cannot be changed in this demo.", variant: "destructive" });
          return;
      }
      
      const newStatus = userToUpdate.status === 'Active' ? 'Suspended' : 'Active';
      const toastMessage = userToUpdate.status === 'Active' 
          ? `User ${userToUpdate.email} has been suspended.`
          : `User ${userToUpdate.email} has been activated.`;

      setUsers(prevUsers =>
          prevUsers.map(user =>
              user.id === userId ? { ...user, status: newStatus } : user
          )
      );

      toast({ title: "User Status Updated", description: toastMessage });
  };


  const getRoleBadgeVariant = (role: UserRole): "default" | "secondary" | "outline" => {
    if (role === "Admin") return "default"; // Primary color
    return "secondary";
  };

  const getStatusBadgeVariant = (status: UserStatus): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "Active") return "default"; 
    if (status === "Suspended") return "destructive";
    if (status === "Pending") return "outline"; 
    return "secondary";
  };
  
  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case "Active": return <UserCheck className="mr-1.5 h-3.5 w-3.5" />;
      case "Suspended": return <UserX className="mr-1.5 h-3.5 w-3.5" />;
      case "Pending": return <AlertCircle className="mr-1.5 h-3.5 w-3.5" />;
      default: return <UserCheck className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />;
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
        View, manage, and edit user accounts on the platform. (Mock data operations)
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
                          {user.role === 'Admin' && <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />}
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
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-1">
                          <Button variant="ghost" size="sm" className="hover:text-primary" onClick={() => handleEditUser(user.id)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant={user.status === 'Active' ? "outline" : "default"} 
                            size="sm" 
                            onClick={() => handleToggleUserStatus(user.id)}
                            disabled={user.role === 'Admin'}
                            className={user.status === 'Active' ? "hover:bg-yellow-500/10 hover:text-yellow-600" : "hover:bg-green-500/10 hover:text-green-600"}
                          >
                            {user.status === 'Active' ? <UserX className="h-4 w-4 mr-1"/> : <UserCheck className="h-4 w-4 mr-1"/>}
                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:text-destructive" disabled={user.role === 'Admin'}>
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete user {user.email}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">
                                  Delete User
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
