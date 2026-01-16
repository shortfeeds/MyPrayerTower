'use client';

import { motion } from 'framer-motion';
import { Flame, Star, Crown, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

// Shared types and constants (could be moved to separate file)
export type CandleColor = 'white' | 'red' | 'blue' | 'gold';
export type CandleTier = 'premium' | 'standard' | 'basic' | 'free';

export interface Candle {
    id: string;
    userName: string;
    intention: string;
    color: CandleColor;
    remainingHours: number;
    prayerCount: number;
    isUserCandle?: boolean;
    tier: CandleTier;
    country?: string;
    litAt?: string;
}

// ... styles remain same ...

export function CandleCard({ candle, onPray }: CandleCardProps) {
    const style = CANDLE_STYLES[candle.color];
    const [justPrayed, setJustPrayed] = useState(false);

    const handlePray = (e: React.MouseEvent) => {
        e.stopPropagation();
        setJustPrayed(true);
        onPray(candle.id);
        setTimeout(() => setJustPrayed(false), 2000);
    };

    const formatTimeLeft = (hours: number) => {
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            const h = hours % 24;
            return `${days}d ${h}h left`;
        }
        return `${hours}h left`;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className={`relative group rounded-3xl overflow-hidden bg-white border ${style.border} shadow-lg hover:shadow-2xl hover:${style.glow} transition-all duration-300`}
        >
            {/* Premium Badge */}
            {candle.tier === 'premium' && (
                <div className="absolute top-0 right-0 z-20">
                    <div className={`${style.badge} text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1`}>
                        <Crown className="w-3 h-3 fill-current" />
                        PREMIUM
                    </div>
                </div>
            )}

            {/* Candle Visual */}
            <div className={`relative h-48 ${style.bg} flex items-end justify-center pb-8 overflow-hidden`}>
                {/* Glow behind flame */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-24 h-24 bg-white/40 blur-3xl rounded-full" />

                {/* Candle Stick */}
                <div className="relative w-16 h-32 bg-gradient-to-r from-white/90 via-white to-gray-100 rounded-lg shadow-inner mx-auto">
                    {/* Flame Animation */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-12">
                        <div className="w-full h-full animate-flicker origin-bottom scale-110">
                            <Flame className="w-full h-full fill-orange-400 text-yellow-300 drop-shadow-[0_0_15px_rgba(255,165,0,0.8)] filter blur-[0.5px]" />
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-4 bg-white blur-[2px] rounded-full opacity-80" />
                        </div>
                    </div>
                    {/* Wax drip details could go here */}
                    <div className="absolute top-0 w-full h-4 bg-white/50 rounded-t-lg" />
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5 relative bg-white">
                {/* Intention */}
                <div className="mb-4">
                    <p className="text-gray-900 font-serif text-lg leading-relaxed line-clamp-3 italic">
                        "{candle.intention}"
                    </p>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center text-gray-700 font-bold text-xs border border-white shadow-sm`}>
                            {candle.userName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-900">{candle.userName}</span>
                            {candle.country && (
                                <span className="text-[10px] text-gray-500 font-medium">{candle.country}</span>
                            )}
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                {formatTimeLeft(candle.remainingHours)}
                            </span>
                        </div>
                    </div>

                    {/* Pray Button */}
                    <button
                        onClick={handlePray}
                        className={`group/btn relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${justPrayed
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                        disabled={justPrayed}
                    >
                        <Heart className={`w-3.5 h-3.5 ${justPrayed ? 'fill-amber-500 text-amber-500 scale-125' : 'group-hover/btn:text-amber-500'} transition-transform`} />
                        <span>{candle.prayerCount + (justPrayed ? 1 : 0)}</span>
                        {justPrayed && (
                            <motion.span
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: [0, 1, 0], y: -20 }}
                                className="absolute -top-4 right-0 text-amber-500 font-bold"
                            >
                                +1
                            </motion.span>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
