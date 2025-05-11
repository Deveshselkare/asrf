'use server';

import { getBudgetTips as getAIBudgetTips, type BudgetTipsInput, type BudgetTipsOutput } from '@/ai/flows/budget-tips';

export async function generateBudgetTipsAction(input: BudgetTipsInput): Promise<BudgetTipsOutput> {
  try {
    
    if (input.income <= 0) {
      return { tips: ["Please provide a valid income to get budget tips."] };
    }
    if (input.expenses.length === 0) {
      return { tips: ["Please add some expenses to get personalized budget tips."] };
    }

    const tips = await getAIBudgetTips(input);
    return tips;
  } catch (error) {
    console.error("Error generating budget tips:", error);
    
    return { tips: ["Sorry, we couldn't generate tips at this moment. Please try again later or ensure your input is valid."] };
  }
}
