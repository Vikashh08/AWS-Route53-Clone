'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { applyMode, Mode } from '@cloudscape-design/global-styles';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('cloudscape-theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      applyMode(Mode.Dark);
    } else {
      setIsDarkMode(false);
      applyMode(Mode.Light);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      applyMode(Mode.Dark);
      localStorage.setItem('cloudscape-theme', 'dark');
    } else {
      applyMode(Mode.Light);
      localStorage.setItem('cloudscape-theme', 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div style={{ visibility: isMounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
