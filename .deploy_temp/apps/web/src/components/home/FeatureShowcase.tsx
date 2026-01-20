'use client';

import Link from 'next/link';
import {
    Flame, Heart, Star, BookOpen, Users, MapPin,
    ChevronRight, Trophy, Sparkles, Target
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Dashboard Preview Component
function DashboardPreview() {
    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-w-4xl mx-auto transform hover:scale-[1.02] transition-transform duration-500">
            {/* Fake Header */}
            <div className="bg-gradient-to-r from-sacred-600 to-sacred-800 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg border border-white/20">
                        JM
                    </div>
                    <div>
                        <div className="font-bold text-lg">Good Morning!</div>
                        <div className="text-blue-100 text-sm">Start your spiritual journey 🙏</div>
                    </div>
                </div>
                <div className="hidden sm:block text-right">
                    <div className="text-gold-300 font-bold">24th Sunday in Ordinary Time</div>
                    <div className="text-xs text-blue-200 uppercase tracking-widest">Liturgical Day</div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-cream-50/50">
                {/* Daily Progress */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-sacred-600" />
                        Daily Goals
                    </h3>
                    <div className="flex items-center gap-6">
                        {/* Fake Progress Rings */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                                <circle cx="48" cy="48" r="40" stroke="#EAB308" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="60" strokeLinecap="round" />
                            </svg>
                            <span className="absolute font-bold text-xl text-gray-800">75%</span>
                        </div>
                        <div className="space-y-3 flex-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Morning Prayer</span>
                                <span className="text-green-600 font-bold">✓ Complete</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Daily Reading</span>
                                <span className="text-gray-400">Todo</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Rosary</span>
                                <span className="text-gray-400">Todo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Up */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-between">
                    <div>
                        <div className="text-blue-600 font-bold text-sm uppercase tracking-wide mb-1">Recommended</div>
                        <h3 className="font-display font-bold text-gray-900 text-lg leading-tight mb-2">
                            Prayer for Peace
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            Lord, make me an instrument of your peace...
                        </p>
                    </div>
                    <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
                        Pray Now
                    </button>
                </div>

                {/* Community */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <span className="font-bold text-gray-900">1,240 people</span> praying live
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">
                            ● Live Session
                        </span>
                        <span className="text-xs text-gray-500 self-center">Started 5m ago</span>
                    </div>
                </div>
            </div>

            {/* CTA Overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Link
                    href="/register"
                    className="transform scale-110 px-8 py-4 bg-sacred-600 text-white font-bold rounded-full shadow-2xl hover:bg-sacred-700 transition-all flex items-center gap-2"
                >
                    <Sparkles size={20} className="text-gold-400" />
                    Create Free Account
                </Link>
            </div>
        </div>
    );
}

export function FeatureShowcase() {
    const features = [
        {
            icon: Target,
            title: "Track Your Spiritual Growth",
            desc: "Set daily prayer goals, maintain streaks, and see your progress.",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            icon: Users,
            title: "Pray with Catholics Worldwide",
            desc: "Join thousands in live prayer sessions and community.",
            color: "text-rose-500",
            bg: "bg-rose-50"
        },
        {
            icon: BookOpen,
            title: "Today's Mass Readings",
            desc: "Daily Gospel, readings, and saint reflections.",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            icon: Trophy,
            title: "Celebrate Milestones",
            desc: "Earn badges and achievements as you grow in faith.",
            color: "text-gold-500",
            bg: "bg-gold-50"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-cream-50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Your Personal <span className="text-sacred-600">Prayer Sanctuary</span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        More than just a library of prayers. MyPrayerTower is a complete spiritual companion designed to help you build a lasting habit of prayer.
                    </p>
                </div>

                {/* Interactive Preview */}
                <div className="mb-20 relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/20 via-sacred-500/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-50 transform" />
                    <DashboardPreview />
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">
                            Interactive Preview • Hover to Explore
                        </p>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center"
                        >
                            <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-sacred-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
