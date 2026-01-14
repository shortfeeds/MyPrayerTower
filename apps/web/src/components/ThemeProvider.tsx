'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    actualTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme] = useState<Theme>('light');
    const [actualTheme] = useState<'light'>('light');

    useEffect(() => {
        // Enforce unified mode (light)
        const root = document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
    }, []);

    // No-op for unified mode
    const handleSetTheme = (newTheme: Theme) => {
        console.log('Theme switching is disabled in unified mode');
    };

    return (
        <ThemeContext.Provider value={{ theme: 'light', actualTheme: 'light', setTheme: handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

// Theme Toggle Component
export function ThemeToggle() {
    return null;
}
