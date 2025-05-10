'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import useLocalStorage from '@/lib/hooks/useLocalStorage';
import type { Expense, ExpenseCategory } from '@/types/budget';
import { PageHeader } from '@/components/PageHeader';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts";
import { ALL_CATEGORIES } from '@/config/categories';

export default function ReportsPage() {
  const [expenses] = useLocalStorage<Expense[]>('expenses', []);

  const aggregateExpensesByCategory = () => {
    const categoryMap: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>;
    ALL_CATEGORIES.forEach(cat => categoryMap[cat.name] = 0);

    expenses.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name: name as ExpenseCategory, value }))
      .filter(item => item.value > 0); 
  };

  const chartData = aggregateExpensesByCategory();

  const chartConfig = {} as ChartConfig;
  chartData.forEach(item => {
    const categoryDetails = ALL_CATEGORIES.find(c => c.name === item.name);
    if (categoryDetails) {
      chartConfig[item.name] = {
        label: item.name,
        color: categoryDetails.color,
        icon: categoryDetails.icon,
      };
    }
  });
  
  const totalExpenses = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Financial Reports" description="Visualize your spending patterns." />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Expense Breakdown
          </CardTitle>
          <CardDescription>
            See how your expenses are distributed across categories. Total: ${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              No expense data available to display charts. Add some expenses first!
            </p>
          ) : chartData.length === 0 ? (
             <p className="text-center text-muted-foreground py-10">
              No expenses with positive amounts to display in the chart.
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  labelLine={false}
                  label={({ percent, name }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={ALL_CATEGORIES.find(c => c.name === entry.name)?.color || 'hsl(var(--muted))'} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Placeholder for more charts */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Income vs. Expenses Over Time</CardTitle>
          <CardDescription>Track your financial health month by month. (Coming Soon)</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Chart placeholder - More reports coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}

