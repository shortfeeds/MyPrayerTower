'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Cross, Gift, Heart, ArrowRight, Sparkles } from 'lucide-react';

export function OfferingsGrid() {
    const offerings = [
        {
            title: 'Light a Candle',
            description: 'A virtual prayer candle burning for your intentions',
            icon: Flame,
            href: '/candles',
            offeringTab: 'candle',
            cta: 'Start Praying',
            colors: 'from-amber-500 to-orange-500',
            bgLight: 'from-amber-50 to-orange-50',
            border: 'border-amber-200',
        },
        {
            title: 'Mass Offerings',
            description: 'Request a Holy Mass for your loved ones',
            icon: Cross,
            href: '/mass-offerings',
            offeringTab: 'mass',
            cta: 'Request a Mass',
            colors: 'from-blue-500 to-indigo-500',
            bgLight: 'from-blue-50 to-indigo-50',
            border: 'border-blue-200',
        },
        {
            title: 'Spiritual Bouquets',
            description: 'A beautiful gift of prayers and intentions',
            icon: Gift,
            href: '/bouquets',
            offeringTab: 'bouquet',
            cta: 'Send a Gift',
            colors: 'from-rose-500 to-pink-500',
            bgLight: 'from-rose-50 to-pink-50',
            border: 'border-rose-200',
        },
        {
            title: 'Eternal Memorials',
            description: 'Honor your departed loved ones with a tribute',
            icon: Heart,
            href: '/memorials',
            offeringTab: undefined,
            cta: 'Honor Someone',
            colors: 'from-purple-500 to-violet-500',
            bgLight: 'from-purple-50 to-violet-50',
            border: 'border-purple-200',
            isNew: true,
        },
    ];

    return (
        <section className="py-16 bg-cream-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
                        <Sparkles className="w-4 h-4" />
                        Sacred Offerings
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                        Acts of Faith & Love
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Meaningful ways to support your spiritual journey and honor your loved ones
                    </p>
                </div>

                {/* Offerings Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {offerings.map((offering) => (
                        <Link
                            key={offering.href}
                            href={offering.href}
                            data-open-offering={offering.offeringTab}
                            className={`group relative bg-gradient-to-br ${offering.bgLight} rounded-3xl p-6 border ${offering.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            {/* New Badge */}
                            {offering.isNew && (
                                <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xs font-bold rounded-full shadow-lg">
                                    NEW
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${offering.colors} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                <offering.icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="font-bold text-gray-900 text-lg mb-2">{offering.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{offering.description}</p>

                            {/* CTA & Arrow */}
                            <div className="flex items-center justify-between mt-auto">
                                <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${offering.colors} text-white shadow-sm`}>
                                    {offering.cta}
                                </span>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function MemorialPreview() {
    return (
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
                    <Heart className="w-4 h-4" />
                    Eternal Memorials
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                    Preserve Sacred Memories Forever
                </h2>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                    Create a perpetual memorial page with interactive candles, condolences, and Mass offerings for your departed loved ones.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/memorials/create"
                        className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-600/20 hover:scale-105 transition-all"
                    >
                        Create an Eternal Memorial
                    </Link>
                    <Link
                        href="/memorials"
                        className="px-8 py-3.5 rounded-full bg-white border border-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-all"
                    >
                        Explore Memorial Registry
                    </Link>
                </div>
            </div>
        </section>
    );
}
