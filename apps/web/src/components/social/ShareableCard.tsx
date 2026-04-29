'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Share2, Copy, Check } from 'lucide-react';

interface ShareableCardProps {
    /** Type of content */
    type: 'prayer' | 'saint' | 'verse' | 'intention';
    /** Main title */
    title: string;
    /** Content/quote */
    content: string;
    /** Optional subtitle */
    subtitle?: string;
    /** Background style */
    theme?: 'light' | 'dark' | 'gradient' | 'sacred';
}

/**
 * Generates beautiful shareable cards for social media
 * Cards are rendered as HTML and can be captured/saved
 */
export function ShareableCard({
    type,
    title,
    content,
    subtitle,
    theme = 'gradient',
}: ShareableCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    const themeStyles = {
        light: 'bg-white text-gray-900',
        dark: 'bg-gray-900 text-white',
        gradient: 'bg-gradient-to-br from-sacred-600 via-sacred-700 to-purple-800 text-white',
        sacred: 'bg-gradient-to-br from-amber-100 via-gold-50 to-amber-100 text-gray-900',
    };

    const getIcon = () => {
        switch (type) {
            case 'prayer': return '🙏';
            case 'saint': return '⭐';
            case 'verse': return '📖';
            case 'intention': return '🕯️';
            default: return '✨';
        }
    };

    const handleCopyText = async () => {
        const text = `🙏 ${title}\n\n${content}${subtitle ? `\n\n— ${subtitle}` : ''}\n\nShared from MyPrayerTower.com\n📲 Download the app: https://bit.ly/myprayertowerapp`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleShare = async () => {
        if ('share' in navigator) {
            try {
                await navigator.share({
                    title,
                    text: `${content}\n\n📲 Download My Prayer Tower: https://bit.ly/myprayertowerapp`,
                    url: window.location.href,
                });
            } catch (error) {
                // User cancelled
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Preview Card */}
            <div
                ref={cardRef}
                className={`
                    relative overflow-hidden rounded-2xl p-8
                    shadow-xl
                    ${themeStyles[theme]}
                `}
                style={{ aspectRatio: '1/1', maxWidth: '400px' }}
            >
                {/* Decorative elements */}
                {theme === 'gradient' && (
                    <>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-400/20 rounded-full blur-2xl" />
                    </>
                )}

                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{getIcon()}</span>
                        <span className={`
                            text-sm font-semibold uppercase tracking-wide
                            ${theme === 'gradient' ? 'text-white/80' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                            {type}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-2xl font-bold mb-4 leading-tight">
                        {title}
                    </h2>

                    {/* Content */}
                    <p className={`
                        flex-1 text-lg leading-relaxed
                        ${theme === 'gradient' ? 'text-white/90' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                        "{content}"
                    </p>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className={`
                            mt-4 text-sm font-medium
                            ${theme === 'gradient' ? 'text-white/70' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}
                        `}>
                            — {subtitle}
                        </p>
                    )}

                    {/* Branding */}
                    <div className={`
                        mt-6 pt-4 border-t flex items-center justify-between
                        ${theme === 'gradient' ? 'border-white/20' : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                    `}>
                        <span className={`
                            text-sm font-semibold
                            ${theme === 'gradient' ? 'text-white/80' : 'text-gray-500'}
                        `}>
                            MyPrayerTower.com
                        </span>
                        <span className="text-[10px] opacity-60">📲 bit.ly/myprayertowerapp</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleCopyText}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-sacred-600 text-white rounded-lg hover:bg-sacred-500 transition-colors"
                >
                    <Share2 size={16} />
                    Share
                </button>
            </div>
        </div>
    );
}

/**
 * Theme selector for shareable cards
 */
export function CardThemeSelector({
    value,
    onChange,
}: {
    value: 'light' | 'dark' | 'gradient' | 'sacred';
    onChange: (theme: 'light' | 'dark' | 'gradient' | 'sacred') => void;
}) {
    const themes = [
        { id: 'gradient', label: 'Sacred', preview: 'bg-gradient-to-br from-sacred-600 to-purple-800' },
        { id: 'sacred', label: 'Gold', preview: 'bg-gradient-to-br from-amber-100 to-gold-50' },
        { id: 'light', label: 'Light', preview: 'bg-white border border-gray-200' },
        { id: 'dark', label: 'Dark', preview: 'bg-gray-900' },
    ] as const;

    return (
        <div className="flex gap-2">
            {themes.map(theme => (
                <button
                    key={theme.id}
                    onClick={() => onChange(theme.id)}
                    className={`
                        flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                        ${value === theme.id ? 'ring-2 ring-sacred-500 ring-offset-2' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                    `}
                >
                    <div className={`w-8 h-8 rounded-md ${theme.preview}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{theme.label}</span>
                </button>
            ))}
        </div>
    );
}
