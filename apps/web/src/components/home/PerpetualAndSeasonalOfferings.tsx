'use client';

import { useState } from 'react';
import { Crown, Gift, Sparkles, Check, X, Lock, Flame } from 'lucide-react';
import dynamic from 'next/dynamic';
import { openOfferingModal } from '@/components/offerings/UniversalOfferingModal';

const PayPalCheckout = dynamic(
    () => import('@/components/PayPalCheckout').then(m => m.PayPalCheckout),
    { ssr: false }
);

const SEASONAL_BUNDLES = [
    {
        id: 'advent-grace',
        title: 'Advent Grace Bundle',
        season: 'Advent Season',
        price: 29.99,
        image: '/images/candles/marian_glow.png',
        description: '4 weekly sanctuary candles + 1 Holy Mass intention + Advent prayer guide.',
        badge: 'SEASONAL FAVORITE',
    },
    {
        id: 'christmas-nativity',
        title: 'Christmas Nativity Gift',
        season: 'Christmas',
        price: 39.99,
        image: '/images/candles/divine.png',
        description: '30-Day Cathedral candle + Novena + Holy Mass + Personalized Nativity Certificate.',
        badge: 'GIFT FOR FAMILY',
    },
    {
        id: 'all-souls',
        title: 'All Souls Remembrance',
        season: 'Eternal Rest',
        price: 49.99,
        image: '/images/art/pieta.jpg',
        description: '30-day memorial candle + 3 Holy Masses for the departed + Eternal Memorial listing.',
        badge: 'MEMORIAL TRIBUTE',
    },
];

