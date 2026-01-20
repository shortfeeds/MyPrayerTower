'use client';

import { motion } from 'framer-motion';
import { Flame, Clock, Plus, ChevronRight } from 'lucide-react';
import { SACRED_COPY } from '@/lib/sacred-copy';
import Link from 'next/link';
import Image from 'next/image';

const MOCK_CANDLES = [
    {
        id: '1',
        intention: 'For the healing of my mother',
        duration: '7 Days',
        remaining: '3 Days',
        image: '/images/candles/altar.png',
        tier: 'Altar'
    },
    {
        id: '2',
        intention: 'Guidance in my career path',
        duration: '30 Days',
        remaining: '24 Days',
        image: '/images/candles/divine.png',
        tier: 'Divine'
    }
];

export function MyCandlesCard() {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                    Active Vigils
                </h2>
                <Link href="/candles" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                    Light a Candle <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-4">
                {MOCK_CANDLES.map((candle, idx) => (
                    <motion.div
                        key={candle.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-amber-200 transition-colors"
                    >
                        <div className="relative w-12 h-16 flex-shrink-0">
                            <Image
                                src={candle.image}
                                alt={candle.tier}
                                fill
                                className="object-contain"
                            />
                            {/* Glow effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">{candle.intention}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <Clock className="w-3 h-3" />
                                <span>{candle.remaining} remaining</span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{SACRED_COPY.cta.lightCandle}</span>
                </button>
            </div>

            <p className="text-xs text-center text-slate-400 mt-4 italic">
                {SACRED_COPY.candles.burning}
            </p>
        </div>
    );
}
