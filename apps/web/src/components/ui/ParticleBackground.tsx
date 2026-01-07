'use client';

import { useEffect, useState, useMemo } from 'react';

interface Particle {
    id: number;
    left: number;
    delay: number;
    duration: number;
    emoji: string;
}

interface ParticleBackgroundProps {
    /** Enable/disable the particles */
    enabled?: boolean;
    /** Number of particles to show */
    count?: number;
    /** Particle type: candles, crosses, or hearts */
    type?: 'candles' | 'crosses' | 'hearts' | 'mixed';
    /** Opacity of particles (0-1) */
    opacity?: number;
}

const EMOJIS = {
    candles: ['🕯️'],
    crosses: ['✝️', '☦️'],
    hearts: ['❤️', '💛', '🧡'],
    mixed: ['🕯️', '✝️', '❤️', '⭐'],
};

/**
 * Floating particle background for prayer pages
 * Performance-optimized with CSS animations only
 */
export function ParticleBackground({
    enabled = true,
    count = 8,
    type = 'candles',
    opacity = 0.6,
}: ParticleBackgroundProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const particles = useMemo<Particle[]>(() => {
        if (!isClient) return [];

        const emojis = EMOJIS[type];
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 12 + Math.random() * 8,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
        }));
    }, [isClient, count, type]);

    if (!enabled || !isClient) return null;

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden z-0"
            style={{ opacity }}
            aria-hidden="true"
        >
            {particles.map(particle => (
                <span
                    key={particle.id}
                    className="particle particle-candle"
                    style={{
                        left: `${particle.left}%`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                    }}
                >
                    {particle.emoji}
                </span>
            ))}

            {/* Ambient glow spots */}
            <div
                className="absolute top-1/4 left-1/4 w-64 h-64 particle-glow"
                style={{ animationDelay: '0s' }}
            />
            <div
                className="absolute top-2/3 right-1/4 w-48 h-48 particle-glow"
                style={{ animationDelay: '1.5s' }}
            />
        </div>
    );
}

/**
 * Lighter particle overlay for cards/sections
 */
export function GlowOverlay({ className = '' }: { className?: string }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-sacred-400/20 rounded-full blur-3xl" />
        </div>
    );
}
