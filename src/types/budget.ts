import type { LucideIcon } from 'lucide-react';

export type ExpenseCategory = 
  | 'Food' 
  | 'Transport' 
  | 'Housing' 
  | 'Utilities' 
  | 'Entertainment' 
  | 'Healthcare' 
  | 'Shopping' 
  | 'Personal Care' 
  | 'Education' 
  | 'Other';

export interface CategoryConfig {
  name: ExpenseCategory;
  icon: LucideIcon;
  color: string; // for charts, e.g. 'hsl(var(--chart-1))'
}

export interface Income {
  id: string;
  amount: number;
  date: string; // Store as ISO string
  source: string;
  description?: string;
}

export interface Expense {
  id: string;
  amount: number;
  date: string; // Store as ISO string
  category: ExpenseCategory;
  description?: string;
}

export interface AlertSetting {
  id: string;
  category: ExpenseCategory;
  limit: number;
  // currentSpending will be calculated on the fly
}
