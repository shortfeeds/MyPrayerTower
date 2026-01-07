'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TooltipStep {
    target: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface PrayerTooltipsProps {
    /** List of tooltip steps */
    steps?: TooltipStep[];
    /** Only show for new users */
    newUsersOnly?: boolean;
}

const DEFAULT_STEPS: TooltipStep[] = [
    {
        target: '.prayer-card',
        title: 'Browse Prayers',
        content: 'Click on any prayer card to read and pray along. You can also save favorites.',
        position: 'bottom',
    },
    {
        target: '.pray-button',
        title: 'Record Your Prayer',
        content: 'Tap the heart to mark that you\'ve prayed. This helps track your prayer journey.',
        position: 'top',
    },
    {
        target: '.streak-badge',
        title: 'Build Your Streak',
        content: 'Pray daily to build your streak and unlock achievements!',
        position: 'left',
    },
];

/**
 * Onboarding tooltips for new users
 * Shows helpful tips on how to use prayer features
 */
export function PrayerTooltips({
    steps = DEFAULT_STEPS,
    newUsersOnly = true,
}: PrayerTooltipsProps) {
    const [showTooltips, setShowTooltips] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Check if user has seen tooltips
        const seen = localStorage.getItem('mpt-tooltips-seen');
        if (seen && newUsersOnly) return;

        // Check visit count for new users
        const visitCount = parseInt(localStorage.getItem('mpt-visits') || '0', 10);
        if (visitCount <= 3) {
            // Show after a short delay
            setTimeout(() => setShowTooltips(true), 2000);
        }
    }, [newUsersOnly]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        setShowTooltips(false);
        localStorage.setItem('mpt-tooltips-seen', 'true');
    };

    const handleSkip = () => {
        handleClose();
    };

    if (!isClient || !showTooltips || steps.length === 0) return null;

    const step = steps[currentStep];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={handleClose}
            />

            {/* Tooltip */}
            <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 toast-enter">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sacred-600 to-sacred-700 text-white">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} />
                            <span className="font-semibold">Quick Tip</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/80">
                                {currentStep + 1} of {steps.length}
                            </span>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                            {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {step.content}
                        </p>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleSkip}
                                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Skip all
                            </button>
                            <div className="flex items-center gap-2">
                                {currentStep > 0 && (
                                    <button
                                        onClick={handlePrev}
                                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-1 px-4 py-2 bg-sacred-600 text-white font-semibold rounded-lg hover:bg-sacred-500 transition-colors"
                                >
                                    {currentStep < steps.length - 1 ? (
                                        <>
                                            Next
                                            <ChevronRight size={16} />
                                        </>
                                    ) : (
                                        'Got it!'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-1.5 pb-4">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`
                                    w-2 h-2 rounded-full transition-all
                                    ${i === currentStep
                                        ? 'w-6 bg-sacred-500'
                                        : i < currentStep
                                            ? 'bg-sacred-300'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                    }
                                `}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * Help button that triggers tooltips
 */
export function HelpButton({
    onClick,
    className = '',
}: {
    onClick?: () => void;
    className?: string;
}) {
    const handleClick = () => {
        localStorage.removeItem('mpt-tooltips-seen');
        onClick?.();
        window.location.reload();
    };

    return (
        <button
            onClick={handleClick}
            className={`
                p-2 rounded-full bg-gray-100 dark:bg-gray-800 
                text-gray-500 hover:text-gray-700 dark:hover:text-gray-300
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition-colors
                ${className}
            `}
            title="Show help tips"
        >
            <HelpCircle size={18} />
        </button>
    );
}

/**
 * Inline tooltip for specific elements
 */
export function InlineTooltip({
    content,
    children,
}: {
    content: string;
    children: React.ReactNode;
}) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
            >
                {children}
            </div>

            {isVisible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 toast-enter">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs">
                        {content}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
