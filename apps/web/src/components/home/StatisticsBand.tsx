'use client';

import { useEffect, useRef } from 'react';
import { Building2, Heart, Users, Flame, Activity } from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

// Component for smooth counting up animation
function Counter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
        duration: 2
    });

    useEffect(() => {
        if (inView) {
            motionValue.set(value);
        }
    }, [inView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString() + '+';
            }
        });
    }, [springValue]);

    return <span ref={ref} className="tabular-nums">0+</span>;
}

interface StatItemProps {
    icon: React.ElementType;
    value: number;
    label: string;
    description: string;
    delay: number;
}

function StatItem({ icon: Icon, value, label, description, delay }: StatItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay }}
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group"
        >
            <div className="mb-4 relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/20">
                    <Icon className="w-7 h-7 text-white transition-colors" />
                </div>
            </div>

            <div className="font-serif text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-sm">
                <Counter value={value} />
            </div>

            <div className="font-bold text-orange-200 uppercase tracking-widest text-xs mb-2">
                {label}
            </div>

            <div className="text-white/60 text-sm font-medium leading-tight max-w-[150px]">
                {description}
            </div>
        </motion.div>
    );
}

export function StatisticsBand() {
    return (
        <section className="py-20 relative overflow-hidden bg-[#2a1b1b]">
            {/* Background Gradient matching the reference: Gold/Cream top fading to dark brown/black */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#4a3b32] via-[#2a1b1b] to-[#1a1111]" />

            {/* Top curved light effect (simulating the header curve in the image) */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#e8dccb]/10 to-transparent opacity-30 pointer-events-none" />

            {/* Elegant Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Warm Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10 text-white">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-orange-200 mb-6 backdrop-blur-md"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        Live Community Statistics
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                    >
                        A Global Community <br />
                        <span className="text-white">
                            United in Prayer
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-white/70"
                    >
                        Join millions of Catholics worldwide. Every number represents a soul drawing closer to God.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatItem
                        icon={Users}
                        value={125249}
                        label="Faithful Users"
                        description="Praying daily across apps"
                        delay={0.3}
                    />
                    <StatItem
                        icon={Heart}
                        value={4370}
                        label="Prayers Included"
                        description="In our growing library"
                        delay={0.4}
                    />
                    <StatItem
                        icon={Building2}
                        value={9250}
                        label="Churches Listed"
                        description="Parishes and sanctuaries"
                        delay={0.5}
                    />
                    <StatItem
                        icon={Flame}
                        value={6800}
                        label="Saints Profiles"
                        description="Inspiring lives of faith"
                        delay={0.6}
                    />
                </div>
            </div>
        </section>
    );
}
