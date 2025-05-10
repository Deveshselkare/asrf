'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import useLocalStorage from '@/lib/hooks/useLocalStorage';
import type { Income, Expense, AlertSetting } from '@/types/budget';
import { PageHeader } from '@/components/PageHeader';
import Image from 'next/image';

export default function DashboardPage() {
  const [income] = useLocalStorage<Income[]>('income', []);
  const [expenses] = useLocalStorage<Expense[]>('expenses', []);
  const [alerts] = useLocalStorage<AlertSetting[]>('alerts', []);

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Find active alerts (example logic, can be more sophisticated)
  const activeAlertsCount = alerts.filter(alert => {
    const categoryExpenses = expenses
      .filter(exp => exp.category === alert.category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return categoryExpenses > alert.limit;
  }).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Welcome to BudgetWise!" description="Here's a quick overview of your finances." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Income: ${totalIncome.toLocaleString()} | Expenses: ${totalExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlertsCount}</div>
            <p className="text-xs text-muted-foreground">
              {activeAlertsCount > 0 ? "Check your spending limits!" : "No active alerts."}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/transactions?action=add-income">Add Income</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/transactions?action=add-expense">Add Expense</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Budgeting Tips
            </CardTitle>
            <CardDescription>Get personalized advice to improve your finances.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze your spending patterns and receive AI-powered tips to save more.
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/budget-tips">Get Tips</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
           <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Visualize Your Spending
            </CardTitle>
            <CardDescription>See where your money goes with insightful charts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://picsum.photos/400/200?random=1" 
              alt="Chart placeholder" 
              width={400} 
              height={200} 
              className="rounded-md object-cover aspect-[2/1]"
              data-ai-hint="finance chart" 
            />
            <Button asChild variant="link" className="mt-2 p-0 h-auto">
              <Link href="/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
