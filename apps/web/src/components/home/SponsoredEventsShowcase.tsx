'use client';

import { useState, useEffect } from 'react';
import { Crown, Sparkles, Calendar, Users, Check, Lock, X, Heart } from 'lucide-react';
import dynamic from 'next/dynamic';

const PayPalCheckout = dynamic(
    () => import('@/components/PayPalCheckout').then(m => m.PayPalCheckout),
    { ssr: false }
);

interface SponsorPackage {
    id: string;
    title: string;
    frequency: string;
    price: number;
    badge: string;
    image: string;
    description: string;
    perks: string[];
}

const SPONSOR_PACKAGES: SponsorPackage[] = [
    {
        id: 'nightly-rosary',
        title: 'Nightly Rosary Stream',
        frequency: 'Daily · 8:00 PM',
        price: 25,
        badge: 'MOST POPULAR',
        image: '/images/sanctuary/card_rosary.jpg',
        description: 'Your family name displayed all evening during our global Rosary stream.',
        perks: ['Name displayed live during Rosary', 'Dedicated family intention read', 'Permanent event archive listing'],
    },
    {
        id: 'feast-day',
        title: 'Saint Feast Celebration',
        frequency: 'Per Feast Day',
        price: 50,
        badge: 'HONOR A SAINT',
        image: '/images/art/the-annunciation.jpg',
        description: '"In honor of today\'s Saint — Sponsored with love by [Your Family]."',
        perks: ['Featured on Saint of the Day page', 'Archival Consecration Certificate', 'Included in Feast Day prayers'],
    },
    {
        id: 'first-friday',
        title: 'First Friday Adoration',
        frequency: 'Monthly',
        price: 100,
        badge: 'SACRED HEART',
        image: '/images/mass-hero.jpg',
        description: 'Sponsor an entire First Friday Eucharistic Adoration & Vigil hour.',
        perks: ['Premium sanctuary banner placement', '7-day Tabernacle Lamp included', 'Intention lifted all month'],
    },
    {
        id: 'novena-night',
        title: '9-Day Novena Series',
        frequency: '9 Consecutive Nights',
        price: 199,
        badge: 'PATRON HONOR',
        image: '/images/sanctuary/cathedral_rose_bg.jpg',
        description: 'Be the sole patron of a full 9-day Novena prayed by thousands.',
        perks: ['Exclusive sponsor all 9 nights', 'Custom memorial dedication', 'Archival certificate + Mass intention'],
    },
];

interface RecentSponsorEntry {
    id: string;
    family: string;
    city?: string;
    country?: string;
    dedication: string;
    packageTitle: string;
    amount: number;
    createdAt: string;
}

function formatSponsorDisplay(family: string, city?: string, country?: string) {
    const loc = [city, country].map(s => (s || '').trim()).filter(Boolean).join(', ');
    return loc ? `${family} (${loc})` : family;
}

