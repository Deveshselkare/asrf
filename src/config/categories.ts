import type { CategoryConfig, ExpenseCategory } from '@/types/budget';
import { Utensils, CarFront, Home, Lightbulb, Popcorn, Stethoscope, ShoppingBag, Sparkles, BookOpen, MoreHorizontal, type LucideIcon } from 'lucide-react';

export const CATEGORIES_CONFIG: Record<ExpenseCategory, { icon: LucideIcon; color: string }> = {
  'Food': { icon: Utensils, color: 'hsl(var(--chart-1))' },
  'Transport': { icon: CarFront, color: 'hsl(var(--chart-2))' },
  'Housing': { icon: Home, color: 'hsl(var(--chart-3))' },
  'Utilities': { icon: Lightbulb, color: 'hsl(var(--chart-4))' },
  'Entertainment': { icon: Popcorn, color: 'hsl(var(--chart-5))' },
  'Healthcare': { icon: Stethoscope, color: 'hsl(var(--chart-1))' }, 
  'Shopping': { icon: ShoppingBag, color: 'hsl(var(--chart-2))' },
  'Personal Care': { icon: Sparkles, color: 'hsl(var(--chart-3))' },
  'Education': { icon: BookOpen, color: 'hsl(var(--chart-4))' },
  'Other': { icon: MoreHorizontal, color: 'hsl(var(--chart-5))' },
};

export const ALL_CATEGORIES: CategoryConfig[] = (Object.keys(CATEGORIES_CONFIG) as ExpenseCategory[]).map(key => ({
  name: key,
  icon: CATEGORIES_CONFIG[key].icon,
  color: CATEGORIES_CONFIG[key].color,
}));

export const getCategoryIcon = (categoryName: ExpenseCategory): LucideIcon => {
  return CATEGORIES_CONFIG[categoryName]?.icon || MoreHorizontal;
};

export const getCategoryColor = (categoryName: ExpenseCategory): string => {
  return CATEGORIES_CONFIG[categoryName]?.color || 'hsl(var(--muted))';
}
