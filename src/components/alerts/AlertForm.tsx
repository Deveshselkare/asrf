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
import { Save } from 'lucide-react';
import type { AlertSetting, ExpenseCategory } from '@/types/budget';
import { ALL_CATEGORIES } from '@/config/categories';

interface AlertFormProps {
  onSubmit: (data: Omit<AlertSetting, 'id'>) => void;
  initialData?: Partial<AlertSetting>;
  existingAlertCategories?: ExpenseCategory[];
  onCancel?: () => void;
}

const formSchema = z.object({
  category: z.custom<ExpenseCategory>(val => ALL_CATEGORIES.some(c => c.name === val), 'Invalid category.'),
  limit: z.coerce.number().positive({ message: 'Limit must be a positive number.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function AlertForm({ onSubmit, initialData, existingAlertCategories = [], onCancel }: AlertFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: initialData?.category || undefined,
      limit: initialData?.limit || undefined,
    },
  });

  const availableCategories = ALL_CATEGORIES.filter(
    cat => !existingAlertCategories.includes(cat.name) || cat.name === initialData?.category
  );

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset({ category: undefined, limit: undefined }); 
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialData?.category}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCategories.map((cat) => (
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

        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spending Limit</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 200" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> {initialData ? 'Update Alert' : 'Set Alert'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
