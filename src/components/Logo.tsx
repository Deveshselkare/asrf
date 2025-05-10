import { Landmark } from 'lucide-react';
import Link from 'next/link';

export function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-2 py-4 text-sidebar-foreground">
      <Landmark className="h-7 w-7 text-sidebar-primary" />
      {!collapsed && <h1 className="text-xl font-semibold">BudgetWise</h1>}
    </Link>
  );
}
