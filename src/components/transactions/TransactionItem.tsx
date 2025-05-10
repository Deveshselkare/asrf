'use client';
import type { Income, Expense, ExpenseCategory } from '@/types/budget';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit3, ArrowUpCircle, ArrowDownCircle, type LucideIcon } from 'lucide-react';
import { getCategoryIcon, getCategoryColor } from '@/config/categories';
import { format, parseISO } from 'date-fns';

interface TransactionItemProps {
  transaction: Income | Expense;
  type: 'income' | 'expense';
  onEdit: (transaction: Income | Expense) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, type, onEdit, onDelete }: TransactionItemProps) {
  const isExpense = type === 'expense';
  const category = isExpense ? (transaction as Expense).category : undefined;
  const Icon = category ? getCategoryIcon(category) : (isExpense ? ArrowDownCircle : ArrowUpCircle);
  const iconColor = category ? getCategoryColor(category) : (isExpense ? 'text-destructive' : 'text-green-500');
  const title = isExpense ? (transaction as Expense).category : (transaction as Income).source;

  return (
    <Card className="mb-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-xs text-muted-foreground">
              {format(parseISO(transaction.date), 'MMM dd, yyyy')}
              {transaction.description && ` - ${transaction.description.substring(0,30)}${transaction.description.length > 30 ? '...' : ''}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${isExpense ? 'text-destructive' : 'text-green-600'}`}>
            {isExpense ? '-' : '+'}${transaction.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
          </span>
          <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)} aria-label="Edit transaction">
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(transaction.id)} aria-label="Delete transaction">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
