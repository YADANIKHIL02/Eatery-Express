"use server";

import { recommend, type RecommendationInput, type RecommendationOutput } from '@/ai/flows/personalized-recommendations';
import { z } from 'zod';

const RecommendationActionInputSchema = z.object({
  pastOrderHistory: z.string(),
  preferences: z.string(),
});

export async function recommendPersonalizedMeal(input: RecommendationInput): Promise<RecommendationOutput> {
  const parsedInput = RecommendationActionInputSchema.safeParse(input);

  if (!parsedInput.success) {
    // This should ideally not happen if client-side validation is also in place
    throw new Error("Invalid input for recommendation.");
  }

  try {
    const result = await recommend(parsedInput.data);
    return result;
  } catch (error) {
    console.error("Error getting recommendation from AI flow:", error);
    // Consider more specific error handling or re-throwing a custom error
    throw new Error("Could not fetch recommendation at this time.");
  }
}
