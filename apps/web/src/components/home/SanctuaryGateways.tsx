'use client';

import Link from 'next/link';
import { Flame, CircleDot, BookOpen, Church, ArrowRight } from 'lucide-react';
import { openOfferingModal } from '@/components/offerings/UniversalOfferingModal';

const GATEWAYS = [
    {
        id: 'candles',
        title: 'Virtual Candle Altar',
        subtitle: 'From Free • 24h to 30-Day Vigils',
        description: 'Place a glowing vigil flame before the sanctuary altar for your loved ones.',
        image: '/images/sanctuary/card_candles.jpg',
        href: '/candles',
        cta: 'Light a Candle',
        icon: Flame,
        accent: 'border-gold-500/40 hover:border-gold-400',
        badge: 'MOST LOVED',
        action: 'candle' as const,
    },
    {
        id: 'rosary',
        title: 'Holy Rosary & Novenas',
        subtitle: 'Guided Mysteries & 9-Day Tracker',
        description: 'Pray the Joyful, Sorrowful, Glorious & Luminous mysteries with audio & bead tracking.',
        image: '/images/sanctuary/card_rosary.jpg',
        href: '/rosary',
        cta: 'Pray the Rosary',
        icon: CircleDot,
        accent: 'border-marian-600/60 hover:border-gold-400',
        badge: 'DAILY HABIT',
        action: null,
    },
    {
        id: 'readings',
        title: 'Daily Mass & Word',
        subtitle: 'Gospel, Psalms & Saint of the Day',
        description: 'Reflect on today’s Catholic liturgical readings, Divine Office, and patron saints.',
        image: '/images/sanctuary/card_bible.jpg',
        href: '/readings',
        cta: 'Read Today’s Word',
        icon: BookOpen,
        accent: 'border-gold-500/35 hover:border-gold-400',
        badge: 'UPDATED DAILY',
        action: null,
    },
    {
        id: 'mass',
        title: 'Holy Mass & Bouquets',
        subtitle: 'Single Mass $10 • Novena $85',
        description: 'Entrust your intentions to ordained Catholic priests celebrating the Holy Sacrifice.',
        image: '/images/sanctuary/card_mass.jpg',
        href: '/mass-offerings',
        cta: 'Offer a Mass',
        icon: Church,
        accent: 'border-crimson-500/50 hover:border-gold-400',
        badge: 'SACRED STIPEND',
        action: 'mass' as const,
    },
];

export function SanctuaryGateways() {
    return (
        <section className="py-16 bg-[#120E0A] border-t border-gold-500/15">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-10">
                    <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">
                        ✠ Sacred Gateways ✠
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FAF6EE] mt-2">
                        Begin Your Devotion
                    </h2>
                    <p className="font-serif italic text-[#CFC5B4] mt-2 max-w-xl mx-auto">
                        Choose a doorway into prayer, remembrance, or sacred offering.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {GATEWAYS.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.id}
                                className={`group relative rounded-t-[110px] rounded-b-2xl bg-[#18120D] border ${card.accent} overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col`}
                            >
                                {/* Gothic Arch Image Header */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#18120D] via-[#18120D]/30 to-transparent" />
                                    <span className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#120E0A]/85 border border-gold-500/40 text-[10px] font-bold tracking-widest text-gold-300 whitespace-nowrap">
                                        {card.badge}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between text-center">
                                    <div>
                                        <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto -mt-10 mb-3 relative z-10 text-gold-300">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-display text-lg font-bold text-[#FAF6EE]">{card.title}</h3>
                                        <p className="text-[11px] text-gold-300/90 font-semibold mt-0.5">{card.subtitle}</p>
                                        <p className="text-xs text-[#CFC5B4] mt-2.5 leading-relaxed">{card.description}</p>
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-gold-500/15 flex items-center justify-center gap-2">
                                        {card.action ? (
                                            <button
                                                type="button"
                                                onClick={() => openOfferingModal(card.action!)}
                                                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8942C] text-[#120E0A] font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
                                            >
                                                <span>{card.cta}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        ) : (
                                            <Link
                                                href={card.href}
                                                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-gold-500/20 text-[#FAF6EE] border border-gold-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                                            >
                                                <span>{card.cta}</span>
                                                <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
