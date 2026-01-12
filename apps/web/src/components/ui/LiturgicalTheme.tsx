'use client';

import { useEffect, useState } from 'react';

type LiturgicalSeason = 'advent' | 'christmas' | 'lent' | 'easter' | 'ordinary';

interface LiturgicalThemeProps {
    children: React.ReactNode;
}

/**
 * Calculate the current liturgical season based on date
 * This is a simplified calculation - for accurate dates, use romcal library
 */
function getCurrentLiturgicalSeason(): LiturgicalSeason {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    // Calculate Easter (approximate using Meeus/Jones/Butcher algorithm)
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
    const easterDay = ((h + l - 7 * m + 114) % 31) + 1;
    const easter = new Date(year, easterMonth - 1, easterDay);

    // Ash Wednesday is 46 days before Easter
    const ashWednesday = new Date(easter);
    ashWednesday.setDate(easter.getDate() - 46);

    // Pentecost is 49 days after Easter
    const pentecost = new Date(easter);
    pentecost.setDate(easter.getDate() + 49);

    // Create comparable date
    const currentDate = new Date(year, month - 1, day);

    // Advent: 4th Sunday before Christmas to Dec 24
    // Simplified: Nov 27 to Dec 24
    const adventStart = new Date(year, 10, 27); // Nov 27
    const christmasEve = new Date(year, 11, 24); // Dec 24
    const christmasDay = new Date(year, 11, 25); // Dec 25
    const epiphany = new Date(year + 1, 0, 6); // Jan 6 next year
    const baptismOfLord = new Date(year, 0, 13); // ~Jan 13

    // Check seasons
    if (currentDate >= adventStart && currentDate <= christmasEve) {
        return 'advent';
    }
    if ((currentDate >= christmasDay) || (month === 1 && day <= 13)) {
        return 'christmas';
    }
    if (currentDate >= ashWednesday && currentDate < easter) {
        return 'lent';
    }
    if (currentDate >= easter && currentDate < pentecost) {
        return 'easter';
    }

    return 'ordinary';
}

/**
 * Theme colors for each liturgical season
 */
const SEASON_THEMES = {
    advent: {
        primary: 'rgb(124, 58, 237)', // Purple/Violet
        secondary: 'rgb(219, 39, 119)', // Rose for Gaudete
        accent: 'rgb(168, 85, 247)',
    },
    christmas: {
        primary: 'rgb(239, 68, 68)', // Red
        secondary: 'rgb(234, 179, 8)', // Gold
        accent: 'rgb(22, 163, 74)',
    },
    lent: {
        primary: 'rgb(124, 58, 237)', // Purple
        secondary: 'rgb(219, 39, 119)', // Rose for Laetare
        accent: 'rgb(100, 116, 139)',
    },
    easter: {
        primary: 'rgb(234, 179, 8)', // Gold
        secondary: 'rgb(255, 255, 255)', // White
        accent: 'rgb(250, 204, 21)',
    },
    ordinary: {
        primary: 'rgb(22, 163, 74)', // Green
        secondary: 'rgb(59, 130, 246)', // Blue (Marian feasts)
        accent: 'rgb(16, 185, 129)',
    },
};

/**
 * Provider that applies liturgical season theme to the app
 */
export function LiturgicalTheme({ children }: LiturgicalThemeProps) {
    const [season, setSeason] = useState<LiturgicalSeason>('ordinary');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setSeason(getCurrentLiturgicalSeason());
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const root = document.documentElement;
        const theme = SEASON_THEMES[season];

        // Apply theme colors as CSS custom properties
        root.style.setProperty('--liturgical-primary', theme.primary);
        root.style.setProperty('--liturgical-secondary', theme.secondary);
        root.style.setProperty('--liturgical-accent', theme.accent);

        // Add class for CSS-based styling
        root.classList.remove('liturgical-advent', 'liturgical-christmas', 'liturgical-lent', 'liturgical-easter', 'liturgical-ordinary');
        root.classList.add(`liturgical-${season}`);
    }, [season, isClient]);

    return <>{children}</>;
}

/**
 * Hook to get current liturgical season
 */
export function useLiturgicalSeason(): LiturgicalSeason {
    const [season, setSeason] = useState<LiturgicalSeason>('ordinary');

    useEffect(() => {
        setSeason(getCurrentLiturgicalSeason());
    }, []);

    return season;
}

/**
 * Season badge component
 */
export function SeasonBadge({ className = '' }: { className?: string }) {
    const season = useLiturgicalSeason();

    const badges = {
        advent: { label: 'Advent', emoji: '🕯️', bg: 'bg-purple-100 text-purple-700' },
        christmas: { label: '', emoji: '⭐', bg: 'bg-red-100 text-red-700' },
        lent: { label: 'Lent', emoji: '✝️', bg: 'bg-purple-100 text-purple-700' },
        easter: { label: 'Easter', emoji: '🐣', bg: 'bg-amber-100 text-amber-700' },
        ordinary: { label: 'Ordinary Time', emoji: '🌿', bg: 'bg-green-100 text-green-700' },
    };

    const badge = badges[season];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${className}`}>
            <span>{badge.emoji}</span>
            {badge.label}
        </span>
    );
}
