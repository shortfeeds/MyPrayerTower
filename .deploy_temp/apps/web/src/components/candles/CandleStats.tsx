'use client';

import { motion } from 'framer-motion';
import { Flame, Users, Heart, Globe } from 'lucide-react';

interface StatsProps {
    totalPrayers: number;
    activeCandles: number;
}

export function CandleStats({ totalPrayers, activeCandles }: StatsProps) {
    const stats = [
        {
            label: 'Total Prayers Lit',
            value: totalPrayers.toLocaleString(),
            icon: Flame,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            label: 'Active Candles',
            value: activeCandles.toLocaleString(),
            icon: Heart,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10'
        },
        {
            label: 'Global Community',
            value: '120+',
            suffix: 'Countries',
            icon: Globe,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Prayer Intentions',
            value: ((totalPrayers * 1.5).toFixed(0)).toLocaleString(), // Mock multiplier for now
            icon: Users,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        }
    ];

    return (
        <div className="py-12 bg-white relative z-20 -mt-10 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 rounded-2xl p-6 text-center group hover:bg-white hover:shadow-lg transition-all border border-gray-100"
                        >
                            <div className={`w-12 h-12 mx-auto rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                {stat.value}
                                {stat.suffix && <span className="text-sm text-gray-500 ml-1 font-normal">{stat.suffix}</span>}
                            </div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
