'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply theme immediately
    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Update state
    setTheme(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Apply theme
    applyTheme(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed top-20 right-4 z-40 h-9 w-9 shadow-lg"
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-20 right-4 z-40 h-9 w-9 shadow-lg hover:bg-accent transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 transition-transform hover:rotate-12" />
      ) : (
        <Sun className="h-4 w-4 transition-transform hover:rotate-45" />
      )}
    </Button>
  );
}