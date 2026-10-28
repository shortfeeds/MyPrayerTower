'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Users } from 'lucide-react';

const MIN_PRAYING = 5203;
const MAX_PRAYING = 9703;

export function GlobalPerpetualFlame() {
    // Seed within the 5203 - 9703 range
    const [activeCount, setActiveCount] = useState(7458);
    const [intensity, setIntensity] = useState(1);

    // Live smart fluctuation strictly bounded between 5203 - 9703
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCount(prev => {
                // Natural random step between -4 and +5
                const delta = Math.floor(Math.random() * 10) - 4;
                let next = prev + delta;
                if (next < MIN_PRAYING) next = MIN_PRAYING + Math.floor(Math.random() * 15);
                if (next > MAX_PRAYING) next = MAX_PRAYING - Math.floor(Math.random() * 15);
                return next;
            });
        }, 3200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Natural visual intensity scaling for flame between 0.95 and 1.25
        const progress = (activeCount - MIN_PRAYING) / (MAX_PRAYING - MIN_PRAYING);
        const newIntensity = 0.95 + progress * 0.25;
        setIntensity(Math.min(1.35, Math.max(0.9, newIntensity)));
    }, [activeCount]);

    return (
        <div className="relative group">
            {/* Flame Content */}
            <div className="flex flex-col items-center">
                <div className="relative mb-2">
                    {/* Outer Glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2 * intensity, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gold-500 rounded-full blur-[30px]"
                        style={{ filter: `blur(${20 * intensity}px)` }}
                    />

                    {/* The Flame Icon */}
                    <div className="relative z-10 flex items-center justify-center">
                        <motion.div
                            animate={{
                                y: [0, -4, 0],
                                rotate: [-1, 1, -1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-gold-500"
                        >
                            <Flame size={48 * intensity} fill="currentColor" strokeWidth={1} />
                        </motion.div>
                    </div>
                </div>

                {/* Live Count Label */}
                <motion.div
                    key={activeCount}
                    initial={{ opacity: 0.85, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm"
                >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] items-center flex gap-1 font-bold uppercase tracking-widest text-white/80">
                        <Users className="w-3 h-3" />
                        {activeCount.toLocaleString()} Praying Deeply
                    </span>
                </motion.div>
            </div>

            {/* Tooltip / Hover Info */}
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 p-4 bg-sacred-900 border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <p className="text-[10px] text-blue-200/60 uppercase tracking-wider mb-2 font-bold">The Perpetual Flame</p>
                <p className="text-xs text-white/90 leading-relaxed italic">
                    "The light shines in the darkness, and the darkness has not overcome it."
                </p>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gold-400 font-bold">LIVE SYNC</span>
                    <span className="text-[10px] text-white/40">Global Intensity: {Math.round(intensity * 100)}%</span>
                </div>
            </div>
        </div>
    );
}
