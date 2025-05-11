'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, TrendingUp, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import useLocalStorage from '@/lib/hooks/useLocalStorage';
import type { Income, Expense, AlertSetting } from '@/types/budget';
import { PageHeader } from '@/components/PageHeader';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [income] = useLocalStorage<Income[]>('income', []);
  const [expenses] = useLocalStorage<Expense[]>('expenses', []);
  const [alerts] = useLocalStorage<AlertSetting[]>('alerts', []);

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const currentTotalIncome = income.reduce((sum, item) => sum + item.amount, 0);
      const currentTotalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
      setTotalIncome(currentTotalIncome);
      setTotalExpenses(currentTotalExpenses);
      setBalance(currentTotalIncome - currentTotalExpenses);

      const currentActiveAlertsCount = alerts.filter(alert => {
        const categoryExpenses = expenses
          .filter(exp => exp.category === alert.category)
          .reduce((sum, exp) => sum + exp.amount, 0);
        return categoryExpenses > alert.limit;
      }).length;
      setActiveAlertsCount(currentActiveAlertsCount);
    }
  }, [income, expenses, alerts, isClient]);
  
  const renderLoading = <span className="text-sm text-muted-foreground">Loading...</span>;

  const formatCurrency = (value: number | null, options?: Intl.NumberFormatOptions) => {
    if (!isClient || value === null) return renderLoading;
    return value.toLocaleString('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2,
      ...options 
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Welcome to PennyPocket!" description="Here's a quick overview of your finances." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {!isClient
                ? renderLoading
                : `Income: ${formatCurrency(totalIncome, {minimumFractionDigits: 0, maximumFractionDigits: 0})} | Expenses: ${formatCurrency(totalExpenses, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`
              }
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{!isClient ? renderLoading : activeAlertsCount}</div>
            <p className="text-xs text-muted-foreground">
              {!isClient
                ? renderLoading
                : activeAlertsCount > 0 ? "Check your spending limits!" : "No active alerts."
              }
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
