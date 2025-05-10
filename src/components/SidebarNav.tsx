'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  BellRing,
  Lightbulb as LightbulbIcon, // Renamed to avoid conflict with component
} from 'lucide-react';
import { Logo } from './Logo';
import { useSidebar } from '@/components/ui/sidebar';


const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/alerts', label: 'Alerts', icon: BellRing },
  { href: '/budget-tips', label: 'Budget Tips', icon: LightbulbIcon },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-sidebar-border">
        <Logo collapsed={isCollapsed} />
      </div>
      <SidebarMenu className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
                tooltip={{ children: item.label, side: 'right', hidden: !isCollapsed }}
                className="justify-start"
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
