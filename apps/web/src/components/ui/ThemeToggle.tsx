'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface ThemeToggleProps {
    /** Style variant */
    variant?: 'default' | 'compact' | 'dropdown';
    /** Additional className */
    className?: string;
}

/**
 * Theme toggle component with sun/moon icons
 * Supports light, dark, and system themes
 */
export function ThemeToggle({ variant = 'default', className = '' }: ThemeToggleProps) {
    const { theme, actualTheme, setTheme } = useTheme();

    if (variant === 'compact') {
        return (
            <button
                onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
                className={`
                    p-2 rounded-full
                    bg-gray-100 dark:bg-gray-800
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    transition-all duration-300
                    ${className}
                `}
                aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
                <div className="relative w-5 h-5">
                    <Sun
                        size={20}
                        className={`
                            absolute inset-0 text-amber-500
                            transition-all duration-300
                            ${actualTheme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
                        `}
                    />
                    <Moon
                        size={20}
                        className={`
                            absolute inset-0 text-blue-400
                            transition-all duration-300
                            ${actualTheme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
                        `}
                    />
                </div>
            </button>
        );
    }

    // Default segmented control style
    return (
        <div className={`
            inline-flex items-center gap-1 p-1 
            bg-gray-100 dark:bg-gray-800 
            rounded-xl border border-gray-200 dark:border-gray-700
            ${className}
        `}>
            <button
                onClick={() => setTheme('light')}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    text-sm font-medium transition-all duration-200
                    ${theme === 'light'
                        ? 'bg-white dark:bg-gray-700 text-amber-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                `}
                title="Light mode"
            >
                <Sun size={16} />
                <span className="hidden sm:inline">Light</span>
            </button>

            <button
                onClick={() => setTheme('system')}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    text-sm font-medium transition-all duration-200
                    ${theme === 'system'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                `}
                title="System preference"
            >
                <Monitor size={16} />
                <span className="hidden sm:inline">System</span>
            </button>

            <button
                onClick={() => setTheme('dark')}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    text-sm font-medium transition-all duration-200
                    ${theme === 'dark'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                `}
                title="Dark mode"
            >
                <Moon size={16} />
                <span className="hidden sm:inline">Dark</span>
            </button>
        </div>
    );
}
