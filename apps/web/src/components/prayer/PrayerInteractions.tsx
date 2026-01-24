'use client';

import { useState } from 'react';
import { Heart, Share2, Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PrayerInteractionsProps {
    prayerId: string;
    prayerTitle: string;
    initialCount?: number;
}

export function PrayerInteractions({ prayerId, prayerTitle, initialCount = 0 }: PrayerInteractionsProps) {
    const [hasPrayed, setHasPrayed] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const handlePray = () => {
        if (hasPrayed) return;

        // Optimistic UI
        setHasPrayed(true);
        setCount(c => c + 1);

        // Celebration
        confetti({
            particleCount: 40,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#FFD700', '#FFFFFF', '#FFA500']
        });

        // TODO: Persist to backend
    };

    const handleShare = async () => {
        const shareData = {
            title: `Pray with me: ${prayerTitle}`,
            text: `Join me in this prayer on MyPrayerTower: ${prayerTitle}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            // Fallback for desktop
            setShowShareMenu(!showShareMenu);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
    const shareText = encodeURIComponent(`Pray with me: ${prayerTitle}`);

    return (
        <div className="flex flex-col items-center gap-6 mt-8 relative">
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePray}
                    disabled={hasPrayed}
                    className={`
                        relative overflow-hidden group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl
                        ${hasPrayed
                            ? 'bg-green-50 text-green-700 cursor-default scale-100' // Prayed state
                            : 'bg-sacred-900 text-white hover:bg-sacred-800 hover:-translate-y-1 hover:shadow-sacred-900/30' // Normal state
                        }
                    `}
                >
                    {hasPrayed ? (
                        <>
                            <Check className="w-5 h-5" />
                            <span>Prayer Offered</span>
                        </>
                    ) : (
                        <>
                            <Heart className={`w-5 h-5 ${hasPrayed ? 'fill-current' : 'fill-none group-hover:fill-current transition-all'}`} />
                            <span>I Prayed This</span>
                        </>
                    )}

                    {/* Count Bubble */}
                    {(count > 0 || hasPrayed) && (
                        <span className={`
                            ml-2 px-2 py-0.5 rounded-full text-xs font-medium 
                            ${hasPrayed ? 'bg-green-100/50' : 'bg-white/20'}
                        `}>
                            {count}
                        </span>
                    )}
                </button>

                <div className="relative">
                    <button
                        onClick={handleShare}
                        className="p-4 bg-white text-gray-500 hover:text-sacred-600 hover:bg-gray-50 rounded-full shadow-md border border-gray-100 transition-all hover:-translate-y-1"
                        title="Share Prayer"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>

                    {/* Desktop Share Menu */}
                    {showShareMenu && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 flex gap-1 min-w-[200px] animate-fade-in-up z-50">
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 hover:bg-sky-50 text-gray-600 hover:text-sky-500 rounded-lg transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <button
                                onClick={copyToClipboard}
                                className="p-3 hover:bg-gray-50 text-gray-600 hover:text-green-600 rounded-lg transition-colors relative"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-600" /> : <LinkIcon className="w-5 h-5" />}
                            </button>

                            {/* Arrow */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-400 italic">
                {hasPrayed ? "Thank you for uniting in prayer." : "Join others in offering this prayer."}
            </p>
        </div>
    );
}
