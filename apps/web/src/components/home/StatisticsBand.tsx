'use client';

import { useEffect, useState, useRef } from 'react';
import { Building2, Heart, Globe, Users, BookOpen, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatItemProps {
    icon: React.ElementType;
    value: number;
    suffix: string;
    label: string;
    color: string;
}

function StatItem({ icon: Icon, value, suffix, label, color }: StatItemProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <div ref={ref} className="text-center group">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-blue-100 font-medium">{label}</div>
        </div>
    );
}

/**
 * StatisticsBand - Animated statistics section with count-up effect
 */
export function StatisticsBand() {
    const stats = [
        {
            icon: Users,
            value: 1000000,
            suffix: "+",
            label: "Faithful Users",
            color: "bg-sacred-500"
        },
        {
            icon: Heart,
            value: 5000000,
            suffix: "+",
            label: "Prayers Said",
            color: "bg-rose-500"
        },
        {
            icon: Building2,
            value: 10000,
            suffix: "+",
            label: "Churches Listed",
            color: "bg-emerald-500"
        },
        {
            icon: Globe,
            value: 100,
            suffix: "+",
            label: "Countries",
            color: "bg-blue-500"
        },
        {
            icon: Flame,
            value: 50000,
            suffix: "+",
            label: "Prayer Streaks",
            color: "bg-gold-500"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-sacred-700 via-sacred-800 to-sacred-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 bg-white/10 text-gold-300 text-sm font-bold rounded-full mb-4 backdrop-blur-sm border border-white/10">
                        BY THE NUMBERS
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        A Growing Global <span className="text-gold-400">Community of Faith</span>
                    </h2>
                    <p className="text-lg text-blue-100/80">
                        Join millions of Catholics around the world who are deepening their relationship with God.
                    </p>
                </motion.div>

                {/* Stats Grid - Responsive with better centering */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/10 hover:bg-white/15 transition-colors">
                            <StatItem {...stat} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
