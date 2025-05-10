// src/ai/flows/budget-tips.ts
'use server';

/**
 * @fileOverview Provides AI-powered personalized budgeting tips based on user's income and expenses.
 *
 * - getBudgetTips - A function that generates budget tips for the user.
 * - BudgetTipsInput - The input type for the getBudgetTips function.
 * - BudgetTipsOutput - The return type for the getBudgetTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetTipsInputSchema = z.object({
  income: z.number().describe('The user monthly income.'),
  expenses: z
    .array(z.object({category: z.string(), amount: z.number()}))
    .describe('A list of expenses with category and amount.'),
});
export type BudgetTipsInput = z.infer<typeof BudgetTipsInputSchema>;

const BudgetTipsOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe('A list of personalized budget tips for the user.'),
});
export type BudgetTipsOutput = z.infer<typeof BudgetTipsOutputSchema>;

export async function getBudgetTips(input: BudgetTipsInput): Promise<BudgetTipsOutput> {
  return budgetTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetTipsPrompt',
  input: {schema: BudgetTipsInputSchema},
  output: {schema: BudgetTipsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's income and expenses and provide personalized budgeting tips.

Income: {{income}}
Expenses:
{{#each expenses}}
- Category: {{category}}, Amount: {{amount}}
{{/each}}

Provide tips on how the user can save money and improve their financial habits. Be specific and actionable.
Tips should be concise and easy to understand.

Format your answer as a list of tips.`,
});

const budgetTipsFlow = ai.defineFlow(
  {
    name: 'budgetTipsFlow',
    inputSchema: BudgetTipsInputSchema,
    outputSchema: BudgetTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
