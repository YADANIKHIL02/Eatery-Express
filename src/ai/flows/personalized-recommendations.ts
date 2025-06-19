'use server';

/**
 * @fileOverview Personalized restaurant or meal recommendation AI agent.
 *
 * - recommend - A function that handles the recommendation process.
 * - RecommendationInput - The input type for the recommend function.
 * - RecommendationOutput - The return type for the recommend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendationInputSchema = z.object({
  pastOrderHistory: z
    .string()
    .describe('The user past order history, as a text.'),
  preferences: z.string().describe('The user preferences.'),
});
export type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

const RecommendationOutputSchema = z.object({
  recommendation: z.string().describe('The personalized restaurant or meal recommendation.'),
  reason: z.string().describe('The reason for the recommendation.'),
});
export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

export async function recommend(input: RecommendationInput): Promise<RecommendationOutput> {
  return recommendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: RecommendationInputSchema},
  output: {schema: RecommendationOutputSchema},
  prompt: `You are a restaurant recommendation expert.

You will use the user past order history and preferences to generate a personalized restaurant or meal recommendation.

Past Order History: {{{pastOrderHistory}}}
Preferences: {{{preferences}}}

Recommendation:`,
});

const recommendFlow = ai.defineFlow(
  {
    name: 'recommendFlow',
    inputSchema: RecommendationInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
