'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    actualTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

import { getCurrentLiturgyTheme } from '@/lib/liturgy';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme] = useState<Theme>('light');
    const [actualTheme] = useState<'light'>('light');

    useEffect(() => {
        // Enforce unified mode (light)
        const root = document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');

        // Apply Liturgical Theme
        const applyLiturgy = async () => {
            try {
                const liturgy = await getCurrentLiturgyTheme();
                root.style.setProperty('--liturgy-primary', liturgy.primary);
                root.style.setProperty('--liturgy-secondary', liturgy.secondary);
                root.style.setProperty('--liturgy-accent', liturgy.accent);
                root.style.setProperty('--liturgy-accent-light', liturgy.accentLight);
                root.style.setProperty('--liturgy-glow', liturgy.glow);
            } catch (error) {
                console.error('Failed to apply liturgical theme:', error);
            }
        };

        applyLiturgy();
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
