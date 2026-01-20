'use client';

import Link from 'next/link';
import { Flame, Gift, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function SacredMoments() {
    const services = [
        {
            id: 'candles',
            title: 'Light a Candle',
            subtitle: 'For your intentions',
            description: 'Keep a virtual candle burning for 3, 7, or 30 days. A powerful sign of your unceasing prayer.',
            icon: Flame,
            gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
            border: 'border-amber-200/50',
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-100',
            link: '/candles',
            cta: 'Light a Candle'
        },
        {
            id: 'memorials',
            title: 'Create a Memorial',
            subtitle: 'Honor a loved one',
            description: 'Create a beautiful, permanent tribute page with photos, biography, and a virtual candle wall.',
            icon: Crown,
            gradient: 'from-sacred-500/20 via-sacred-600/10 to-transparent',
            border: 'border-sacred-200/50',
            iconColor: 'text-sacred-700',
            iconBg: 'bg-sacred-100',
            link: '/memorials',
            cta: 'Start a Tribute'
        },
        {
            id: 'mass',
            title: 'Request a Mass',
            subtitle: 'The highest form of prayer',
            description: 'Have a Holy Mass offered for your special intentions or for the repose of a soul.',
            icon: Gift,
            gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
            border: 'border-purple-200/50',
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-100',
            link: '/mass-offerings',
            cta: 'Request Mass'
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-sacred-50 border border-sacred-100 rounded-full text-sm font-semibold text-sacred-600 mb-6">
                            <Sparkles className="w-4 h-4" />
                            Sacred Services
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                            Meaningful Ways to <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sacred-700 to-sacred-500">
                                Express Your Faith
                            </span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Participate in the ancient traditions of the Church through these special offerings, accessible from anywhere in the world.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={service.link}
                                className={`group relative block h-full bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200/80 hover:border-gray-200 transition-all duration-500 flex flex-col overflow-hidden`}
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out`}></div>

                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Icon Header */}
                                    <div className="flex justify-between items-start mb-10">
                                        <div className={`w-20 h-20 rounded-3xl ${service.iconBg} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm`}>
                                            <service.icon className={`w-10 h-10 ${service.iconColor}`} />
                                        </div>
                                        <div className={`w-12 h-12 rounded-full border ${service.border} flex items-center justify-center bg-white group-hover:bg-gray-50 transition-colors`}>
                                            <ArrowRight className={`w-5 h-5 ${service.iconColor} transform -rotate-45 group-hover:rotate-0 transition-transform duration-500`} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 bg-white/50 backdrop-blur-sm border ${service.border} ${service.iconColor}`}>
                                            {service.subtitle}
                                        </span>
                                        <h3 className="font-display text-3xl font-bold text-gray-900 mb-4 group-hover:text-black transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-500 text-lg leading-relaxed mb-8 group-hover:text-gray-600">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* CTA Button (Faux) */}
                                    <div className="mt-auto">
                                        <div className="w-full py-4 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-md border border-transparent group-hover:border-gray-100 text-gray-900 font-bold text-center transition-all duration-300 flex items-center justify-center gap-2">
                                            {service.cta}
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
