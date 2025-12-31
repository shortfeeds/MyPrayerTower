'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Eye, Type, Sun, Moon, ZoomIn, ZoomOut, RotateCcw, Volume2, VolumeX, Palette } from 'lucide-react';

interface AccessibilitySettings {
    fontSize: 'normal' | 'large' | 'xlarge';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReaderMode: boolean;
    dyslexiaFont: boolean;
}

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
    resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
    fontSize: 'normal',
    highContrast: false,
    reducedMotion: false,
    screenReaderMode: false,
    dyslexiaFont: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

    useEffect(() => {
        // Load saved settings
        const saved = localStorage.getItem('mpt-accessibility');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse accessibility settings');
            }
        }
    }, []);

    useEffect(() => {
        // Apply settings to document
        const root = document.documentElement;

        // Font size
        root.classList.remove('text-normal', 'text-large', 'text-xlarge');
        root.classList.add(`text-${settings.fontSize}`);

        // High contrast
        root.classList.toggle('high-contrast', settings.highContrast);

        // Reduced motion
        root.classList.toggle('reduce-motion', settings.reducedMotion);

        // Dyslexia font
        root.classList.toggle('dyslexia-font', settings.dyslexiaFont);

        // Save settings
        localStorage.setItem('mpt-accessibility', JSON.stringify(settings));
    }, [settings]);

    const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    return (
        <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
}

// Accessibility Controls Panel
export function AccessibilityControls() {
    const { settings, updateSetting, resetSettings } = useAccessibility();

    const fontSizes = [
        { value: 'normal', label: 'A', title: 'Normal' },
        { value: 'large', label: 'A', title: 'Large', className: 'text-lg' },
        { value: 'xlarge', label: 'A', title: 'Extra Large', className: 'text-xl' },
    ] as const;

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Accessibility
                </h3>
                <button
                    onClick={resetSettings}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </button>
            </div>

            <div className="space-y-6">
                {/* Font Size */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Type className="w-4 h-4 inline mr-2" />
                        Text Size
                    </label>
                    <div className="flex gap-2">
                        {fontSizes.map(({ value, label, title, className }) => (
                            <button
                                key={value}
                                onClick={() => updateSetting('fontSize', value)}
                                className={`flex-1 py-2 rounded-lg font-bold transition-colors ${className || ''} ${settings.fontSize === value
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                title={title}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* High Contrast */}
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Palette className="w-4 h-4" />
                        High Contrast
                    </span>
                    <button
                        onClick={() => updateSetting('highContrast', !settings.highContrast)}
                        className={`w-12 h-6 rounded-full transition-colors ${settings.highContrast ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                    </button>
                </label>

                {/* Reduced Motion */}
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <ZoomOut className="w-4 h-4" />
                        Reduce Motion
                    </span>
                    <button
                        onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                        className={`w-12 h-6 rounded-full transition-colors ${settings.reducedMotion ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                    </button>
                </label>

                {/* Dyslexia-Friendly Font */}
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Type className="w-4 h-4" />
                        Dyslexia-Friendly Font
                    </span>
                    <button
                        onClick={() => updateSetting('dyslexiaFont', !settings.dyslexiaFont)}
                        className={`w-12 h-6 rounded-full transition-colors ${settings.dyslexiaFont ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.dyslexiaFont ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                    </button>
                </label>

                {/* Screen Reader Mode */}
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Volume2 className="w-4 h-4" />
                        Screen Reader Enhanced
                    </span>
                    <button
                        onClick={() => updateSetting('screenReaderMode', !settings.screenReaderMode)}
                        className={`w-12 h-6 rounded-full transition-colors ${settings.screenReaderMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.screenReaderMode ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                    </button>
                </label>
            </div>
        </div>
    );
}

// Skip to content link (for keyboard navigation)
export function SkipToContent() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none"
        >
            Skip to main content
        </a>
    );
}

// Focus trap wrapper for modals
export function useFocusTrap(ref: React.RefObject<HTMLElement>) {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        element.addEventListener('keydown', handleTab);
        firstElement?.focus();

        return () => element.removeEventListener('keydown', handleTab);
    }, [ref]);
}
