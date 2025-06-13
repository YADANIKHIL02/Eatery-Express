
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, BarChart3, Construction } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
        View sales reports, performance metrics, and other key analytics for the platform.
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
            The analytics and reporting dashboard is currently under development. 
            This section will provide valuable insights into sales, user activity, and platform performance.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Planned Analytics (Examples):</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
              <li>Total sales (daily, weekly, monthly).</li>
              <li>Number of orders.</li>
              <li>Average order value.</li>
              <li>Most popular restaurants and dishes.</li>
              <li>User registration trends.</li>
              <li>Peak order times.</li>
              <li>Revenue by restaurant.</li>
              <li>Customizable date ranges for reports.</li>
            </ul>
          </div>
          <p className="mt-4 text-muted-foreground text-sm">
            Consider integrating a charting library like Recharts (already in `components/ui/chart.tsx`) to visualize this data effectively.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