export function SponsoredEventsShowcase() {
    const [selectedPkg, setSelectedPkg] = useState<SponsorPackage | null>(null);
    const [sponsorName, setSponsorName] = useState('');
    const [sponsorCity, setSponsorCity] = useState('');
    const [sponsorCountry, setSponsorCountry] = useState('');
    const [dedication, setDedication] = useState('');
    const [email, setEmail] = useState('');
    const [isFreeRoll, setIsFreeRoll] = useState(false);
    const [step, setStep] = useState<'form' | 'pay' | 'done'>('form');

    // Live sponsored banner & recent sponsors roster (newest on top)
    const [tonightSponsor, setTonightSponsor] = useState({
        family: 'The Rodriguez Family',
        city: 'Madrid',
        country: 'Spain',
        dedication: 'In loving memory of Grandma Rosa',
        faithfulCount: 2847,
    });
    const [recentSponsors, setRecentSponsors] = useState<RecentSponsorEntry[]>([]);

    useEffect(() => {
        fetch('/api/events/sponsored')
            .then(r => r.json())
            .then(data => {
                if (data?.config?.tonightSponsor) {
                    setTonightSponsor(data.config.tonightSponsor);
                }
                if (Array.isArray(data?.config?.recentSponsors)) {
                    setRecentSponsors(data.config.recentSponsors);
                }
            })
            .catch(() => {});
    }, []);

    const openSponsorModal = (pkg: SponsorPackage, freeRoll = false) => {
        setSelectedPkg(pkg);
        setIsFreeRoll(freeRoll);
        setStep('form');
    };

    const handlePaySuccess = async () => {
        if (sponsorName.trim()) {
            const nextFamily = sponsorName.trim();
            const nextCity = sponsorCity.trim();
            const nextCountry = sponsorCountry.trim();
            const nextDedication = dedication.trim() || 'In thanksgiving & protection of our family';
            const effectiveAmount = isFreeRoll ? 0 : (selectedPkg?.price || 25);
            const effectiveTitle = isFreeRoll ? 'Rosary Prayer Roll (Free)' : (selectedPkg?.title || 'Nightly Rosary Stream');
            const nextEntry: RecentSponsorEntry = {
                id: `sp_${Date.now()}`,
                family: nextFamily,
                city: nextCity,
                country: nextCountry,
                dedication: nextDedication,
                packageTitle: effectiveTitle,
                amount: effectiveAmount,
                createdAt: new Date().toISOString(),
            };
            setTonightSponsor(prev => isFreeRoll
                ? { ...prev, faithfulCount: prev.faithfulCount + 1 }
                : {
                    family: nextFamily,
                    city: nextCity,
                    country: nextCountry,
                    dedication: nextDedication,
                    faithfulCount: prev.faithfulCount + 1,
                }
            );
            // Prepend newest sponsor/prayer roll on top, pushing older entries down
            setRecentSponsors(prev => [nextEntry, ...prev].slice(0, 50));
            try {
                await fetch('/api/events/sponsored', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        family: nextFamily,
                        city: nextCity,
                        country: nextCountry,
                        dedication: nextDedication,
                        packageTitle: effectiveTitle,
                        amount: effectiveAmount,
                        isFreeRoll,
                    }),
                });
            } catch {
                // non-blocking
            }
        }
        setStep('done');
    };

    return (
        <section className="py-16 bg-[#18120D] border-y border-gold-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(122,30,36,0.22)_0%,transparent_55%)] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                {/* Tonight's Featured Sponsored Event Banner */}
                <div className="rounded-3xl bg-gradient-to-r from-[#1F1711] via-[#261A14] to-[#1F1711] border-2 border-gold-500/40 p-6 sm:p-8 mb-12 shadow-[0_20px_60px_rgba(0,0,0,0.65)] text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-crimson-600/30 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-widest mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Tonight&apos;s Sponsored Rosary Marathon
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF6EE]">
                        Sponsored with love by{' '}
                        <span className="text-gold-300">
                            ✨ {formatSponsorDisplay(tonightSponsor.family, tonightSponsor.city, tonightSponsor.country)} ✨
                        </span>
                    </h3>
                    <p className="font-serif italic text-lg text-[#CFC5B4] mt-1.5">
                        &ldquo;{tonightSponsor.dedication}&rdquo;
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-[#CFC5B4]">
                        <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-gold-400" />
                            {tonightSponsor.faithfulCount.toLocaleString()} faithful praying tonight
                        </span>
                        <span className="text-gold-500/40">•</span>
                        <span>Only 3 sponsorship slots remain this week</span>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => openSponsorModal(SPONSOR_PACKAGES[0], true)}
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] text-[#120E0A] font-extrabold text-sm shadow-lg hover:brightness-110 transition-all"
                        >
                            <Heart className="w-4 h-4 fill-current" />
                            <span>Join Tonight&apos;s Rosary Roll — Free</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => openSponsorModal(SPONSOR_PACKAGES[0], false)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-[#FAF6EE] border border-gold-400/40 font-bold text-sm transition-all"
                        >
                            <Crown className="w-4 h-4 text-gold-300" />
                            <span>Sponsor a Night of Prayer</span>
                        </button>
                    </div>

                    {/* Recent Event Sponsors Roster (Newest on Top) */}
                    {recentSponsors.length > 0 && (
                        <div className="mt-7 pt-5 border-t border-gold-500/20 text-left max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gold-300">
                                    Recent Sanctuary Sponsors &amp; Offerings
                                </span>
                                <span className="text-[11px] text-[#CFC5B4]/75">
                                    Newest on top
                                </span>
                            </div>
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {recentSponsors.map((sp, idx) => (
                                    <div
                                        key={sp.id || idx}
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-3.5 py-2.5 rounded-xl border ${
                                            idx === 0
                                                ? 'bg-gold-500/10 border-gold-400/40'
                                                : 'bg-[#120E0A]/70 border-gold-500/15'
                                        }`}
                                    >
                                        <div>
                                            <span className="text-xs font-bold text-[#FAF6EE]">
                                                {formatSponsorDisplay(sp.family, sp.city, sp.country)}
                                            </span>
                                            <p className="text-[11px] italic text-[#CFC5B4] line-clamp-1">
                                                &ldquo;{sp.dedication}&rdquo;
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/25 self-start sm:self-center shrink-0">
                                            {sp.packageTitle}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sponsorship Tiers */}
                <div className="text-center mb-8">
                    <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">
                        ✠ Sacred Patronage ✠
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FAF6EE] mt-2">
                        Sponsor an Online Prayer Event
                    </h2>
                    <p className="font-serif italic text-[#CFC5B4] mt-2 max-w-2xl mx-auto">
                        Honor a loved one or dedicate a night of global prayer. Your family&apos;s name is displayed with reverence throughout the event and preserved in our archive.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {SPONSOR_PACKAGES.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="rounded-2xl bg-[#120E0A]/90 border border-gold-500/25 hover:border-gold-400 overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl"
                        >
                            <div>
                                <div className="relative h-44 overflow-hidden bg-[#0E0A07] p-2 flex items-center justify-center">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-contain"
                                    />
                                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#120E0A]/90 text-gold-300 border border-gold-500/40">
                                        {pkg.badge}
                                    </span>
                                </div>
                                <div className="p-5 pb-0">
                                    <span className="text-[11px] text-[#CFC5B4]/75 flex items-center gap-1 mb-1">
                                        <Calendar className="w-3 h-3 text-gold-400" />
                                        {pkg.frequency}
                                    </span>
                                    <h3 className="font-display text-lg font-bold text-[#FAF6EE]">{pkg.title}</h3>
                                    <div className="text-xs font-semibold text-gold-300 mt-1">
                                        Free Prayer Roll • Optional Stipend
                                    </div>
                                    <p className="text-xs text-[#CFC5B4] mt-2.5 leading-relaxed">{pkg.description}</p>
                                    <ul className="mt-4 space-y-1.5">
                                        {pkg.perks.map((perk, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-[11.5px] text-[#CFC5B4]/90">
                                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{perk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="p-5 pt-4">
                                <button
                                    type="button"
                                    onClick={() => openSponsorModal(pkg, false)}
                                    className="w-full py-2.5 px-4 rounded-xl bg-gold-500/15 hover:bg-gold-500 text-gold-200 hover:text-[#120E0A] border border-gold-500/40 font-bold text-xs transition-all"
                                >
                                    Dedicate This Event
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sponsor Checkout Modal */}
            {selectedPkg && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md rounded-3xl bg-[#18120D] border-2 border-gold-500/40 p-6 text-[#FAF6EE] shadow-2xl relative">
                        <button
                            type="button"
                            onClick={() => setSelectedPkg(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {step === 'form' && (
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">
                                        {isFreeRoll ? 'Global Rosary Prayer Roll' : 'Sacred Event Sponsorship'}
                                    </span>
                                    <h3 className="font-display text-xl font-bold text-[#FAF6EE] mt-1">
                                        {isFreeRoll ? "Tonight's Rosary Prayer Roll" : selectedPkg.title}
                                    </h3>
                                    <p className="text-xs text-[#CFC5B4]">
                                        {isFreeRoll
                                            ? 'Free inclusion in tonight’s global Rosary intentions.'
                                            : <>Suggested offering: <strong className="text-gold-300">${selectedPkg.price} USD</strong> (supports sanctuary hosting &amp; free daily prayers)</>}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#120E0A] border border-gold-500/20 text-xs font-bold">
                                    <button
                                        type="button"
                                        onClick={() => setIsFreeRoll(true)}
                                        className={`py-2 rounded-lg transition-all ${isFreeRoll ? 'bg-gold-500 text-[#120E0A]' : 'text-[#CFC5B4] hover:text-white'}`}
                                    >
                                        Prayer Roll (Free)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsFreeRoll(false)}
                                        className={`py-2 rounded-lg transition-all ${!isFreeRoll ? 'bg-gold-500 text-[#120E0A]' : 'text-[#CFC5B4] hover:text-white'}`}
                                    >
                                        Featured Sponsor (${selectedPkg.price})
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gold-200 mb-1">Sponsor / Family Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. The Garcia Family"
                                        value={sponsorName}
                                        onChange={e => setSponsorName(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#120E0A] border border-gold-500/30 text-sm text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gold-200 mb-1">
                                            City <span className="text-white/40 font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Manila"
                                            value={sponsorCity}
                                            onChange={e => setSponsorCity(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#120E0A] border border-gold-500/30 text-sm text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gold-200 mb-1">Country</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Philippines"
                                            value={sponsorCountry}
                                            onChange={e => setSponsorCountry(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#120E0A] border border-gold-500/30 text-sm text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gold-200 mb-1">Dedication / In Memory Of</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. In loving memory of Maria Garcia"
                                        value={dedication}
                                        onChange={e => setDedication(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#120E0A] border border-gold-500/30 text-sm text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gold-200 mb-1">Email for Confirmation Certificate</label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#120E0A] border border-gold-500/30 text-sm text-white"
                                    />
                                </div>

                                <button
                                    type="button"
                                    disabled={!sponsorName.trim()}
                                    onClick={() => isFreeRoll ? handlePaySuccess() : setStep('pay')}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] text-[#120E0A] font-extrabold text-sm disabled:opacity-50"
                                >
                                    {isFreeRoll ? "Join Tonight's Rosary Roll — Free" : `Continue with Suggested Offering — $${selectedPkg.price}`}
                                </button>
                            </div>
                        )}

                        {step === 'pay' && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Lock className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                                    <h4 className="font-display text-lg font-bold">Complete Event Sponsorship</h4>
                                    <p className="text-xs text-[#CFC5B4]">
                                        &ldquo;Sponsored by {sponsorName}&rdquo; — <strong className="text-gold-300">${selectedPkg.price}.00 USD</strong>
                                    </p>
                                </div>
                                <PayPalCheckout
                                    amount={selectedPkg.price * 100}
                                    description={`MyPrayerTower Event Sponsorship: ${selectedPkg.title} (${sponsorName})`}
                                    onSuccess={handlePaySuccess}
                                    onError={() => alert('Payment could not be completed. Please try again.')}
                                    metadata={{ type: 'SPONSORED_EVENT', name: sponsorName, email }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setStep('form')}
                                    className="w-full text-center text-xs text-[#CFC5B4] hover:text-white"
                                >
                                    ← Edit Dedication
                                </button>
                            </div>
                        )}

                        {step === 'done' && (
                            <div className="text-center py-4 space-y-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
                                    <Heart className="w-6 h-6 fill-current" />
                                </div>
                                <h4 className="font-display text-xl font-bold text-[#FAF6EE]">Thank You, {sponsorName}!</h4>
                                <p className="text-xs text-[#CFC5B4] leading-relaxed">
                                    Your sponsorship for <strong>{selectedPkg.title}</strong> is confirmed. May God bless your family abundantly.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPkg(null)}
                                    className="px-6 py-2.5 rounded-full bg-gold-500 text-[#120E0A] font-bold text-xs"
                                >
                                    Return in Peace
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
