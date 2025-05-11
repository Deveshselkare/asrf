'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
} from '@/components/ui/sidebar';
import { SidebarNav } from './SidebarNav';
import { Header } from './Header';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes' // Assuming next-themes is or will be installed

// Helper to get page title from pathname
const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/transactions')) return 'Transactions';
  if (pathname.startsWith('/reports')) return 'Reports';
  if (pathname.startsWith('/alerts')) return 'Alerts';
  if (pathname.startsWith('/budget-tips')) return 'AI Budget Tips';
  return 'PennyPocket';
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider defaultOpen={true}>
        <Sidebar variant="sidebar" side="left" collapsible="icon" className="bg-sidebar text-sidebar-foreground">
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col min-h-screen">
          <Header title={pageTitle} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
