'use client';

import { Heart, Gift, Flame, BookOpen, ArrowRight, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ContributionsPage() {
    useEffect(() => {
        // Ensure Telegram WebApp is expanded
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            window.Telegram.WebApp.expand();
        }
    }, []);

    const methods = [
        {
            title: 'General Donation',
            description: 'Support the daily operations of MyPrayerTower.',
            icon: CreditCard,
            href: 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=myprayertower2@gmail.com&currency_code=USD',
            color: 'bg-blue-100 text-blue-600',
            btnColor: 'bg-blue-600 hover:bg-blue-700',
            external: true
        },
        {
            title: 'Mass Offerings',
            description: 'Have a Holy Mass offered for your intentions.',
            icon: Gift,
            href: '/mass-offerings',
            color: 'bg-indigo-100 text-indigo-600',
            btnColor: 'bg-indigo-600 hover:bg-indigo-700'
        },
        {
            title: 'Light a Candle',
            description: 'Light a virtual candle that burns for your prayer.',
            icon: Flame,
            href: '/candles',
            color: 'bg-amber-100 text-amber-600',
            btnColor: 'bg-amber-600 hover:bg-amber-700'
        },
        {
            title: 'Spiritual Bouquets',
            description: 'Send a beautiful bouquet of prayers to a loved one.',
            icon: BookOpen,
            href: '/bouquets',
            color: 'bg-rose-100 text-rose-600',
            btnColor: 'bg-rose-600 hover:bg-rose-700'
        },
        {
            title: 'Eternal Memorials',
            description: 'Create a permanent tribute page for a departed soul.',
            icon: Heart,
            href: '/memorials/create',
            color: 'bg-slate-100 text-slate-600',
            btnColor: 'bg-slate-800 hover:bg-slate-900'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 pb-24">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Support Our Mission</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your generous contributions help sustain this digital sanctuary and support our global prayer community.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {methods.map((method) => (
                        method.external ? (
                            <a
                                key={method.title}
                                href={method.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-start text-left"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${method.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                    <method.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                                <p className="text-gray-500 mb-6 flex-1 text-sm">{method.description}</p>
                                <div className={`w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 ${method.btnColor} transition-colors`}>
                                    Donate via PayPal <ArrowRight className="w-4 h-4" />
                                </div>
                            </a>
                        ) : (
                            <Link
                                key={method.title}
                                href={method.href}
                                className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-start text-left"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${method.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                    <method.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                                <p className="text-gray-500 mb-6 flex-1 text-sm">{method.description}</p>
                                <div className={`w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 ${method.btnColor} transition-colors`}>
                                    Contribute <ArrowRight className="w-4 h-4" />
                                </div>
                            </Link>
                        )
                    ))}
                </div>

                <div className="mt-12 text-center text-xs text-gray-400 max-w-lg mx-auto">
                    <p>MyPrayerTower is a service provider. Contributions are effectively purchases of spiritual services and may not be tax-deductible.</p>
                </div>
            </div>
        </div>
    );
}