export function PerpetualAndSeasonalOfferings() {
    const [activeBundle, setActiveBundle] = useState<typeof SEASONAL_BUNDLES[0] | null>(null);
    const [recipient, setRecipient] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [bundleStep, setBundleStep] = useState<'form' | 'pay' | 'done'>('form');

    return (
        <section className="py-16 bg-[#120E0A] border-t border-gold-500/15">
            <div className="container mx-auto px-4 max-w-6xl space-y-12">
                {/* Perpetual Vigil Lamp Banner */}
                <div className="rounded-3xl bg-gradient-to-br from-[#1F1711] via-[#18120D] to-[#261214] border-2 border-gold-500/40 p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="space-y-3 text-center lg:text-left max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-600/30 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-widest">
                            <Crown className="w-3.5 h-3.5" />
                            Perpetual Sanctuary Vigil
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF6EE]">
                            Keep a Sacred Flame Burning Night &amp; Day for Your Family
                        </h2>
                        <p className="text-sm text-[#CFC5B4] leading-relaxed">
                            Sponsor the 7-Day Tabernacle Lamp or enroll in a Perpetual Vigil — your family&apos;s name &amp; intention remain before the Altar with monthly consecration certificates.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-gold-200 pt-1">
                            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Family name displayed</span>
                            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Update intention anytime</span>
                            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Official Archival Certificate</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-64">
                        <button
                            type="button"
                            onClick={() => openOfferingModal('tabernacle')}
                            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] text-[#120E0A] font-extrabold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                        >
                            <Flame className="w-4 h-4 fill-current" />
                            <span>Sponsor Tabernacle Lamp</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => openOfferingModal('bouquet')}
                            className="w-full py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-[#FAF6EE] border border-gold-500/30 font-semibold text-xs text-center transition-all"
                        >
                            Build a Spiritual Bouquet →
                        </button>
                    </div>
                </div>

                {/* Catholic Seasonal Gift Packages */}
                <div>
                    <div className="text-center mb-8">
                        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">
                            ✠ Liturgical Gift Bundles ✠
                        </span>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF6EE] mt-2">
                            Catholic Seasonal Gift Packages
                        </h3>
                        <p className="font-serif italic text-[#CFC5B4] mt-1">
                            Send a meaningful spiritual gift of Masses, candles, and blessings to someone you love.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SEASONAL_BUNDLES.map((bundle) => (
                            <div
                                key={bundle.id}
                                className="rounded-2xl bg-[#18120D] border border-gold-500/25 hover:border-gold-400 overflow-hidden flex flex-col justify-between shadow-xl transition-all"
                            >
                                <div>
                                    <div className="relative h-56 overflow-hidden bg-[#0E0A07] p-3 flex items-center justify-center">
                                        <img
                                            src={bundle.image}
                                            alt={bundle.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-contain"
                                        />
                                        <span className="absolute top-3 left-3 inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#120E0A]/90 text-gold-300 border border-gold-500/35">
                                            {bundle.badge}
                                        </span>
                                    </div>
                                    <div className="p-6 pb-0">
                                        <h4 className="font-display text-xl font-bold text-[#FAF6EE]">{bundle.title}</h4>
                                        <div className="text-xs font-semibold text-gold-300 mt-1">
                                            {bundle.season} • Optional Offering Inside
                                        </div>
                                        <p className="text-xs text-[#CFC5B4] mt-3 leading-relaxed">{bundle.description}</p>
                                    </div>
                                </div>

                                <div className="p-6 pt-5">
                                    <button
                                        type="button"
                                        onClick={() => { setActiveBundle(bundle); setBundleStep('form'); }}
                                        className="w-full py-2.5 px-4 rounded-xl bg-gold-500/15 hover:bg-gold-500 text-gold-200 hover:text-[#120E0A] border border-gold-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Gift className="w-4 h-4" />
                                        <span>Send This Sacred Gift</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bundle Checkout Modal */}
            {activeBundle && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md rounded-3xl bg-[#18120D] border-2 border-gold-500/40 p-6 text-[#FAF6EE] shadow-2xl relative">
                        <button
                            type="button"
                            onClick={() => setActiveBundle(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {bundleStep === 'form' && (
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">{activeBundle.season}</span>
                                    <h3 className="font-display text-xl font-bold mt-1">{activeBundle.title}</h3>
                                    <p className="text-xs text-[#CFC5B4]">Offering: <strong className="text-gold-300">${activeBundle.price.toFixed(2)} USD</strong></p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gold-200 mb-1">Recipient / Family Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. For Mom & Dad"
                                        value={recipient}
                                        onChange={e => setRecipient(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#120E0A] border border-gold-500/30 text-sm text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gold-200 mb-1">Your Email for Certificate</label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={donorEmail}
                                        onChange={e => setDonorEmail(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#120E0A] border border-gold-500/30 text-sm text-white"
                                    />
                                </div>
                                <button
                                    type="button"
                                    disabled={!recipient.trim()}
                                    onClick={() => setBundleStep('pay')}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] text-[#120E0A] font-extrabold text-sm disabled:opacity-50"
                                >
                                    Proceed to Offering — ${activeBundle.price.toFixed(2)}
                                </button>
                            </div>
                        )}

                        {bundleStep === 'pay' && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Lock className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                                    <h4 className="font-display text-lg font-bold">Complete Gift Offering</h4>
                                    <p className="text-xs text-[#CFC5B4]">{activeBundle.title} for {recipient}</p>
                                </div>
                                <PayPalCheckout
                                    amount={Math.round(activeBundle.price * 100)}
                                    description={`MyPrayerTower Seasonal Gift: ${activeBundle.title} (${recipient})`}
                                    onSuccess={() => setBundleStep('done')}
                                    onError={() => alert('Payment could not be completed. Please try again.')}
                                    metadata={{ type: 'SEASONAL_BUNDLE', name: recipient, email: donorEmail }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setBundleStep('form')}
                                    className="w-full text-center text-xs text-[#CFC5B4] hover:text-white"
                                >
                                    ← Back
                                </button>
                            </div>
                        )}

                        {bundleStep === 'done' && (
                            <div className="text-center py-4 space-y-3">
                                <Sparkles className="w-10 h-10 text-gold-300 mx-auto" />
                                <h4 className="font-display text-xl font-bold">Sacred Gift Consecrated!</h4>
                                <p className="text-xs text-[#CFC5B4]">
                                    Your {activeBundle.title} for <strong>{recipient}</strong> has been offered at the sanctuary.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setActiveBundle(null)}
                                    className="px-6 py-2.5 rounded-full bg-gold-500 text-[#120E0A] font-bold text-xs"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
