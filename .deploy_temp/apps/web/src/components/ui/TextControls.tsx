'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Minus, Plus, Type } from 'lucide-react';

// Text size levels
const TEXT_SIZES = [
    { label: 'S', size: 'text-sm', lineHeight: 'leading-relaxed' },
    { label: 'M', size: 'text-base', lineHeight: 'leading-relaxed' },
    { label: 'L', size: 'text-lg', lineHeight: 'leading-loose' },
    { label: 'XL', size: 'text-xl', lineHeight: 'leading-loose' },
    { label: '2XL', size: 'text-2xl', lineHeight: 'leading-loose' },
];

const STORAGE_KEY = 'mpt-text-size-preference';

interface TextPreferencesContextType {
    sizeIndex: number;
    setSizeIndex: (index: number) => void;
    textClass: string;
    lineHeightClass: string;
}

const TextPreferencesContext = createContext<TextPreferencesContextType | null>(null);

export function useTextPreferences() {
    const context = useContext(TextPreferencesContext);
    if (!context) {
        return {
            sizeIndex: 1,
            setSizeIndex: () => { },
            textClass: 'text-base',
            lineHeightClass: 'leading-relaxed',
        };
    }
    return context;
}

interface TextPreferencesProviderProps {
    children: ReactNode;
}

export function TextPreferencesProvider({ children }: TextPreferencesProviderProps) {
    const [sizeIndex, setSizeIndex] = useState(1); // Default to Medium

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            const parsed = parseInt(saved, 10);
            if (!isNaN(parsed) && parsed >= 0 && parsed < TEXT_SIZES.length) {
                setSizeIndex(parsed);
            }
        }
    }, []);

    const handleSetSizeIndex = (index: number) => {
        const clamped = Math.max(0, Math.min(TEXT_SIZES.length - 1, index));
        setSizeIndex(clamped);
        localStorage.setItem(STORAGE_KEY, String(clamped));
    };

    return (
        <TextPreferencesContext.Provider
            value={{
                sizeIndex,
                setSizeIndex: handleSetSizeIndex,
                textClass: TEXT_SIZES[sizeIndex].size,
                lineHeightClass: TEXT_SIZES[sizeIndex].lineHeight,
            }}
        >
            {children}
        </TextPreferencesContext.Provider>
    );
}

interface TextControlsProps {
    className?: string;
}

/**
 * Floating text size control bar
 */
export function TextControls({ className = '' }: TextControlsProps) {
    const { sizeIndex, setSizeIndex } = useTextPreferences();

    return (
        <div className={`flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 ${className}`}>
            <Type className="w-4 h-4 text-gray-500" />
            <button
                onClick={() => setSizeIndex(sizeIndex - 1)}
                disabled={sizeIndex === 0}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease text size"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 w-8 text-center">
                {TEXT_SIZES[sizeIndex].label}
            </span>
            <button
                onClick={() => setSizeIndex(sizeIndex + 1)}
                disabled={sizeIndex === TEXT_SIZES.length - 1}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase text size"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
}

/**
 * Wrapper component that applies text preferences to children
 */
export function ReadableContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    const { textClass, lineHeightClass } = useTextPreferences();

    return (
        <div className={`${textClass} ${lineHeightClass} ${className}`}>
            {children}
        </div>
    );
}
