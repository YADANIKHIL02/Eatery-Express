
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Settings, Loader2, Info, DollarSign, Clock, Power } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const siteSettingsSchema = z.object({
  deliveryFee: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().min(0, "Delivery fee must be a positive number.")
  ).default(5.00),
  operatingHoursStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time format (HH:MM).").default("09:00"),
  operatingHoursEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time format (HH:MM).").default("22:00"),
  maintenanceMode: z.boolean().default(false),
});

type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // In a real app, fetch existing settings and use them as defaultValues
  const [currentSettings, setCurrentSettings] = useState<SiteSettingsFormData>({
    deliveryFee: 5.00,
    operatingHoursStart: "09:00",
    operatingHoursEnd: "22:00",
    maintenanceMode: false,
  });


  const form = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: currentSettings,
  });

  const onSubmit: SubmitHandler<SiteSettingsFormData> = async (data) => {
    setIsLoading(true);
    console.log("Site Settings Updated:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentSettings(data); // Update local state for demo
    toast({
      title: "Settings Saved",
      description: "Site settings have been updated successfully.",
    });
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
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
        Configure global application settings and preferences. (Changes are logged to console for this demo).
      </CardDescription>

      <Alert variant="default" className="bg-blue-50 border-blue-400 text-blue-700 [&>svg]:text-blue-600">
        <Info className="h-5 w-5" />
        <AlertTitle className="font-semibold">Demo Functionality</AlertTitle>
        <AlertDescription>
          Settings changes are currently logged to the console and will reset on page refresh. A backend integration is needed for persistence.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Adjust core settings for the Eatery Express platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="deliveryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><DollarSign className="w-4 h-4"/>Default Delivery Fee ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 5.00" {...field} onChange={event => field.onChange(parseFloat(event.target.value))} />
                    </FormControl>
                    <FormDescription>Set the standard delivery fee for orders.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                 <FormLabel className="flex items-center gap-1.5"><Clock className="w-4 h-4"/>Platform Operating Hours</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="operatingHoursStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground">Start Time (HH:MM)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="operatingHoursEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground">End Time (HH:MM)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormDescription>Set the daily operating window for the platform.</FormDescription>
              </div>

              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-1.5"><Power className="w-4 h-4"/>Maintenance Mode</FormLabel>
                      <FormDescription>
                        Temporarily disable the platform for users.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
