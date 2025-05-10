'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import useLocalStorage from '@/lib/hooks/useLocalStorage';
import type { Income, Expense } from '@/types/budget';
import { PlusCircle, Edit3 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

type TransactionToEdit = (Income | Expense) & { type: 'income' | 'expense' };

export default function TransactionsPage() {
  const [income, setIncome] = useLocalStorage<Income[]>('income', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [alerts, setAlerts] = useLocalStorage<AlertSetting[]>('alerts', []);
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');
  
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>(
    initialAction === 'add-income' ? 'income' : 'expense'
  );
  const [showForm, setShowForm] = useState<'income' | 'expense' | null>(
    initialAction === 'add-income' ? 'income' : (initialAction === 'add-expense' ? 'expense' : null)
  );
  const [editingTransaction, setEditingTransaction] = useState<TransactionToEdit | null>(null);

  useEffect(() => {
    if (initialAction === 'add-income') {
      setActiveTab('income');
      setShowForm('income');
    } else if (initialAction === 'add-expense') {
      setActiveTab('expense');
      setShowForm('expense');
    }
  }, [initialAction]);

  const handleAddIncome = (data: Omit<Income, 'id' | 'date'> & {date: string}) => {
    const newIncome: Income = { ...data, id: crypto.randomUUID() };
    setIncome((prev) => [newIncome, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setShowForm(null);
    toast({ title: 'Income Added', description: `${data.source}: $${data.amount}` });
  };

  const handleAddExpense = (data: Omit<Expense, 'id' | 'date'> & {date: string}) => {
    const newExpense: Expense = { ...data, id: crypto.randomUUID() };
    setExpenses((prev) => [newExpense, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    // Check for alerts
    const alertSetting = alerts.find(a => a.category === newExpense.category);
    if (alertSetting) {
      const categoryTotal = expenses.filter(e => e.category === newExpense.category).reduce((sum, e) => sum + e.amount, 0) + newExpense.amount;
      if (categoryTotal > alertSetting.limit) {
        toast({
          title: 'Alert: Overspending!',
          description: `You've spent $${categoryTotal.toFixed(2)} on ${newExpense.category}, exceeding your limit of $${alertSetting.limit.toFixed(2)}.`,
          variant: 'destructive',
        });
      }
    }
    setShowForm(null);
    toast({ title: 'Expense Added', description: `${data.category}: $${data.amount}` });
  };

  const handleEditTransaction = (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!editingTransaction) return;
    const updatedTransaction = { ...editingTransaction, ...data, id: editingTransaction.id };
    if (editingTransaction.type === 'income') {
      setIncome(prev => prev.map(inc => inc.id === updatedTransaction.id ? updatedTransaction as Income : inc).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
      setExpenses(prev => prev.map(exp => exp.id === updatedTransaction.id ? updatedTransaction as Expense : exp).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    setEditingTransaction(null);
    toast({ title: 'Transaction Updated', description: `Successfully updated transaction.` });
  };

  const openEditModal = (transaction: Income | Expense, type: 'income' | 'expense') => {
    setEditingTransaction({ ...transaction, type });
  };

  const handleDeleteIncome = (id: string) => {
    setIncome((prev) => prev.filter((item) => item.id !== id));
    toast({ title: 'Income Deleted' });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    toast({ title: 'Expense Deleted' });
  };

  const transactionsToShow = activeTab === 'income' ? income : expenses;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage Transactions" 
        description="Add, view, and manage your income and expenses."
        actions={
          <div className="flex gap-2">
            <Button onClick={() => { setShowForm('income'); setActiveTab('income'); }} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Income
            </Button>
            <Button onClick={() => { setShowForm('expense'); setActiveTab('expense'); }} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>
        }
      />

      <Dialog open={showForm !== null} onOpenChange={(isOpen) => !isOpen && setShowForm(null)}>
        <DialogContent className="sm:max-w-[425px] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New {showForm === 'income' ? 'Income' : 'Expense'}</DialogTitle>
            <DialogDescription>
              Enter the details for your new {showForm}.
            </DialogDescription>
          </DialogHeader>
          {showForm && (
            <TransactionForm
              key={showForm} // Ensure form remounts/resets when type changes
              type={showForm}
              onSubmit={showForm === 'income' ? handleAddIncome : handleAddExpense}
              onCancel={() => setShowForm(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={editingTransaction !== null} onOpenChange={(isOpen) => !isOpen && setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-[425px] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {editingTransaction?.type === 'income' ? 'Income' : 'Expense'}</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              key={editingTransaction.id}
              type={editingTransaction.type}
              initialData={editingTransaction}
              onSubmit={handleEditTransaction}
              onCancel={() => setEditingTransaction(null)}
            />
          )}
        </DialogContent>
      </Dialog>


      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'income' | 'expense')}>
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income List</CardTitle>
            </CardHeader>
            <CardContent>
              {income.length === 0 ? (
                <p className="text-muted-foreground">No income recorded yet.</p>
              ) : (
                income.map((item) => (
                  <TransactionItem
                    key={item.id}
                    transaction={item}
                    type="income"
                    onEdit={(trans) => openEditModal(trans, 'income')}
                    onDelete={handleDeleteIncome}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expense">
          <Card>
            <CardHeader>
              <CardTitle>Expense List</CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <p className="text-muted-foreground">No expenses recorded yet.</p>
              ) : (
                expenses.map((item) => (
                  <TransactionItem
                    key={item.id}
                    transaction={item}
                    type="expense"
                    onEdit={(trans) => openEditModal(trans, 'expense')}
                    onDelete={handleDeleteExpense}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
