'use client';
import {
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes'; 
import { useEffect, useState } from 'react';
import { Logo } from './Logo';

export function Header({ title }: { title: string }) {
  const { isMobile, toggleSidebar } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme() ?? {}; 

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      {isMobile && (
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      )}
      {!isMobile && <SidebarTrigger className="hidden md:flex" />}
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
       {mounted && setTheme && ( 
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      )}
    </header>
  );
}
