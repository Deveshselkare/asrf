'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useLocalStorage from '@/lib/hooks/useLocalStorage';
import type { Income, Expense, ExpenseCategory } from '@/types/budget';
import { generateBudgetTipsAction } from './actions';
import { Lightbulb, Zap, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/hooks/use-toast';
import type { BudgetTipsInput } from '@/ai/flows/budget-tips';

export default function BudgetTipsPage() {
  const [incomeData] = useLocalStorage<Income[]>('income', []);
  const [expenseData] = useLocalStorage<Expense[]>('expenses', []);
  const { toast } = useToast();

  const [currentIncome, setCurrentIncome] = useState<number>(() => {
    // Calculate average monthly income or take latest if available.
    // For simplicity, let's sum all income. A more robust app might average or ask user.
    return incomeData.reduce((sum, item) => sum + item.amount, 0);
  });
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const aggregateExpenses = (): BudgetTipsInput['expenses'] => {
    const categoryMap: Record<string, number> = {};
    expenseData.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categoryMap).map(([category, amount]) => ({ category, amount }));
  };

  const handleGenerateTips = async () => {
    setIsLoading(true);
    setTips([]);

    if (currentIncome <= 0) {
      toast({
        title: "Invalid Income",
        description: "Please enter a valid monthly income.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    const aggregatedExpenses = aggregateExpenses();
    if (aggregatedExpenses.length === 0) {
       toast({
        title: "No Expenses",
        description: "Please add some expenses to get personalized tips.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateBudgetTipsAction({
        income: currentIncome,
        expenses: aggregatedExpenses,
      });
      setTips(result.tips);
      if (result.tips.length === 0 || result.tips[0].startsWith("Sorry")) {
        toast({
          title: "Tips Generation Issue",
          description: result.tips[0] || "Could not generate tips.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Budget Tips Generated!",
          description: "Check out your personalized advice below."
        });
      }
    } catch (error) {
      console.error("Failed to generate tips:", error);
      toast({
        title: "Error",
        description: "Failed to generate budget tips. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Budgeting Tips" 
        description="Get smart advice to optimize your spending and save more."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Financial Snapshot</CardTitle>
          <CardDescription>
            Review or update your current financial details to get the most accurate tips.
            Your total recorded income is used by default. You can adjust it below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentIncome">Your Approximate Monthly Income</Label>
            <Input
              id="currentIncome"
              type="number"
              value={currentIncome}
              onChange={(e) => setCurrentIncome(parseFloat(e.target.value) || 0)}
              placeholder="Enter your total monthly income"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Current Aggregated Expenses</Label>
            <Textarea
              readOnly
              value={aggregateExpenses().map(e => `${e.category}: $${e.amount.toFixed(2)}`).join('\n') || 'No expenses recorded yet.'}
              className="mt-1 h-32 bg-muted/50"
              placeholder="Expenses will be summarized here from your transaction records."
            />
             <p className="text-xs text-muted-foreground mt-1">These are automatically calculated from your recorded transactions.</p>
          </div>
          <Button onClick={handleGenerateTips} disabled={isLoading} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Generate Smart Tips
          </Button>
        </CardContent>
      </Card>

      {tips.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Your Personalized Budgeting Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc list-inside text-sm">
              {tips.map((tip, index) => (
                <li key={index} className="leading-relaxed p-2 bg-background rounded-md border border-border">
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
