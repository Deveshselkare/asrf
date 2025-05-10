'use client';
import type { AlertSetting, Expense, ExpenseCategory } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, Edit3, AlertTriangle } from 'lucide-react';
import { getCategoryIcon } from '@/config/categories';

interface AlertItemProps {
  alert: AlertSetting;
  expenses: Expense[];
  onEdit: (alert: AlertSetting) => void;
  onDelete: (id: string) => void;
}

export function AlertItem({ alert, expenses, onEdit, onDelete }: AlertItemProps) {
  const CategoryIcon = getCategoryIcon(alert.category);
  const currentSpending = expenses
    .filter(exp => exp.category === alert.category)
    .reduce((sum, exp) => sum + exp.amount, 0);
  
  const progressPercentage = Math.min((currentSpending / alert.limit) * 100, 100);
  const isOverLimit = currentSpending > alert.limit;

  return (
    <Card className={`mb-3 shadow-sm hover:shadow-md transition-shadow duration-200 ${isOverLimit ? 'border-destructive' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CategoryIcon className="h-5 w-5 text-primary" />
            {alert.category}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(alert)} aria-label="Edit alert">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(alert.id)} aria-label="Delete alert">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Limit: ${alert.limit.toLocaleString(undefined, {minimumFractionDigits: 2})}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center text-sm mb-1">
          <span>Spent: ${currentSpending.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          {isOverLimit && <AlertTriangle className="h-4 w-4 text-destructive" />}
        </div>
        <Progress value={progressPercentage} className={isOverLimit ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'} />
        {isOverLimit && (
          <p className="text-xs text-destructive mt-1">
            You've exceeded your limit by ${(currentSpending - alert.limit).toLocaleString(undefined, {minimumFractionDigits: 2})}!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
