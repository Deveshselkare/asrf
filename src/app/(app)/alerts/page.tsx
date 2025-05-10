'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertForm } from '@/components/alerts/AlertForm';
import { AlertItem } from '@/components/alerts/AlertItem';
import useLocalStorage from '@/lib/hooks/useLocalStorage';
import type { AlertSetting, Expense } from '@/types/budget';
import { PlusCircle, Edit3 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function AlertsPage() {
  const [alerts, setAlerts] = useLocalStorage<AlertSetting[]>('alerts', []);
  const [expenses] = useLocalStorage<Expense[]>('expenses', []); // To calculate current spending
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertSetting | null>(null);

  const handleSetAlert = (data: Omit<AlertSetting, 'id'>) => {
    if (editingAlert) {
      // Update existing alert
      const updatedAlerts = alerts.map(a => a.id === editingAlert.id ? { ...a, ...data } : a);
      setAlerts(updatedAlerts);
      toast({ title: 'Alert Updated', description: `Limit for ${data.category} is now $${data.limit}.` });
    } else {
      // Add new alert
      if (alerts.some(alert => alert.category === data.category)) {
        toast({ title: 'Alert Exists', description: `An alert for ${data.category} already exists. Edit it instead.`, variant: 'destructive' });
        return;
      }
      const newAlert: AlertSetting = { ...data, id: crypto.randomUUID() };
      setAlerts((prev) => [...prev, newAlert]);
      toast({ title: 'Alert Set', description: `Spending limit for ${data.category} set to $${data.limit}.` });
    }
    setIsFormOpen(false);
    setEditingAlert(null);
  };

  const handleEditAlert = (alert: AlertSetting) => {
    setEditingAlert(alert);
    setIsFormOpen(true);
  };

  const handleDeleteAlert = (id: string) => {
    const alertToDelete = alerts.find(a => a.id === id);
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    if (alertToDelete) {
      toast({ title: 'Alert Deleted', description: `Alert for ${alertToDelete.category} removed.` });
    }
  };

  const existingAlertCategories = alerts.map(a => a.category);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Spending Alerts" 
        description="Set limits for your spending categories and get notified."
        actions={
           <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if(!open) setEditingAlert(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingAlert(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> {editingAlert ? 'Edit Alert' : 'Set New Alert'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingAlert ? 'Edit Spending Alert' : 'Set New Spending Alert'}</DialogTitle>
              </DialogHeader>
              <AlertForm
                onSubmit={handleSetAlert}
                initialData={editingAlert || undefined}
                existingAlertCategories={existingAlertCategories}
                onCancel={() => { setIsFormOpen(false); setEditingAlert(null); }}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Your Alerts</CardTitle>
          <CardDescription>
            {alerts.length > 0 ? 'Here are your current spending limits.' : 'You have no alerts set up yet.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-muted-foreground">Click "Set New Alert" to create your first spending limit.</p>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  expenses={expenses}
                  onEdit={handleEditAlert}
                  onDelete={handleDeleteAlert}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
