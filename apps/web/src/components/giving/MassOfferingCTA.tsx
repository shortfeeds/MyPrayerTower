'use client';

import Link from 'next/link';
import { Heart, Church, Gift, Sparkles, ArrowRight } from 'lucide-react';

interface MassOfferingCTAProps {
    variant?: 'inline' | 'sidebar' | 'banner' | 'subtle';
    context?: 'prayer' | 'saint' | 'rosary' | 'reading' | 'confession' | 'general';
    intentionFor?: string;
    className?: string;
}

const contextMessages = {
    prayer: {
        title: 'Amplify Your Prayer',
        description: 'Have a Mass offered for this intention. A powerful way to unite your prayers with the Holy Sacrifice.',
        cta: 'Request a Mass',
    },
    saint: {
        title: 'Honor This Saint',
        description: 'Request a Mass in honor of this saint or in memory of a loved one.',
        cta: 'Memorial Mass',
    },
    rosary: {
        title: 'Offer Your Devotion',
        description: 'Complete your spiritual offering with a Mass intention for your prayers.',
        cta: 'Mass Offering',
    },
    reading: {
        title: 'Let the Word Inspire',
        description: "Jesus said, 'It is more blessed to give than to receive.' Support our mission.",
        cta: 'Give Today',
    },
    confession: {
        title: 'Begin Your Renewal',
        description: 'Start fresh with a Mass intention for healing, forgiveness, or thanksgiving.',
        cta: 'Mass Intention',
    },
    general: {
        title: 'Request a Mass',
        description: 'Have a Mass celebrated for your intentions by priests around the world.',
        cta: 'Learn More',
    },
};

export function MassOfferingCTA({
    variant = 'inline',
    context = 'general',
    intentionFor,
    className = '',
}: MassOfferingCTAProps) {
    const message = contextMessages[context];
    const href = intentionFor
        ? `/mass-offerings?intention=${encodeURIComponent(intentionFor)}`
        : '/mass-offerings';

    if (variant === 'subtle') {
        return (
            <Link
                href={href}
                className={`group flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors ${className}`}
            >
                <Church className="w-4 h-4" />
                <span>Request a Mass for this intention</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
        );
    }

    if (variant === 'sidebar') {
        return (
            <div className={`bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 ${className}`}>
                <div className="flex items-center gap-2 text-amber-600 mb-3">
                    <Church className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wide">Mass Offering</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{message.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{message.description}</p>
                <Link
                    href={href}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                >
                    <Heart className="w-4 h-4" />
                    {message.cta}
                </Link>
            </div>
        );
    }

    if (variant === 'banner') {
        return (
            <div className={`relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 rounded-2xl p-6 md:p-8 text-white ${className}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1">{message.title}</h3>
                            <p className="text-white/80 text-sm md:text-base">{message.description}</p>
                        </div>
                    </div>
                    <Link
                        href={href}
                        className="flex-shrink-0 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
                    >
                        {message.cta}
                    </Link>
                </div>
            </div>
        );
    }

    // Default: inline variant
    return (
        <div className={`bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-100 rounded-2xl p-6 ${className}`}>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Church className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{message.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{message.description}</p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={href}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
                        >
                            <Heart className="w-4 h-4" />
                            {message.cta}
                        </Link>
                        <Link
                            href="/donate"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <Gift className="w-4 h-4" />
                            Donate
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Compact donation prompt for sidebars
export function DonationPrompt({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4 ${className}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Support Our Mission</h4>
                    <p className="text-xs text-gray-500">Help us reach more souls</p>
                </div>
            </div>
            <Link
                href="/donate"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
            >
                Donate Now
                <ArrowRight className="w-3 h-3" />
            </Link>
        </div>
    );
}

// Floating action button for mobile
export function DonationFAB() {
    return (
        <Link
            href="/mass-offerings"
            className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform md:hidden"
        >
            <Church className="w-6 h-6" />
        </Link>
    );
}
