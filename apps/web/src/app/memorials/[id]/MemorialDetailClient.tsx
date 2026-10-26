'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Flame,
    Flower,
    Share2,
    ArrowLeft,
    User,
    MessageCircle,
    Star,
    Sparkles,
    Heart,
    Church,
    Check,
    Lock,
    Copy,
    Award,
    Shield,
    X,
    Calendar,
    Send
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Memorial } from '@/lib/types/memorials';
import {
    prayForMemorial,
    addMemorialCondolence,
    upgradeMemorialToPremium,
    recordMemorialOffering
} from '@/app/actions/memorials';
import { CertificateModal } from '@/components/certificates/CertificateModal';
import { SACRED_COPY } from '@/lib/sacred-copy';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';

const PayPalCheckout = dynamic(
    () => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout),
    { ssr: false }
);

interface MemorialDetailClientProps {
    memorial: Memorial;
}

export function MemorialDetailClient({ memorial: initialMemorial }: MemorialDetailClientProps) {
    const [memorial, setMemorial] = useState<Memorial>(initialMemorial);
    const [prayersCount, setPrayersCount] = useState<number>(initialMemorial.totalPrayers || 0);
    const [candlesCount, setCandlesCount] = useState<number>(initialMemorial.totalCandles || 0);
    const [flowersCount, setFlowersCount] = useState<number>(initialMemorial.totalFlowers || 0);
    const [isPraying, setIsPraying] = useState(false);
    const [prayerToast, setPrayerToast] = useState<string | null>(null);

    // Guestbook Condolences
    const [condolences, setCondolences] = useState(initialMemorial.guestbook || []);
    const [authorName, setAuthorName] = useState('');
    const [condolenceMessage, setCondolenceMessage] = useState('');
    const [isSubmittingCondolence, setIsSubmittingCondolence] = useState(false);
    const [condolenceSuccess, setCondolenceSuccess] = useState(false);

    // Modals
    const [isOfferingModalOpen, setIsOfferingModalOpen] = useState(false);
    const [offeringTab, setOfferingTab] = useState<'candle' | 'bouquet' | 'mass'>('candle');
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);

    // Offering form state
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [customIntention, setCustomIntention] = useState(
        `For the eternal peace and blessed repose of the soul of ${initialMemorial.firstName} ${initialMemorial.lastName}.`
    );
    const [candleDuration, setCandleDuration] = useState<'3_DAYS' | '7_DAYS' | '14_DAYS' | '30_DAYS'>('7_DAYS');
    
    // Bouquet selection items
    const [bouquetItems, setBouquetItems] = useState({
        masses: 1,
        rosaries: 2,
        candles: 1,
        prayers: 5
    });

    const birthYear = memorial.birthDate ? new Date(memorial.birthDate).getFullYear() : '???';
    const deathYear = memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : 'Present';
    const isPremium = memorial.tier === 'PREMIUM';

    // Pricing calculation for offering modal
    const getOfferingPrice = () => {
        if (offeringTab === 'candle') {
            switch (candleDuration) {
                case '3_DAYS': return 2.99;
                case '7_DAYS': return 5.99;
                case '14_DAYS': return 9.99;
                case '30_DAYS': return 14.99;
                default: return 5.99;
            }
        }
        if (offeringTab === 'mass') {
            return 10.00;
        }
        if (offeringTab === 'bouquet') {
            return (bouquetItems.masses * 10) + (bouquetItems.rosaries * 5) + (bouquetItems.candles * 5);
        }
        return 5.99;
    };

    // Pray button handler
    const handlePray = async () => {
        if (isPraying) return;
        setIsPraying(true);
        setPrayersCount(prev => prev + 1);

        try {
            await prayForMemorial(memorial.id);
            setPrayerToast(`🙏 Your prayer for the repose of ${memorial.firstName}'s soul has ascended to God's altar.`);
            setTimeout(() => setPrayerToast(null), 5000);
        } catch (e) {
            console.error('Error praying:', e);
        } finally {
            setTimeout(() => setIsPraying(false), 800);
        }
    };

    // Guestbook submission
    const handleAddCondolence = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!condolenceMessage.trim() || isSubmittingCondolence) return;

        setIsSubmittingCondolence(true);
        const nameToUse = authorName.trim() || 'Faithful Friend';

        try {
            const res = await addMemorialCondolence(memorial.id, nameToUse, condolenceMessage);
            if (res.success && res.entry) {
                setCondolences(prev => [res.entry!, ...prev]);
                setCondolenceMessage('');
                setCondolenceSuccess(true);
                setTimeout(() => setCondolenceSuccess(false), 4000);
            }
        } catch (err) {
            console.error('Condolence submission error:', err);
        } finally {
            setIsSubmittingCondolence(false);
        }
    };

    // Offering success handler
    const handleOfferingSuccess = async (details: any) => {
        let addedCandles = 0;
        let addedPrayers = 0;
        let addedFlowers = 0;

        if (offeringTab === 'candle') {
            addedCandles = 1;
            addedPrayers = 1;
        } else if (offeringTab === 'mass') {
            addedPrayers = 3;
            addedFlowers = 1;
        } else if (offeringTab === 'bouquet') {
            addedCandles = bouquetItems.candles;
            addedPrayers = bouquetItems.prayers + (bouquetItems.rosaries * 5);
            addedFlowers = 2;
        }

        setCandlesCount(c => c + addedCandles);
        setPrayersCount(p => p + addedPrayers);
        setFlowersCount(f => f + addedFlowers);

        await recordMemorialOffering(memorial.id, {
            candles: addedCandles,
            prayers: addedPrayers,
            flowers: addedFlowers
        }).catch(() => null);

        setIsOfferingModalOpen(false);
        setIsCertModalOpen(true);
    };

    // Upgrade to premium handler
    const handleUpgradeSuccess = async (details: any) => {
        const res = await upgradeMemorialToPremium(memorial.id, details?.id);
        if (res.success) {
            setMemorial(prev => ({ ...prev, tier: 'PREMIUM' }));
            setCandlesCount(c => c + 10);
            setFlowersCount(f => f + 5);
            setPrayersCount(p => p + 25);
            setIsUpgradeModalOpen(false);
            setPrayerToast('✨ This memorial is now consecrated as a Perpetual Golden Altar!');
            setTimeout(() => setPrayerToast(null), 5000);
        }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://www.myprayertower.com/memorials/${memorial.id}`;
    const shareText = `🕊️ In loving memory of ${memorial.firstName} ${memorial.lastName} (${birthYear} - ${deathYear}). Join us in prayer, light a candle, and leave your tribute at MyPrayerTower: ${shareUrl}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-16">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/memorials"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>All Memorials</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setIsCertModalOpen(true)}
                            variant="outline"
                            size="sm"
                            className="rounded-full gap-1.5 border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-semibold"
                        >
                            <Award className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Official Memorabilia</span>
                        </Button>

                        <Button
                            onClick={() => setIsShareModalOpen(true)}
                            variant="ghost"
                            size="sm"
                            className="rounded-full gap-1.5 text-xs text-gray-600 dark:text-gray-300"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Prayer Toast Notification */}
            {prayerToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border border-amber-300">
                    <Sparkles className="w-6 h-6 text-black shrink-0" />
                    <p className="text-xs sm:text-sm">{prayerToast}</p>
                </div>
            )}

            <main className="container mx-auto px-4 py-8 sm:py-12">
                {/* Top Smart Ad */}
                <div className="max-w-5xl mx-auto mb-8">
                    <SmartAdSlot page="memorials" position="top" showPlaceholder={false} />
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Profile Sidebar */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Portrait Card */}
                            <div
                                className={`relative rounded-3xl overflow-hidden p-3 transition-all ${
                                    isPremium
                                        ? 'bg-gradient-to-b from-amber-400 via-amber-600 to-purple-950 p-[3px] shadow-[0_15px_50px_rgba(245,158,11,0.35)]'
                                        : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl'
                                }`}
                            >
                                <div className="relative aspect-square rounded-[22px] overflow-hidden bg-rose-50 dark:bg-rose-950/20">
                                    {memorial.photoUrl ? (
                                        <img
                                            src={memorial.photoUrl}
                                            alt={`${memorial.firstName} ${memorial.lastName}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-rose-200 dark:text-rose-900/30">
                                            <User className="w-32 h-32" />
                                        </div>
                                    )}

                                    {/* Premium Flame Overlay Badge */}
                                    {isPremium && (
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/60 text-amber-300 text-xs font-bold shadow-lg">
                                            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                                            <span>PERPETUAL ALTAR</span>
                                        </div>
                                    )}

                                    {/* In Loving Memory Bottom Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white text-center">
                                        <p className="text-[11px] uppercase tracking-widest text-amber-200 font-serif">
                                            Requiescat In Pace
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Live Remembrance Statistics Bar */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-5">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Sanctuary Offerings</span>
                                    </h3>
                                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                                        ● Live
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {/* Prayers Count */}
                                    <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-indigo-100 dark:border-indigo-900/40">
                                        <span className="text-xl sm:text-2xl font-black text-indigo-700 dark:text-indigo-300 font-mono">
                                            {prayersCount}
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                                            🙏 Prayers
                                        </span>
                                    </div>

                                    {/* Candles Lit */}
                                    <div className="bg-amber-50 dark:bg-amber-950/30 p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-amber-100 dark:border-amber-900/40">
                                        <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 font-mono">
                                            {candlesCount}
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 mt-1">
                                            🕯️ Candles
                                        </span>
                                    </div>

                                    {/* Flowers / Bouquets */}
                                    <div className="bg-rose-50 dark:bg-rose-950/30 p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-rose-100 dark:border-rose-900/40">
                                        <span className="text-xl sm:text-2xl font-black text-rose-700 dark:text-rose-400 font-mono">
                                            {flowersCount}
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 mt-1">
                                            💐 Flowers
                                        </span>
                                    </div>
                                </div>

                                {/* Guardian Information */}
                                {memorial.owner && (
                                    <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 ring-2 ring-amber-100 dark:ring-amber-900/30">
                                                <AvatarImage src={memorial.owner.avatarUrl} />
                                                <AvatarFallback className="bg-amber-100 text-amber-800 font-bold">
                                                    {memorial.owner.firstName?.[0] || 'M'}{memorial.owner.lastName?.[0] || 'G'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                    {memorial.owner.displayName || `${memorial.owner.firstName} ${memorial.owner.lastName}`}
                                                </p>
                                                <p className="text-[11px] text-gray-500">Memorial Guardian</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Free vs Premium Altar Banner */}
                            {!isPremium ? (
                                <div className="rounded-3xl p-6 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-purple-900/10 border-2 border-dashed border-amber-400/40 space-y-3 text-center">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-300">
                                        <Flame className="w-5 h-5 fill-current" />
                                    </div>
                                    <h4 className="font-serif font-bold text-base text-gray-900 dark:text-amber-100">
                                        Upgrade to Perpetual Golden Altar
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Consecrate an eternal burning flame, guaranteed inclusion in daily sanctuary prayers, and high-prestige featured registry placement for <strong>$19</strong>.
                                    </p>
                                    <Button
                                        onClick={() => setIsUpgradeModalOpen(true)}
                                        className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold shadow-md shadow-amber-500/20"
                                    >
                                        Upgrade Altar ($19)
                                    </Button>
                                </div>
                            ) : (
                                <div className="rounded-3xl p-5 bg-gradient-to-br from-amber-950/60 to-purple-950/60 border border-amber-400/40 text-amber-200 text-xs space-y-2 text-center">
                                    <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-widest text-[11px] text-amber-300">
                                        <Shield className="w-3.5 h-3.5" />
                                        Perpetual Sanctuary Covenant
                                    </span>
                                    <p className="opacity-90 leading-relaxed">
                                        This soul is perpetually remembered before the Blessed Sacrament and enrolled in daily Mass offerings.
                                    </p>
                                </div>
                            )}

                            {/* Sidebar Smart Ad */}
                            <div className="pt-2">
                                <SmartAdSlot page="memorials" position="sidebar" showPlaceholder={false} />
                            </div>
                        </div>

                        {/* Right Content Area & Interactive Offering Center */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Deceased Title & Lifespan */}
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-300/40">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>In Sacred & Perpetual Remembrance</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-gray-900 dark:text-white leading-tight">
                                    {memorial.firstName}<br />{memorial.lastName}
                                </h1>

                                <div className="flex items-center gap-4 text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-serif italic">
                                    <span>{birthYear}</span>
                                    <span className="w-8 h-px bg-amber-400/60" />
                                    <span>{deathYear}</span>
                                </div>
                            </div>

                            {/* 4 Interactive In-Page Action Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {/* Button 1: Pray */}
                                <Button
                                    onClick={handlePray}
                                    disabled={isPraying}
                                    className="h-auto py-3 px-2 flex flex-col items-center gap-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                                >
                                    <span className="text-xl">🙏</span>
                                    <span className="text-xs font-bold font-serif">Say a Prayer</span>
                                </Button>

                                {/* Button 2: Light Candle */}
                                <Button
                                    onClick={() => {
                                        setOfferingTab('candle');
                                        setIsOfferingModalOpen(true);
                                    }}
                                    className="h-auto py-3 px-2 flex flex-col items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
                                >
                                    <Flame className="w-5 h-5 fill-current" />
                                    <span className="text-xs font-bold font-serif">Light Candle</span>
                                </Button>

                                {/* Button 3: Spiritual Bouquet */}
                                <Button
                                    onClick={() => {
                                        setOfferingTab('bouquet');
                                        setIsOfferingModalOpen(true);
                                    }}
                                    className="h-auto py-3 px-2 flex flex-col items-center gap-1.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
                                >
                                    <Flower className="w-5 h-5" />
                                    <span className="text-xs font-bold font-serif">Send Bouquet</span>
                                </Button>

                                {/* Button 4: Mass Offering */}
                                <Button
                                    onClick={() => {
                                        setOfferingTab('mass');
                                        setIsOfferingModalOpen(true);
                                    }}
                                    className="h-auto py-3 px-2 flex flex-col items-center gap-1.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white shadow-lg shadow-purple-700/20 active:scale-95 transition-all"
                                >
                                    <Church className="w-5 h-5" />
                                    <span className="text-xs font-bold font-serif">Offer Mass</span>
                                </Button>
                            </div>

                            {/* Biography / Life Legacy Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-sm relative space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Life & Legacy of Faith</span>
                                </div>
                                <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-serif italic">
                                    &ldquo;{memorial.biography || `${memorial.firstName} touched many lives with grace, love, and steady faith. May their soul rest in eternal light.`}&rdquo;
                                </p>
                            </div>

                            {/* Commemorative Memorabilia Certificate CTA Strip */}
                            <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/15 to-purple-900/10 rounded-3xl p-6 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="space-y-1 text-center sm:text-left">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                                        Archival Digital Memorabilia
                                    </span>
                                    <h4 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                                        Vatican-Style Sacred Certificate
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Official consecrated illuminated certificate ready to download, frame, or share.
                                    </p>
                                </div>

                                <Button
                                    onClick={() => setIsCertModalOpen(true)}
                                    className="rounded-full bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 shrink-0 shadow-md"
                                >
                                    <Award className="w-4 h-4 mr-1.5" />
                                    View Certificate
                                </Button>
                            </div>

                            {/* Inline Smart Ad */}
                            <SmartAdSlot page="memorials" position="inline" showPlaceholder={false} />

                            {/* Interactive Tributes & Condolences Guestbook Wall */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                                    <div>
                                        <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                                            <span>Sacred Tributes & Condolences</span>
                                            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold">
                                                {condolences.length}
                                            </span>
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Leave a prayer, loving memory, or word of comfort for the family.
                                        </p>
                                    </div>
                                </div>

                                {/* Form to Post a Tribute */}
                                <form onSubmit={handleAddCondolence} className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Your Name (e.g. Maria G., Friend)"
                                            value={authorName}
                                            onChange={e => setAuthorName(e.target.value)}
                                            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <textarea
                                        rows={3}
                                        placeholder="Write your condolence, tribute, or prayer intention here..."
                                        value={condolenceMessage}
                                        onChange={e => setCondolenceMessage(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                                    />
                                    <div className="flex items-center justify-between">
                                        {condolenceSuccess && (
                                            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                                <Check className="w-3.5 h-3.5" />
                                                Tribute posted with reverence
                                            </span>
                                        )}
                                        <div className="ml-auto">
                                            <Button
                                                type="submit"
                                                disabled={isSubmittingCondolence || !condolenceMessage.trim()}
                                                className="rounded-xl bg-gray-900 dark:bg-amber-500 dark:text-black text-white text-xs font-bold px-5 py-2 hover:brightness-110"
                                            >
                                                <Send className="w-3.5 h-3.5 mr-1.5" />
                                                {isSubmittingCondolence ? 'Posting...' : 'Post Tribute'}
                                            </Button>
                                        </div>
                                    </div>
                                </form>

                                {/* List of Tributes */}
                                <div className="space-y-3 pt-3">
                                    {condolences.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-sm italic">
                                            Be the first to leave a tribute or prayer for {memorial.firstName}.
                                        </div>
                                    ) : (
                                        condolences.map(c => (
                                            <div
                                                key={c.id}
                                                className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800/80 space-y-1.5"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-center">
                                                            ☩
                                                        </span>
                                                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                                                            {c.guestName || 'Faithful Soul'}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-serif italic pl-8">
                                                    &ldquo;{c.message}&rdquo;
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* IN-PAGE OFFERING & SPIRITUAL BOUQUET POPUP MODAL */}
            {isOfferingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-300 dark:border-slate-800 overflow-hidden my-auto p-5 sm:p-7 text-gray-900 dark:text-white">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                                    ☩
                                </span>
                                <div>
                                    <h3 className="font-serif font-bold text-base sm:text-lg">
                                        Sacred Memorial Offering
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        In Memory of {memorial.firstName} {memorial.lastName}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOfferingModalOpen(false)}
                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Offering Type Selector Tabs */}
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl mb-5 text-xs font-bold">
                            <button
                                onClick={() => setOfferingTab('candle')}
                                className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 ${
                                    offeringTab === 'candle'
                                        ? 'bg-amber-500 text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                <Flame className="w-3.5 h-3.5" />
                                <span>Candle</span>
                            </button>
                            <button
                                onClick={() => setOfferingTab('bouquet')}
                                className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 ${
                                    offeringTab === 'bouquet'
                                        ? 'bg-rose-600 text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                <Flower className="w-3.5 h-3.5" />
                                <span>Bouquet</span>
                            </button>
                            <button
                                onClick={() => setOfferingTab('mass')}
                                className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 ${
                                    offeringTab === 'mass'
                                        ? 'bg-purple-700 text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                <Church className="w-3.5 h-3.5" />
                                <span>Holy Mass</span>
                            </button>
                        </div>

                        {/* Content for Candle */}
                        {offeringTab === 'candle' && (
                            <div className="space-y-4">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Sanctuary Candle Duration
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: '3_DAYS', label: '3-Day Votive', price: '$2.99' },
                                        { id: '7_DAYS', label: '7-Day Altar', price: '$5.99', popular: true },
                                        { id: '14_DAYS', label: '14-Day Marian', price: '$9.99' },
                                        { id: '30_DAYS', label: '30-Day Cathedral', price: '$14.99' },
                                    ].map(item => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setCandleDuration(item.id as any)}
                                            className={`p-3 rounded-2xl border text-left transition-all relative ${
                                                candleDuration === item.id
                                                    ? 'border-amber-500 bg-amber-500/10 font-bold'
                                                    : 'border-gray-200 dark:border-slate-800 hover:border-amber-300'
                                            }`}
                                        >
                                            {item.popular && (
                                                <span className="absolute top-2 right-2 text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded-full font-bold">
                                                    POPULAR
                                                </span>
                                            )}
                                            <span className="block text-xs text-gray-900 dark:text-white">{item.label}</span>
                                            <span className="block text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">{item.price}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content for Spiritual Bouquet */}
                        {offeringTab === 'bouquet' && (
                            <div className="space-y-3">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Build Your Spiritual Bouquet
                                </label>
                                <div className="space-y-2">
                                    {/* Masses */}
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
                                        <div>
                                            <span className="text-xs font-bold block">✝ Holy Masses ($10 ea)</span>
                                            <span className="text-[10px] text-gray-500">Offered for the soul</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono">
                                            <button
                                                type="button"
                                                onClick={() => setBouquetItems(b => ({ ...b, masses: Math.max(0, b.masses - 1) }))}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-slate-700 font-bold"
                                            >-</button>
                                            <span className="w-5 text-center text-xs font-bold">{bouquetItems.masses}</span>
                                            <button
                                                type="button"
                                                onClick={() => setBouquetItems(b => ({ ...b, masses: b.masses + 1 }))}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-slate-700 font-bold"
                                            >+</button>
                                        </div>
                                    </div>

                                    {/* Rosaries */}
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
                                        <div>
                                            <span className="text-xs font-bold block">📿 Rosaries Recited ($5 ea)</span>
                                            <span className="text-[10px] text-gray-500">Dedicated intercessions</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono">
                                            <button
                                                type="button"
                                                onClick={() => setBouquetItems(b => ({ ...b, rosaries: Math.max(0, b.rosaries - 1) }))}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-slate-700 font-bold"
                                            >-</button>
                                            <span className="w-5 text-center text-xs font-bold">{bouquetItems.rosaries}</span>
                                            <button
                                                type="button"
                                                onClick={() => setBouquetItems(b => ({ ...b, rosaries: b.rosaries + 1 }))}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-slate-700 font-bold"
                                            >+</button>
                                        </div>
                                    </div>

                                    {/* Candles */}
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
                                        <div>
                                            <span className="text-xs font-bold block">🕯️ Sanctuary Candles ($5 ea)</span>
                                            <span className="text-[10px] text-gray-500">Lit in chapel</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono">
                                            <button
                                                type="button"
                                                onClick={() => setBouquetItems(b => ({ ...b, candles: Math.max(0, b.candles - 1) }))}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-slate-700 font-bold"
                                            >-</button>
                                            <span className="w-5 text-center text-xs font-bold">{bouquetItems.candles}</span>
                                            <button
                                                type="button"
                                                onClick={() => setBouquetItems(b => ({ ...b, candles: b.candles + 1 }))}
                                                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-slate-700 font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content for Holy Mass */}
                        {offeringTab === 'mass' && (
                            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-center space-y-2">
                                <Church className="w-8 h-8 text-purple-600 dark:text-purple-300 mx-auto" />
                                <h4 className="font-serif font-bold text-sm text-purple-900 dark:text-purple-200">
                                    Solemn Memorial Mass ($10.00 Stipend)
                                </h4>
                                <p className="text-xs text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
                                    A Holy Mass will be celebrated specifically for the repose of the soul of <strong>{memorial.firstName} {memorial.lastName}</strong>.
                                </p>
                            </div>
                        )}

                        {/* Intention and Donor Details */}
                        <div className="space-y-3 mt-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Personal Prayer Intention
                                </label>
                                <textarea
                                    rows={2}
                                    value={customIntention}
                                    onChange={e => setCustomIntention(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Donor / Family Member"
                                        value={donorName}
                                        onChange={e => setDonorName(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                        Your Email (Receipt)
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={donorEmail}
                                        onChange={e => setDonorEmail(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown & Embedded PayPal Checkout */}
                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-600 dark:text-gray-400">Total Offering:</span>
                                <span className="font-mono font-black text-lg text-gray-900 dark:text-white">
                                    ${getOfferingPrice().toFixed(2)} USD
                                </span>
                            </div>

                            {/* Embedded In-Page PayPal Button */}
                            <div className="min-h-[140px] pt-1">
                                <PayPalCheckout
                                    amount={Math.round(getOfferingPrice() * 100)}
                                    description={`Memorial Offering for ${memorial.firstName} ${memorial.lastName}`}
                                    onSuccess={handleOfferingSuccess}
                                    onError={(err) => alert('Payment could not be processed. Please try again.')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* UPGRADE TO PERPETUAL ALTAR MODAL ($19) */}
            {isUpgradeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
                    <div className="relative w-full max-w-md bg-[#0a0515] border-2 border-amber-400 rounded-3xl shadow-2xl p-6 text-white text-center space-y-4">
                        <button
                            onClick={() => setIsUpgradeModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-amber-300">
                            <Flame className="w-7 h-7 fill-current" />
                        </div>

                        <h3 className="font-serif font-black text-xl text-amber-100">
                            Consecrate Perpetual Golden Altar
                        </h3>
                        <p className="text-xs text-amber-200/80 leading-relaxed">
                            One-time offering of <strong>$19.00</strong> to perpetually preserve the memory of <strong>{memorial.firstName} {memorial.lastName}</strong> with an eternal flame, daily chapel prayers, and top-tier obituary registry prominence.
                        </p>

                        <div className="min-h-[140px] pt-2">
                            <PayPalCheckout
                                amount={1900}
                                description={`Upgrade Perpetual Golden Altar for ${memorial.firstName} ${memorial.lastName}`}
                                onSuccess={handleUpgradeSuccess}
                                onError={() => alert('Could not complete upgrade.')}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* SHARE MODAL */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 text-center space-y-4 border border-gray-200 dark:border-slate-800">
                        <button
                            onClick={() => setIsShareModalOpen(false)}
                            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="font-serif font-bold text-lg">Share Eternal Memorial</h3>
                        <p className="text-xs text-gray-500">
                            Invite family and fellow believers to unite in prayer for {memorial.firstName}.
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
                            <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-emerald-600 text-white flex items-center justify-center gap-1.5"
                            >
                                WhatsApp
                            </a>
                            <a
                                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-sky-500 text-white flex items-center justify-center gap-1.5"
                            >
                                Telegram
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-1.5"
                            >
                                Facebook
                            </a>
                            <button
                                onClick={handleCopyLink}
                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1.5"
                            >
                                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedShare ? 'Copied!' : 'Copy Link'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OFFICIAL HIGH-RES VATICAN-STYLE MEMORIAL CERTIFICATE MODAL */}
            <CertificateModal
                isOpen={isCertModalOpen}
                onClose={() => setIsCertModalOpen(false)}
                type="memorial"
                recipientName={`${memorial.firstName} ${memorial.lastName}`}
                dedicatedDetail={`Born ${birthYear} • Entered Eternal Rest ${deathYear}`}
                intention={`For the blessed repose and eternal light of ${memorial.firstName} ${memorial.lastName}. May Christ Jesus grant them peaceful rest in the heavenly kingdom.`}
                donorName={donorName || memorial.owner?.displayName || 'Faithful Community'}
                scripture="Blessed are the dead which die in the Lord from henceforth: Yea, saith the Spirit, that they may rest from their labours; and their works do follow them."
                scriptureRef="Revelation 14:13"
                pledgedItems={{
                    candles: candlesCount,
                    prayers: prayersCount,
                    masses: isPremium ? 1 : undefined
                }}
            />
        </div>
    );
}
