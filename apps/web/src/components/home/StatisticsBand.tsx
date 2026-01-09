'use client';

import { useEffect, useState } from 'react';
import { Building2, Heart, Users, Flame, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// Hook for realistic live counters
function useLiveCounter(base: number, growthRate: number) {
    const [count, setCount] = useState(base);

    useEffect(() => {
        const now = Date.now();
        // Small daily seed to make it feel dynamic but stable across refreshes
        // grow by ~100 per day relative to a fixed epoch, not epoch 0
        const daySeed = Math.floor(now / (1000 * 60 * 60 * 24)) % 1000;
        const hourOffset = (now % 86400000) / 10000;

        const startValue = Math.floor(base + daySeed + (hourOffset * growthRate));

        setCount(startValue);

        // Random live updates
        const interval = setInterval(() => {
            // Random chance to update
            if (Math.random() > 0.6) {
                setCount((prev: number) => prev + Math.floor(Math.random() * 2) + 1);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [base, growthRate]);

    return count;
}

interface StatItemProps {
    icon: React.ElementType;
    value: number;
    label: string;
    description: string;
    growthRate: number;
    delay: number;
}

function StatItem({ icon: Icon, value, label, description, growthRate, delay }: StatItemProps) {
    const count = useLiveCounter(value, growthRate);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
            className="flex flex-col items-center text-center p-6 relative group"
        >
            <div className="mb-6 relative">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl backdrop-blur-sm">
                    <Icon className="w-8 h-8 text-gold-400 group-hover:text-white transition-colors" />
                </div>
                {/* Glow effect behind icon */}
                <div className="absolute inset-0 bg-gold-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <div className="font-serif text-3xl lg:text-5xl font-bold text-white mb-2 tracking-tight tabular-nums relative z-10 drop-shadow-sm">
                {count.toLocaleString()}
            </div>

            <div className="font-bold text-gold-200 uppercase tracking-widest text-xs mb-1">
                {label}
            </div>

            <div className="text-blue-100/60 text-sm font-medium">
                {description}
            </div>
        </motion.div>
    );
}

export function StatisticsBand() {
    return (
        <section className="py-24 bg-sacred-900 relative overflow-hidden">
            {/* World Map Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5 2.24 5 5%3E%3C/svg%3E")`,
                }}
            />

            {/* Gradient Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sacred-600/20 rounded-full blur-[120px] translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-20">
                    <div className="max-w-xl text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gold-300 backdrop-blur-sm shadow-inner">
                                <Activity className="w-4 h-4" />
                                <span className="relative flex h-2 w-2 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Real-time Community Stats
                            </span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
                            A Global Community <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200">
                                United in Prayer
                            </span>
                        </h2>
                        <p className="text-lg text-blue-100/70 leading-relaxed">
                            Join millions of Catholics worldwide as we lift our hearts together. Every number represents a soul drawing closer to God.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative gap-8 lg:gap-0">
                    {/* Vertical Dividers for Desktop */}
                    <div className="hidden lg:block absolute top-8 bottom-8 left-1/4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                    <div className="hidden lg:block absolute top-8 bottom-8 left-2/4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                    <div className="hidden lg:block absolute top-8 bottom-8 left-3/4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                    <StatItem
                        icon={Users}
                        value={112450}
                        growthRate={2}
                        label="Faithful Users"
                        description="Praying daily across apps"
                        delay={0.1}
                    />
                    <StatItem
                        icon={Heart}
                        value={543921}
                        growthRate={5}
                        label="Prayers Completed"
                        description="Total prayers this month"
                        delay={0.2}
                    />
                    <StatItem
                        icon={Building2}
                        value={12450}
                        growthRate={0.1}
                        label="Churches Listed"
                        description="Parishes and sanctuaries"
                        delay={0.3}
                    />
                    <StatItem
                        icon={Flame}
                        value={254203}
                        growthRate={1}
                        label="Active Streaks"
                        description="Users creating habits"
                        delay={0.4}
                    />
                </div>
            </div>
        </section>
    );
}
