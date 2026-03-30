'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Users, BookOpen, Gift, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromotionalBannerProps {
    variant?: 'rosary' | 'lent' | 'advent' | 'generic' | 'app' | 'candle';
}

/**
 * PromotionalBanner - Beautiful promotional banners for various features and seasons
 */
export function PromotionalBanner({ variant = 'generic' }: PromotionalBannerProps) {
    const banners = {
        rosary: {
            badge: 'PRAYER FEATURE',
            title: 'Pray the Rosary Daily',
            description: 'Join thousands praying the Rosary together with our guided audio experience.',
            cta: 'Start Praying',
            ctaLink: '/prayers/rosary',
            gradient: 'from-indigo-600 via-purple-600 to-pink-600',
            icon: Sparkles,
            bgPattern: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        },
        lent: {
            badge: 'LITURGICAL SEASON',
            title: 'Lenten Journey 2026',
            description: 'Prepare your heart this Lent with daily reflections, fasting reminders, and special prayers.',
            cta: 'Begin Your Journey',
            ctaLink: '/challenges/lent',
            gradient: 'from-violet-700 via-purple-800 to-indigo-900',
            icon: Calendar,
            bgPattern: 'radial-gradient(circle at 20% 80%, rgba(139,92,246,0.3) 0%, transparent 50%)',
        },
        advent: {
            badge: '🕯️ ADVENT',
            title: 'Prepare the Way',
            description: 'Light a virtual Advent candle and journey through the season of hope.',
            cta: 'Join Advent Journey',
            ctaLink: '/challenges/advent',
            gradient: 'from-blue-800 via-indigo-800 to-purple-900',
            icon: Star,
            bgPattern: 'radial-gradient(circle at 80% 50%, rgba(255,215,0,0.2) 0%, transparent 50%)',
        },
        generic: {
            badge: 'GROW IN FAITH',
            title: 'Your Daily Spiritual Companion',
            description: 'A sanctuary for your soul. Access daily prayers, mass readings, and a global community of believers.',
            cta: 'Join Community Free',
            ctaLink: '/register',
            // Using standard Tailwind classes for guaranteed visibility
            gradient: 'from-slate-900 via-slate-800 to-slate-950',
            icon: Users,
            // Subtle, premium gold pattern
            bgPattern: 'radial-gradient(circle at 100% 0%, rgba(245, 158, 11, 0.25) 0%, transparent 60%)',
        },
        app: {
            badge: 'MOBILE APP',
            title: 'Take Your Faith Everywhere',
            description: 'Download the MyPrayerTower app for iOS and Android. Pray anytime, anywhere.',
            cta: 'Download Now',
            ctaLink: '/app',
            gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
            icon: Gift,
            bgPattern: 'radial-gradient(circle at 50% 100%, rgba(16,185,129,0.3) 0%, transparent 50%)',
        },
        candle: {
            badge: '🕯️ LIGHT A CANDLE',
            title: 'Share Your Prayer Intentions',
            description: 'Light a virtual candle and have thousands pray for your intentions.',
            cta: 'Light a Candle',
            ctaLink: '/candles',
            gradient: 'from-amber-600 via-orange-600 to-red-600',
            icon: Heart,
            bgPattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 40%)',
        },
    };

    const banner = banners[variant];
    const Icon = banner.icon;

    return (
        <motion.section
            className="py-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                <div
                    className={`bg-gradient-to-r ${banner.gradient} rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl`}
                >
                    {/* Background Pattern Overlay */}
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{ backgroundImage: banner.bgPattern }}
                    />

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-bold rounded-full mb-4 backdrop-blur-sm">
                                {banner.badge}
                            </span>
                            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                                {banner.title}
                            </h2>
                            <p className="text-white/80 text-lg max-w-xl">
                                {banner.description}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <Link
                                href={banner.ctaLink}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                <Icon className="w-5 h-5" />
                                {banner.cta}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

/**
 * AppDownloadBanner - Specialized banner for app downloads
 */
export function AppDownloadBanner() {
    return (
        <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-full mb-4 border border-emerald-500/30">
                            📱 MOBILE APP
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                            Take Your Faith <span className="text-emerald-400">Everywhere</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                            Download the MyPrayerTower app and carry your prayers, readings, and spiritual journal with you.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            {/* Telegram Bot Button */}
                            <a
                                href="https://t.me/MyPrayerTowerBot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-[#229ED9] text-white font-bold rounded-xl hover:bg-[#1f8ebf] transition-colors shadow-lg"
                            >
                                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs text-blue-100">Join on</div>
                                    <div className="text-sm font-bold">Telegram</div>
                                </div>
                            </a>

                            {/* Android App Button */}
                            <a
                                href="https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs text-gray-500">Get it on</div>
                                    <div className="text-sm font-bold">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/**
 * SeasonalBanner - Changes based on liturgical season
 */
export function SeasonalBanner() {
    // This could be dynamic based on current date/liturgical calendar
    const now = new Date();
    const month = now.getMonth();

    // Determine current season (simplified)
    let variant: 'lent' | 'advent' | 'generic' = 'generic';
    if (month === 11 || month === 0) variant = 'advent'; // Dec-Jan
    if (month >= 1 && month <= 3) variant = 'lent'; // Feb-Mar

    return <PromotionalBanner variant={variant} />;
}
