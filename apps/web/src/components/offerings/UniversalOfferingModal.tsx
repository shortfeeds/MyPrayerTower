'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Flame,
    Heart,
    Church,
    Crown,
    Sparkles,
    Shield,
    Check,
    Lock,
    Download,
    Share2,
    Calendar,
    ArrowRight
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { CertificateModal } from '@/components/certificates/CertificateModal';

const PayPalCheckout = dynamic(
    () => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout),
    { ssr: false }
);

export type OfferingTab = 'candle' | 'mass' | 'bouquet' | 'tabernacle' | 'blessing';

export interface UniversalOfferingModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    defaultTab?: OfferingTab;
    initialIntention?: string;
    initialRecipient?: string;
}

export function openOfferingModal(
    tab: OfferingTab = 'candle',
    options?: { intention?: string; recipient?: string }
) {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('open-offering-modal', {
                detail: {
                    tab,
                    intention: options?.intention,
                    recipient: options?.recipient,
                },
            })
        );
    }
}

export function UniversalOfferingModal({
    isOpen: controlledIsOpen,
    onClose: controlledOnClose,
    defaultTab = 'candle',
    initialIntention = '',
    initialRecipient = '',
}: UniversalOfferingModalProps) {
    const [mounted, setMounted] = useState(false);
    const [internalOpen, setInternalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<OfferingTab>(defaultTab);

    // Form inputs
    const [recipientName, setRecipientName] = useState(initialRecipient);
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [intention, setIntention] = useState(initialIntention);

    // Specific offering configurations
    const [candleDuration, setCandleDuration] = useState<'FREE' | '3_DAYS' | '7_DAYS' | '14_DAYS' | '30_DAYS'>('7_DAYS');
    const [massType, setMassType] = useState<'SINGLE' | 'NOVENA_SERIES'>('SINGLE');
    const [bouquetItems, setBouquetItems] = useState({
        masses: 1,
        rosaries: 2,
        candles: 1,
        prayers: 5
    });

    // Step state: 1 = Form & options, 2 = PayPal payment, 3 = Completed with certificate
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isCertOpen, setIsCertOpen] = useState(false);

    const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

    useEffect(() => {
        setMounted(true);

        const handleOpenEvent = (e: any) => {
            if (e.detail?.tab) setActiveTab(e.detail.tab);
            if (e.detail?.intention) setIntention(e.detail.intention);
            if (e.detail?.recipient) setRecipientName(e.detail.recipient);
            setStep(1);
            setInternalOpen(true);
        };

        const handleGlobalClicks = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('[data-open-offering]');
            if (target) {
                e.preventDefault();
                const tab = target.getAttribute('data-open-offering') as OfferingTab || 'candle';
                const intent = target.getAttribute('data-intention') || '';
                const recip = target.getAttribute('data-recipient') || '';
                openOfferingModal(tab, { intention: intent, recipient: recip });
            }
        };

        window.addEventListener('open-offering-modal', handleOpenEvent);
        document.addEventListener('click', handleGlobalClicks);

        return () => {
            window.removeEventListener('open-offering-modal', handleOpenEvent);
            document.removeEventListener('click', handleGlobalClicks);
        };
    }, []);

    const handleClose = () => {
        if (controlledOnClose) {
            controlledOnClose();
        } else {
            setInternalOpen(false);
        }
        setStep(1);
    };

    // Calculate dynamic price
    const calculatePrice = (): number => {
        switch (activeTab) {
            case 'candle':
                switch (candleDuration) {
                    case 'FREE': return 0;
                    case '3_DAYS': return 2.99;
                    case '7_DAYS': return 5.99;
                    case '14_DAYS': return 9.99;
                    case '30_DAYS': return 14.99;
                    default: return 5.99;
                }
            case 'mass':
                return massType === 'SINGLE' ? 10.00 : 85.00;
            case 'bouquet':
                return (bouquetItems.masses * 10) + (bouquetItems.rosaries * 5) + (bouquetItems.candles * 5);
            case 'tabernacle':
                return 25.00;
            case 'blessing':
                return 0; // Sacramental blessing is free
            default:
                return 5.99;
        }
    };

    const price = calculatePrice();

    const handleProceedToPayment = () => {
        if (price === 0) {
            // Free offering (1-day candle or blessing), completes instantly!
            handleSuccess();
        } else {
            setStep(2);
        }
    };

    const handleSuccess = (details?: any) => {
        // Save to local storage for instant vigil updates
        try {
            if (activeTab === 'candle') {
                const existing = JSON.parse(localStorage.getItem('mpt_user_candles') || '[]');
                const hours = candleDuration === 'FREE' ? 24 : candleDuration === '3_DAYS' ? 72 : candleDuration === '7_DAYS' ? 168 : candleDuration === '14_DAYS' ? 336 : 720;
                const newCandle = {
                    id: `candle_${Date.now()}`,
                    intention: intention || 'Special Sanctuary Intention',
                    name: donorName || recipientName || 'Faithful Soul',
                    duration: candleDuration,
                    durationDays: Math.round(hours / 24),
                    litAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + hours * 3600 * 1000).toISOString(),
                    isActive: true,
                    amount: price,
                };
                localStorage.setItem('mpt_user_candles', JSON.stringify([newCandle, ...existing]));
            } else if (activeTab === 'tabernacle') {
                const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
                localStorage.setItem('mpt_tabernacle_lamp', JSON.stringify({
                    id: `tabernacle_${Date.now()}`,
                    sponsorFamily: donorName || recipientName || 'The Faithful Family',
                    intention: intention || 'In Thanksgiving & Divine Protection',
                    litAt: new Date().toISOString(),
                    expiresAt: expires,
                    prayerCount: 1,
                }));
                window.dispatchEvent(new Event('mpt-tabernacle-updated'));
            }
        } catch {
            // private browsing fallback
        }

        setStep(3);
        setIsCertOpen(true);
    };

    if (!mounted || !isModalOpen) return null;

    return (
        <>
            {typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
                    <div className="relative w-full max-w-xl bg-[#0c0618] border-2 border-amber-400/50 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto p-5 sm:p-7 text-white">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-amber-400/20">
                            <div className="flex items-center gap-2.5">
                                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center text-black font-black text-lg shadow-md">
                                    ☩
                                </span>
                                <div>
                                    <h3 className="font-serif font-black text-base sm:text-xl text-amber-100 flex items-center gap-2">
                                        Sacred Offering &amp; Vigils
                                        <span className="text-[10px] uppercase font-sans font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                            Live Sanctuary
                                        </span>
                                    </h3>
                                    <p className="text-[11px] text-amber-200/60 font-sans">
                                        Consecrated at the Altar of Perpetual Adoration • Complete on this page
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                                aria-label="Close offering modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation Offering Tabs */}
                        {step === 1 && (
                            <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/5 border border-amber-400/20 rounded-2xl mb-5 text-xs font-bold">
                                <button
                                    onClick={() => setActiveTab('candle')}
                                    className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                                        activeTab === 'candle'
                                            ? 'bg-amber-500 text-black shadow-md font-extrabold'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    <Flame className="w-3.5 h-3.5 fill-current" />
                                    <span>Candle</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('mass')}
                                    className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                                        activeTab === 'mass'
                                            ? 'bg-purple-600 text-white shadow-md font-extrabold'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    <Church className="w-3.5 h-3.5" />
                                    <span>Holy Mass</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('bouquet')}
                                    className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                                        activeTab === 'bouquet'
                                            ? 'bg-rose-600 text-white shadow-md font-extrabold'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    <Heart className="w-3.5 h-3.5 fill-current" />
                                    <span>Bouquet</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('tabernacle')}
                                    className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                                        activeTab === 'tabernacle'
                                            ? 'bg-red-700 text-white shadow-md font-extrabold'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    <Crown className="w-3.5 h-3.5" />
                                    <span>Tabernacle</span>
                                </button>
                            </div>
                        )}

                        {/* STEP 1: Offering Details & Selection */}
                        {step === 1 && (
                            <div className="space-y-4">
                                {/* TAB 1: VIRTUAL CANDLE */}
                                {activeTab === 'candle' && (
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                                            Select Candle Tier &amp; Duration
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {[
                                                { id: 'FREE', label: '1-Day Humble', price: 'Free', hours: '24h' },
                                                { id: '3_DAYS', label: '3-Day Devotion', price: '$2.99', hours: '72h' },
                                                { id: '7_DAYS', label: '7-Day Altar', price: '$5.99', popular: true, hours: '168h' },
                                                { id: '14_DAYS', label: '14-Day Marian', price: '$9.99', hours: '336h' },
                                                { id: '30_DAYS', label: '30-Day Cathedral', price: '$14.99', hours: '720h' },
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setCandleDuration(opt.id as any)}
                                                    className={`p-2.5 rounded-2xl border text-left transition-all relative ${
                                                        candleDuration === opt.id
                                                            ? 'border-amber-400 bg-amber-500/20 shadow-md'
                                                            : 'border-white/10 bg-white/5 hover:border-amber-400/40'
                                                    }`}
                                                >
                                                    {opt.popular && (
                                                        <span className="absolute top-1.5 right-1.5 text-[8px] bg-amber-400 text-black px-1.5 py-0.2 rounded-full font-bold">
                                                            POPULAR
                                                        </span>
                                                    )}
                                                    <span className="block text-xs font-semibold text-white">{opt.label}</span>
                                                    <span className="block text-sm font-black text-amber-300 font-mono mt-0.5">{opt.price}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: HOLY MASS OFFERING */}
                                {activeTab === 'mass' && (
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">
                                            Mass Offering Selection
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setMassType('SINGLE')}
                                                className={`p-3 rounded-2xl border text-left transition-all ${
                                                    massType === 'SINGLE'
                                                        ? 'border-purple-400 bg-purple-900/40 shadow-md'
                                                        : 'border-white/10 bg-white/5'
                                                }`}
                                            >
                                                <span className="block text-xs font-bold text-white">Single Holy Mass</span>
                                                <span className="text-[10px] text-purple-200/70 block mt-0.5">Celebrated by ordained priest</span>
                                                <span className="text-sm font-black text-purple-300 font-mono mt-1 block">$10.00 USD</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMassType('NOVENA_SERIES')}
                                                className={`p-3 rounded-2xl border text-left transition-all ${
                                                    massType === 'NOVENA_SERIES'
                                                        ? 'border-purple-400 bg-purple-900/40 shadow-md'
                                                        : 'border-white/10 bg-white/5'
                                                }`}
                                            >
                                                <span className="block text-xs font-bold text-white">9-Day Novena Series</span>
                                                <span className="text-[10px] text-purple-200/70 block mt-0.5">9 consecutive holy masses</span>
                                                <span className="text-sm font-black text-purple-300 font-mono mt-1 block">$85.00 USD</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: SPIRITUAL BOUQUET */}
                                {activeTab === 'bouquet' && (
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-rose-300">
                                            Custom Spiritual Bouquet
                                        </label>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                                                <span className="block font-semibold">✝ Masses ($10)</span>
                                                <div className="flex items-center justify-center gap-2 mt-1.5 font-mono">
                                                    <button type="button" onClick={() => setBouquetItems(b => ({ ...b, masses: Math.max(0, b.masses - 1) }))} className="w-6 h-6 rounded bg-white/10">-</button>
                                                    <span className="font-bold">{bouquetItems.masses}</span>
                                                    <button type="button" onClick={() => setBouquetItems(b => ({ ...b, masses: b.masses + 1 }))} className="w-6 h-6 rounded bg-white/10">+</button>
                                                </div>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                                                <span className="block font-semibold">📿 Rosaries ($5)</span>
                                                <div className="flex items-center justify-center gap-2 mt-1.5 font-mono">
                                                    <button type="button" onClick={() => setBouquetItems(b => ({ ...b, rosaries: Math.max(0, b.rosaries - 1) }))} className="w-6 h-6 rounded bg-white/10">-</button>
                                                    <span className="font-bold">{bouquetItems.rosaries}</span>
                                                    <button type="button" onClick={() => setBouquetItems(b => ({ ...b, rosaries: b.rosaries + 1 }))} className="w-6 h-6 rounded bg-white/10">+</button>
                                                </div>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                                                <span className="block font-semibold">🕯️ Candles ($5)</span>
                                                <div className="flex items-center justify-center gap-2 mt-1.5 font-mono">
                                                    <button type="button" onClick={() => setBouquetItems(b => ({ ...b, candles: Math.max(0, b.candles - 1) }))} className="w-6 h-6 rounded bg-white/10">-</button>
                                                    <span className="font-bold">{bouquetItems.candles}</span>
                                                    <button type="button" onClick={() => setBouquetItems(b => ({ ...b, candles: b.candles + 1 }))} className="w-6 h-6 rounded bg-white/10">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 4: TABERNACLE LAMP */}
                                {activeTab === 'tabernacle' && (
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/60 to-amber-950/60 border border-amber-400/40 text-center space-y-1.5">
                                        <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                                            <Crown className="w-4 h-4" />
                                            <span>The Sanctuary Tabernacle Lamp ($25.00)</span>
                                        </div>
                                        <p className="text-[11.5px] text-red-100/80 leading-relaxed">
                                            7-Day exclusive vigil burning night and day before the Tabernacle containing the Blessed Sacrament for your family intentions.
                                        </p>
                                    </div>
                                )}

                                {/* COMMON INPUTS: INTENTION, RECIPIENT & DONOR */}
                                <div className="space-y-3 pt-2">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                                            Prayer Intention
                                        </label>
                                        <textarea
                                            rows={2}
                                            placeholder="Write your intention, petition, thanksgiving, or remembrance..."
                                            value={intention}
                                            onChange={e => setIntention(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                                                Recipient / Consecrated For
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. My Family / Soul of Joseph"
                                                value={recipientName}
                                                onChange={e => setRecipientName(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                                                Your Name (Donor)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={donorName}
                                                onChange={e => setDonorName(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Price Total & Action Button */}
                                <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-white/50 block">Stipend / Offering</span>
                                        <span className="text-xl font-mono font-black text-amber-300">
                                            {price === 0 ? 'Free Offering' : `$${price.toFixed(2)} USD`}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleProceedToPayment}
                                        className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        <span>{price === 0 ? 'Complete Offering' : 'Proceed to Offering'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: IN-PAGE PAYPAL PAYMENT */}
                        {step === 2 && (
                            <div className="py-4 space-y-4">
                                <div className="text-center space-y-1 pb-3 border-b border-white/10">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-amber-300 mb-2">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-serif font-bold text-lg text-white">
                                        Complete Sacred Offering
                                    </h4>
                                    <p className="text-xs text-white/60">
                                        Total: <strong className="text-amber-300 font-mono text-base">${price.toFixed(2)} USD</strong> for &ldquo;{recipientName || 'Your Intention'}&rdquo;
                                    </p>
                                </div>

                                <div className="min-h-[150px] relative z-0">
                                    <PayPalCheckout
                                        amount={Math.round(price * 100)}
                                        description={`MyPrayerTower Sanctuary Offering: ${activeTab.toUpperCase()}`}
                                        onSuccess={handleSuccess}
                                        onError={() => alert('Could not complete payment. Please try again.')}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-center text-xs text-white/50 hover:text-white pt-2 transition-colors"
                                >
                                    ← Modify offering details
                                </button>
                            </div>
                        )}

                        {/* STEP 3: COMPLETED */}
                        {step === 3 && (
                            <div className="py-6 text-center space-y-4">
                                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h4 className="font-serif font-black text-2xl text-white">
                                    Offering Consecrated!
                                </h4>
                                <p className="text-xs sm:text-sm text-amber-100/80 max-w-sm mx-auto leading-relaxed">
                                    Your sacred intention has been lifted before the Altar of Perpetual Adoration at MyPrayerTower.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsCertOpen(true)}
                                    className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 mx-auto hover:scale-105 transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Official Consecration Certificate</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* Official Archival Consecration Certificate Modal */}
            <CertificateModal
                isOpen={isCertOpen}
                onClose={() => {
                    setIsCertOpen(false);
                    handleClose();
                }}
                type={activeTab === 'tabernacle' ? 'tabernacle' : activeTab === 'mass' ? 'mass-offering' : activeTab === 'bouquet' ? 'bouquet' : 'vigil'}
                recipientName={recipientName || donorName || 'Faithful Soul'}
                dedicatedDetail={activeTab === 'tabernacle' ? '7-Day Sanctuary Tabernacle Lamp' : activeTab === 'mass' ? 'Solemn Holy Mass Offering' : 'Sanctuary Vigil Flame'}
                intention={intention || 'For divine peace, grace, and protection.'}
                donorName={donorName || 'Devoted Soul'}
                pledgedItems={activeTab === 'bouquet' ? bouquetItems : undefined}
            />
        </>
    );
}
