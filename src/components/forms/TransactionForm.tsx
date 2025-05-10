'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { ExpenseCategory, Income, Expense } from '@/types/budget';
import { ALL_CATEGORIES } from '@/config/categories';
import { Textarea } from '@/components/ui/textarea';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onSubmit: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  initialData?: Partial<Income & Expense>;
  onCancel?: () => void;
}

const getFormSchema = (type: 'income' | 'expense') => z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  date: z.date({ required_error: 'A date is required.' }),
  description: z.string().optional(),
  source: type === 'income' ? z.string().min(1, 'Source is required.') : z.string().optional(),
  category: type === 'expense' ? z.custom<ExpenseCategory>(val => ALL_CATEGORIES.some(c => c.name === val), 'Invalid category.') : z.custom<ExpenseCategory>().optional(),
});


export function TransactionForm({ type, onSubmit, initialData, onCancel }: TransactionFormProps) {
  const formSchema = getFormSchema(type);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialData?.amount || undefined,
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      description: initialData?.description || '',
      source: type === 'income' ? (initialData as Income)?.source || '' : undefined,
      category: type === 'expense' ? (initialData as Expense)?.category || undefined : undefined,
    },
  });

  const handleSubmit = (values: FormValues) => {
    const dataToSubmit = {
      ...values,
      date: format(values.date, 'yyyy-MM-dd'), // Store date as string
    };
    onSubmit(dataToSubmit);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'income' && (
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Salary, Freelance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === 'expense' && (
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALL_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Groceries for the week" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> Save {type === 'income' ? 'Income' : 'Expense'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
