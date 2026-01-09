'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Cross, Gift, Heart, ArrowRight, Sparkles } from 'lucide-react';

export function OfferingsGrid() {
    const offerings = [
        {
            title: 'Light a Candle',
            description: 'A virtual prayer candle burning for your intentions, 24/7',
            icon: Flame,
            href: '/candles',
            price: 'From $1',
            colors: 'from-amber-500 to-orange-500',
            bgLight: 'from-amber-50 to-orange-50',
            border: 'border-amber-200',
        },
        {
            title: 'Mass Offerings',
            description: 'Request a Holy Mass for your loved ones, living or deceased',
            icon: Cross,
            href: '/mass-offerings',
            price: 'From $15',
            colors: 'from-blue-500 to-indigo-500',
            bgLight: 'from-blue-50 to-indigo-50',
            border: 'border-blue-200',
        },
        {
            title: 'Spiritual Bouquets',
            description: 'A beautiful gift of prayers, candles, and Mass intentions',
            icon: Gift,
            href: '/bouquets',
            price: 'From $10',
            colors: 'from-rose-500 to-pink-500',
            bgLight: 'from-rose-50 to-pink-50',
            border: 'border-rose-200',
        },
        {
            title: 'Eternal Memorials',
            description: 'Honor your departed loved ones with a lasting digital tribute',
            icon: Heart,
            href: '/memorials',
            price: 'From $20',
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

                            {/* Price & Arrow */}
                            <div className="flex items-center justify-between mt-auto">
                                <span className={`text-sm font-bold bg-gradient-to-r ${offering.colors} bg-clip-text text-transparent`}>
                                    {offering.price}
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
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
                                <Heart className="w-4 h-4" />
                                Eternal Memorials
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                                Honor Those Who Have Passed
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Create a beautiful, lasting digital memorial for your loved ones.
                                Light candles, request Masses, and invite family to share memories together.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Permanent digital tribute with photos',
                                    'Light candles and send flowers',
                                    'Request Masses for their soul',
                                    'Share with family worldwide',
                                    'QR code for gravestone',
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-gray-700">
                                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                            </svg>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/memorials"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold rounded-full hover:shadow-lg transition-all"
                            >
                                Explore Memorials
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Visual */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-violet-200 rounded-3xl blur-3xl opacity-50" />
                            <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                        <Heart className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">In Loving Memory</h3>
                                        <p className="text-gray-500">1945 — 2024</p>
                                    </div>
                                </div>
                                <div className="flex justify-around text-center mb-6 py-4 border-y border-gray-100">
                                    <div>
                                        <div className="text-2xl font-bold text-amber-500">127</div>
                                        <div className="text-xs text-gray-500">🕯️ Candles</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-blue-500">18</div>
                                        <div className="text-xs text-gray-500">✝️ Masses</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-rose-500">45</div>
                                        <div className="text-xs text-gray-500">🌹 Flowers</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 italic">
                                    "A loving mother, grandmother, and friend to all. Forever in our hearts..."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
