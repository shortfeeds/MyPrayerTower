'use client';

import React, { useEffect, useState } from 'react';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { Button } from '@/components/ui/button';
import {
    BookOpen, Sparkles, Heart, Church,
    MessageCircle, Music, User, Home,
    Gift, Calendar, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Minimal Type Definition for Telegram WebApp
interface TelegramWebApp {
    initDataUnsafe: {
        user?: {
            id: number;
            first_name: string;
            username?: string;
        };
    };
    expand: () => void;
    ready: () => void;
    close: () => void;
    themeParams: any;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
}

export function TelegramDashboard() {
    const [user, setUser] = useState<{ firstName: string } | null>(null);
    const [greeting, setGreeting] = useState("Peace be with you");

    useEffect(() => {
        // Initialize Telegram WebApp
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand(); // Full screen

            const tgUser = tg.initDataUnsafe?.user;
            if (tgUser) {
                setUser({ firstName: tgUser.first_name });
            }
        }

        // Set time-based greeting
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    const handleExternalLink = (url: string) => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink(url);
        } else {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-sacred-950 text-white overflow-x-hidden pb-20">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gold-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-sacred-600/20 rounded-full blur-[100px]"></div>
                <ParticleBackground count={20} opacity={0.4} />
            </div>

            {/* Header Section */}
            <header className="relative z-10 px-6 pt-8 pb-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-between items-center"
                >
                    <div>
                        <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-1">
                            {greeting}
                        </p>
                        <h1 className="text-3xl font-serif font-bold text-white">
                            {user?.firstName || 'Pilgrim'}
                        </h1>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                        <User className="w-5 h-5 text-gold-200" />
                    </div>
                </motion.div>
            </header>

            <main className="relative z-10 px-6 space-y-8 flex-1">

                {/* Daily Verse Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BookOpen className="w-24 h-24 text-white" />
                    </div>

                    <span className="inline-block px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-wider mb-4 border border-gold-500/10">
                        Daily Inspiration
                    </span>

                    <p className="text-xl font-serif leading-relaxed text-blue-50 relative z-10 mb-4 italic">
                        "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures."
                    </p>
                    <p className="text-sm text-blue-200/60 font-medium">Psalm 23:1-2</p>

                    <Link href="/readings" className="mt-6 flex items-center text-sm font-bold text-gold-400 group-hover:text-gold-300 transition-colors">
                        Read Gospel <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </motion.div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <DashboardCard
                        icon={<Sparkles className="w-6 h-6 text-purple-400" />}
                        title="Rosary"
                        subtitle="Mysteries"
                        color="bg-purple-500/20"
                        href="/rosary"
                        delay={0.2}
                    />
                    <DashboardCard
                        icon={<Heart className="w-6 h-6 text-red-400" />}
                        title="Novena"
                        subtitle="9 Days"
                        color="bg-red-500/20"
                        href="/novenas"
                        delay={0.3}
                    />
                    <DashboardCard
                        icon={<Church className="w-6 h-6 text-blue-400" />}
                        title="Mass"
                        subtitle="Finder"
                        color="bg-blue-500/20"
                        href="/churches"
                        delay={0.4}
                    />
                    <DashboardCard
                        icon={<MessageCircle className="w-6 h-6 text-emerald-400" />}
                        title="Prayer"
                        subtitle="Wall"
                        color="bg-emerald-500/20"
                        href="/prayer-wall"
                        delay={0.5}
                    />
                </div>

                {/* Support Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-5 rounded-2xl bg-gradient-to-r from-gold-600/20 to-gold-500/10 border border-gold-500/20 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                            <Gift className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gold-100">Support the Mission</h3>
                            <p className="text-xs text-gold-200/60">Help us keep the servers running</p>
                        </div>
                    </div>
                    <Link href="/contributions">
                        <Button size="sm" className="bg-gold-500 text-black hover:bg-gold-400 rounded-lg px-4 font-bold text-xs h-9">
                            Give Offering
                        </Button>
                    </Link>
                </motion.div>

            </main>

            {/* Bottom Tab Bar (Fixed) */}
            <div className="fixed bottom-0 left-0 right-0 bg-sacred-950/90 backdrop-blur-lg border-t border-white/5 py-3 px-6 pb-safe z-50">
                <div className="flex justify-between items-center max-w-sm mx-auto">
                    <TabItem icon={<Home className="w-6 h-6" />} label="Home" active />
                    <TabItem icon={<BookOpen className="w-6 h-6" />} label="Readings" href="/readings" />
                    <div className="w-12 h-12 -mt-8 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center shadow-lg shadow-gold-900/50 border-4 border-sacred-950">
                        <Link href="/prayers/create">
                            <Sparkles className="w-6 h-6 text-white" />
                        </Link>
                    </div>
                    {/* Offerings Tab */}
                    <Link href="/contributions" className="flex flex-col items-center gap-1 text-blue-200/40 hover:text-blue-100">
                        <Gift className="w-6 h-6" />
                        <span className="text-[10px] font-medium tracking-wide">Offerings</span>
                    </Link>
                    <TabItem icon={<User className="w-6 h-6" />} label="Profile" href="/profile" />
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ icon, title, subtitle, color, href, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay, duration: 0.5 }}
        >
            <Link href={href} className="block h-full">
                <div className="h-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors flex flex-col items-start gap-3 group">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg leading-none mb-1">{title}</h3>
                        <span className="text-xs text-blue-200/50 font-medium uppercase tracking-wider">{subtitle}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function TabItem({ icon, label, active, href = "#" }: any) {
    return (
        <Link href={href} className={`flex flex-col items-center gap-1 ${active ? 'text-gold-400' : 'text-blue-200/40 hover:text-blue-100'}`}>
            {icon}
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
        </Link>
    );
}
