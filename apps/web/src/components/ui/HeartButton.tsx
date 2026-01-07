'use client';

import { useState, useRef, useCallback } from 'react';
import { Heart } from 'lucide-react';

interface HeartButtonProps {
    onPray?: () => void;
    initialCount?: number;
    size?: 'sm' | 'md' | 'lg';
    showCount?: boolean;
    className?: string;
}

/**
 * Animated heart button with burst particle effect
 * Used for "Pray" actions across the site
 */
export function HeartButton({
    onPray,
    initialCount = 0,
    size = 'md',
    showCount = true,
    className = '',
}: HeartButtonProps) {
    const [count, setCount] = useState(initialCount);
    const [isAnimating, setIsAnimating] = useState(false);
    const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    const handleClick = useCallback(() => {
        // Trigger animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);

        // Create particles
        const newParticles = Array.from({ length: 6 }, (_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 60 - 20,
        }));
        setParticles(prev => [...prev, ...newParticles]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 600);

        // Increment count and call callback
        setCount(prev => prev + 1);
        onPray?.();

        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }, [onPray]);

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            <button
                ref={buttonRef}
                onClick={handleClick}
                className={`
                    ${sizeClasses[size]}
                    relative flex items-center justify-center
                    rounded-full bg-rose-50 dark:bg-rose-900/30
                    hover:bg-rose-100 dark:hover:bg-rose-900/50
                    transition-colors duration-200
                    ripple btn-hover-lift
                `}
                aria-label="Pray for this intention"
            >
                <Heart
                    size={iconSizes[size]}
                    className={`
                        text-rose-500 dark:text-rose-400
                        transition-all duration-200
                        ${isAnimating ? 'animate-heart-burst fill-rose-500 dark:fill-rose-400' : ''}
                    `}
                    fill={isAnimating ? 'currentColor' : 'none'}
                />

                {/* Particle burst */}
                {particles.map(particle => (
                    <span
                        key={particle.id}
                        className="heart-particle text-rose-500"
                        style={{
                            '--x': `${particle.x}px`,
                            '--y': `${particle.y}px`,
                        } as React.CSSProperties}
                    >
                        ❤️
                    </span>
                ))}
            </button>

            {showCount && (
                <span className={`
                    mt-1 text-xs font-medium text-gray-500 dark:text-gray-400
                    ${isAnimating ? 'animate-count-up' : ''}
                `}>
                    {count.toLocaleString()}
                </span>
            )}
        </div>
    );
}

/**
 * Compact inline heart button for cards
 */
export function InlineHeartButton({
    onPray,
    count = 0,
    prayed = false,
}: {
    onPray?: () => void;
    count?: number;
    prayed?: boolean;
}) {
    const [isPrayed, setIsPrayed] = useState(prayed);
    const [localCount, setLocalCount] = useState(count);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        if (!isPrayed) {
            setIsPrayed(true);
            setLocalCount(prev => prev + 1);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 400);
            onPray?.();

            if ('vibrate' in navigator) {
                navigator.vibrate(10);
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPrayed}
            className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-sm font-medium transition-all duration-200
                ${isPrayed
                    ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-500'
                }
            `}
        >
            <Heart
                size={14}
                className={`
                    ${isAnimating ? 'animate-heart-burst' : ''}
                    ${isPrayed ? 'fill-current' : ''}
                `}
            />
            <span>{localCount.toLocaleString()}</span>
        </button>
    );
}
