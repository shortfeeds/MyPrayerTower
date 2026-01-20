'use client';

import { useState } from 'react';
import { Heart, Share2, Copy, Check, X, Facebook, MessageCircle } from 'lucide-react';

interface ShareCardProps {
    prayer?: {
        id: string;
        content: string;
        prayerCount: number;
    };
    onClose?: () => void;
}

export function SharePrayerCard({ prayer, onClose }: ShareCardProps) {
    const [copied, setCopied] = useState(false);

    if (!prayer) return null;

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/prayer/${prayer.id}`;
    const shareText = `Please join me in prayer: "${prayer.content.substring(0, 100)}..." 🙏`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        {
            name: 'Copy Link',
            icon: copied ? Check : Copy,
            onClick: handleCopy,
            color: 'bg-gray-100 text-gray-700',
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`),
            color: 'bg-green-500 text-white',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`),
            color: 'bg-blue-600 text-white',
        },
        {
            name: 'X (Twitter)',
            icon: Share2,
            onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`),
            color: 'bg-black text-white',
        },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Prayer Card Preview */}
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-6 text-white text-center mb-6">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-medium leading-relaxed">
                        "{prayer.content.substring(0, 80)}..."
                    </p>
                    <p className="mt-4 text-white/80 text-sm">
                        🙏 {prayer.prayerCount} people praying
                    </p>
                    <p className="mt-2 text-white/60 text-xs">myprayertower.com</p>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Share Prayer Request</h3>

                <div className="grid grid-cols-2 gap-3">
                    {shareOptions.map((option) => (
                        <button
                            key={option.name}
                            onClick={option.onClick}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium ${option.color}`}
                        >
                            <option.icon className="w-5 h-5" />
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Loading Skeleton Component
export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
    );
}

export function PrayerCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
            </div>
        </div>
    );
}

export function ChurchCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
            <Skeleton className="h-40 w-full" />
            <div className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}
