"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { recommendPersonalizedMeal } from '@/app/actions/recommendationActions'; // Server action

const recommendationSchema = z.object({
  pastOrderHistory: z.string().min(10, "Please describe your past orders in more detail."),
  preferences: z.string().min(5, "Please tell us a bit about your preferences."),
});

type RecommendationFormData = z.infer<typeof recommendationSchema>;

interface RecommendationResult {
  recommendation: string;
  reason: string;
}

export default function RecommendationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecommendationFormData>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      pastOrderHistory: '',
      preferences: '',
    },
  });

  const onSubmit: SubmitHandler<RecommendationFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setRecommendationResult(null);
    try {
      const result = await recommendPersonalizedMeal(data);
      setRecommendationResult(result);
    } catch (e) {
      setError("Failed to get recommendation. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl">Personalized Meal Recommendation</CardTitle>
        </div>
        <CardDescription>
          Tell us about your past orders and preferences, and our AI will suggest something you'll love!
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="pastOrderHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Order History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Ordered pepperoni pizza last week, enjoyed spicy chicken curry, often get sushi..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Love Italian food, vegetarian, prefer mild spice, looking for something healthy..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Get Recommendation
            </Button>
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {recommendationResult && (
              <Alert variant="default" className="bg-primary/10 border-primary/30">
                <Sparkles className="h-5 w-5 text-primary" />
                <AlertTitle className="font-semibold text-primary">Here's your recommendation!</AlertTitle>
                <AlertDescription className="text-foreground/90">
                  <p className="font-medium mt-2 mb-1">{recommendationResult.recommendation}</p>
                  <p className="text-sm">{recommendationResult.reason}</p>
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
