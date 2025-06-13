
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Settings, Construction } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" /> Site Settings
        </h1>
        <Link href="/admin" passHref>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
          </Button>
        </Link>
      </div>
      
      <CardDescription>
        Configure global application settings and preferences.
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
            The site settings management functionality is currently under development. 
            This section will allow administrators to configure various aspects of the DineGo platform.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Potential Settings (Examples):</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
              <li>Delivery fee configuration.</li>
              <li>Operating hours for the platform.</li>
              <li>Currency settings.</li>
              <li>Notification preferences for admins.</li>
              <li>Maintenance mode toggle.</li>
              <li>Integration settings for third-party services (e.g., payment gateways).</li>
              <li>Theme and branding options.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
