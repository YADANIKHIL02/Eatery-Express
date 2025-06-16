
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, BarChart3, DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { AreaChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';

// Mock data for charts
const salesData = [
  { name: 'Jan', sales: 4000, orders: 2400 },
  { name: 'Feb', sales: 3000, orders: 1398 },
  { name: 'Mar', sales: 5000, orders: 9800 },
  { name: 'Apr', sales: 2780, orders: 3908 },
  { name: 'May', sales: 1890, orders: 4800 },
  { name: 'Jun', sales: 2390, orders: 3800 },
];

const userGrowthData = [
  { month: 'Jan', users: 100 },
  { month: 'Feb', users: 120 },
  { month: 'Mar', users: 150 },
  { month: 'Apr', users: 180 },
  { month: 'May', users: 220 },
  { month: 'Jun', users: 250 },
];


export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" /> Analytics & Reports
        </h1>
        <Link href="/admin" passHref>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
          </Button>
        </Link>
      </div>
      
      <CardDescription>
        View sales reports, performance metrics, and other key analytics for the platform. (Using mock data)
      </CardDescription>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">$19,560.50</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">852</div>
            <p className="text-xs text-muted-foreground">+8.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+22% this month</p>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$22.95</div>
            <p className="text-xs text-muted-foreground">-2.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <TrendingUp className="w-5 h-5 text-primary" /> Monthly Sales Overview
                </CardTitle>
                <CardDescription>Sales and order trends over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            </linearGradient>
                             <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.7}/>
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }}/>
                        <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSales)" name="Sales ($)" />
                        <Area type="monotone" dataKey="orders" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorOrders)" name="Orders" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Users className="w-5 h-5 text-primary" /> User Growth
                </CardTitle>
                <CardDescription>New user registrations over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full p-2">
                <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={userGrowthData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                         <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                        <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip 
                             contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }}/>
                        <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsers)" name="New Users" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md mt-6">
        <CardHeader>
          <CardTitle>Further Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a basic overview. More detailed reports and custom analytics can be added, such as:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm mt-2">
            <li>Most popular restaurants and dishes.</li>
            <li>Peak order times.</li>
            <li>Revenue by restaurant.</li>
            <li>Customer retention rates.</li>
            <li>Geographical sales distribution.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
