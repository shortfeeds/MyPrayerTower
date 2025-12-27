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
    const [theme, setTheme] = useState<Theme>('system');
    const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Load saved theme
        const saved = localStorage.getItem('mpt-theme') as Theme | null;
        if (saved) setTheme(saved);
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        const updateTheme = () => {
            let resolved: 'light' | 'dark';

            if (theme === 'system') {
                resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } else {
                resolved = theme;
            }

            setActualTheme(resolved);
            root.classList.remove('light', 'dark');
            root.classList.add(resolved);
        };

        updateTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateTheme);

        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, [theme]);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('mpt-theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, actualTheme, setTheme: handleSetTheme }}>
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
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded ${theme === 'light' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                title="Light mode"
            >
                ☀️
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`p-2 rounded ${theme === 'system' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                title="System preference"
            >
                💻
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded ${theme === 'dark' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                title="Dark mode"
            >
                🌙
            </button>
        </div>
    );
}
