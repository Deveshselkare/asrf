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
  color: string; 
}

export interface Income {
  id: string;
  amount: number;
  date: string; 
  source: string;
  description?: string;
}

export interface Expense {
  id: string;
  amount: number;
  date: string; 
  category: ExpenseCategory;
  description?: string;
}

export interface AlertSetting {
  id: string;
  category: ExpenseCategory;
  limit: number;
  
}
