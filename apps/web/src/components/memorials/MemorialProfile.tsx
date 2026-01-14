'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ChevronLeft, Calendar, Cross, Heart, Users,
    Loader2, ExternalLink, Sparkles, Gift, LogIn, Crown
} from 'lucide-react';
import { SmartAdSlot } from '@/components/ads';
import { ShareButtons } from '@/components/social/ShareButtons';
import { QRCodeGenerator } from '@/components/memorials/QRCodeGenerator';
import { OfferingDialog } from '@/components/memorials/OfferingDialog';
import { MemorialTimeline } from '@/components/memorials/MemorialTimeline';
import { Bell, BellOff } from 'lucide-react'; // Added icons

export interface Offering {
    id: string;
    type: string;
    amount: number;
    message: string | null;
    isAnonymous: boolean;
    guestName: string | null;
    createdAt: string;
    user: { displayName: string | null; avatarUrl: string | null } | null;
}

export interface GuestbookEntry {
    id: string;
    message: string;
    guestName: string | null;
    createdAt: string;
    user: { displayName: string | null; avatarUrl: string | null } | null;
}

export interface Memorial {
    id: string;
    slug: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    deathDate: string | null;
    biography: string | null;
    shortBio: string | null;
    photoUrl: string | null;
    videoUrl: string | null;
    tier: 'BASIC' | 'PREMIUM';
    isVerified: boolean;
    totalCandles: number;
    totalMasses: number;
    totalFlowers: number;
    totalPrayers: number;
    viewCount: number;
    photos: { id: string; url: string; caption: string | null }[];
    offerings: Offering[];
    guestbook: GuestbookEntry[];
}

const OFFERING_LABELS: Record<string, { label: string; icon: string }> = {
    CANDLE_SMALL: { label: 'Small Candle', icon: '🕯️' },
    CANDLE_MEDIUM: { label: 'Candle', icon: '🕯️' },
    CANDLE_LARGE: { label: 'Large Candle', icon: '🕯️' },
    CANDLE_FEATURED: { label: 'Featured 30-Day Candle', icon: '✨' },
    FLOWERS: { label: 'Flowers', icon: '🌹' },
    PRAYER_CARD: { label: 'Prayer Card', icon: '🙏' },
    FLORAL_BOUQUET: { label: 'Floral Bouquet', icon: '💐' },
    ROSARY_DECADE: { label: 'Rosary Decade', icon: '📿' },
    ROSARY_FULL: { label: 'Full Rosary', icon: '📿' },
    MASS: { label: 'Holy Mass', icon: '✝️' },
    SPIRITUAL_BOUQUET_GARDEN: { label: 'Garden of Grace', icon: '💝' },
    SPIRITUAL_BOUQUET_HEAVENLY: { label: 'Heavenly Tribute', icon: '💝' },
    SPIRITUAL_BOUQUET_ETERNAL: { label: 'Eternal Peace', icon: '💝' },
    SPIRITUAL_BOUQUET_LEGACY: { label: 'Legacy Remembrance', icon: '💝' },
};

export function MemorialProfile({ initialMemorial }: { initialMemorial: Memorial }) {
    // We keep memorial in state to allow updates (e.g. after posting guestbook)
    const [memorial, setMemorial] = useState<Memorial>(initialMemorial);
    const [newMessage, setNewMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [offeringDialogOpen, setOfferingDialogOpen] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [remindersEnabled, setRemindersEnabled] = useState(false); // New state

    useEffect(() => {
        // Check authentication status
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => setIsLoggedIn(!!data?.user))
            .catch(() => setIsLoggedIn(false));
    }, []);

    const submitGuestbook = async () => {
        if (!newMessage.trim() || !memorial) return;
        setSubmitting(true);
        try {
            await fetch(`/api/memorials/${memorial.id}/guestbook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage }),
            });
            setNewMessage('');
            // Refresh memorial data
            const res = await fetch(`/api/memorials/${memorial.id}`);
            if (res.ok) {
                const data = await res.json();
                setMemorial(data);
            }
        } catch (err) {
            console.error('Error submitting message:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const shareInvitation = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const text = `You're invited to honor the memory of ${memorial?.firstName} ${memorial?.lastName}. Light a candle or share a tribute.`;

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: `Memorial: ${memorial?.firstName} ${memorial?.lastName}`,
                    text,
                    url,
                });
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const fullName = `${memorial.firstName} ${memorial.lastName}`;

    const startDate = formatDate(memorial.birthDate) || '?';
    const endDate = formatDate(memorial.deathDate) || '?';
    const lifeSpan = (memorial.birthDate || memorial.deathDate)
        ? `${startDate} - ${endDate}`
        : null;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Premium Shimmer Animation */}
            {memorial.tier === 'PREMIUM' && (
                <div className="hidden" /> // Placeholder to keep logic if needed, or just remove
            )}

            {/* Featured Memorial Banner for Premium */}
            {memorial.tier === 'PREMIUM' && (
                <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 py-2 text-center relative overflow-hidden">
                    <div className="absolute inset-0 premium-shimmer" />
                    <span className="relative text-white font-bold text-sm flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        ⭐ Featured Memorial ⭐
                        <Sparkles className="w-4 h-4" />
                    </span>
                </div>
            )}

            {/* Hero Header - Premium gets gold, Basic gets slate */}
            <div className={`relative text-white ${memorial.tier === 'PREMIUM'
                ? 'bg-gradient-to-b from-amber-900 via-amber-800 to-slate-800'
                : 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700'
                }`}>
                <div className="absolute inset-0 opacity-20">
                    {memorial.photoUrl && (
                        <img src={memorial.photoUrl} alt="" className="w-full h-full object-cover blur-xl" />
                    )}
                </div>
                {memorial.tier === 'PREMIUM' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-amber-500/10" />
                )}
                <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
                    <Link href="/memorials" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Memorials
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Photo - Premium gets golden ring with glow */}
                        <div className={`w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden bg-slate-700 flex-shrink-0 shadow-2xl ${memorial.tier === 'PREMIUM'
                            ? 'ring-4 ring-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.4)]'
                            : 'border-4 border-white/20'
                            }`}>
                            {memorial.photoUrl ? (
                                <img src={memorial.photoUrl} alt={fullName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Cross className="w-20 h-20 text-slate-500" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-2 text-white/80">
                                In Loving Memory of
                            </h1>
                            <h2 className={`text-5xl lg:text-6xl font-serif font-bold mb-4 ${memorial.tier === 'PREMIUM'
                                ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                                : 'text-white'
                                }`}>
                                {fullName}
                            </h2>
                            {lifeSpan && (
                                <div className={`flex items-center gap-2 text-lg mb-4 ${memorial.tier === 'PREMIUM' ? 'text-amber-200' : 'text-slate-300'
                                    }`}>
                                    <Calendar className="w-5 h-5" />
                                    <span>{lifeSpan}</span>
                                </div>
                            )}
                            {memorial.shortBio && (
                                <p className="text-slate-300 text-lg italic max-w-2xl">
                                    "{memorial.shortBio}"
                                </p>
                            )}

                            {/* Share */}
                            <div className="mt-6">
                                <ShareButtons
                                    url={typeof window !== 'undefined' ? window.location.href : ''}
                                    title={`In Loving Memory of ${fullName}`}
                                    description={memorial.shortBio || `Remember ${fullName} with prayers and tributes.`}
                                    variant="compact"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Anniversary Notification */}
            {
                (() => {
                    if (!memorial.deathDate && !memorial.birthDate) return null;
                    const today = new Date();
                    const death = memorial.deathDate ? new Date(memorial.deathDate) : null;
                    const birth = memorial.birthDate ? new Date(memorial.birthDate) : null;

                    let anniversaryType = null;
                    let years = 0;

                    if (death && death.getDate() === today.getDate() && death.getMonth() === today.getMonth()) {
                        anniversaryType = 'death';
                        years = today.getFullYear() - death.getFullYear();
                    } else if (birth && birth.getDate() === today.getDate() && birth.getMonth() === today.getMonth()) {
                        anniversaryType = 'birth';
                        years = today.getFullYear() - birth.getFullYear();
                    }

                    if (!anniversaryType) return null;

                    return (
                        <div className="container mx-auto px-4 -mt-8 mb-6 relative z-30">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg flex items-center justify-between text-white animate-fade-in-up">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            Today is {memorial.firstName}'s {years > 0 ? `${years}th` : ''} {anniversaryType === 'birth' ? 'Birthday' : 'Remembrance Day'}
                                        </h3>
                                        <p className="text-amber-100 text-sm">Light a special candle to honor this memory forever.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="px-6 py-2 bg-white text-amber-600 font-bold rounded-lg shadow-md hover:bg-amber-50 transition-colors"
                                >
                                    Light Candle
                                </button>
                            </div>
                        </div>
                    );
                })()
            }

            {/* Life Journey Timeline (New Component) */}
            <div className="bg-white border-b border-gray-100 shadow-sm -mt-10 relative z-20">
                <MemorialTimeline
                    birthDate={memorial.birthDate}
                    deathDate={memorial.deathDate}
                    createdAt={memorial.createdAt as unknown as string} // Type cast if necessary, though simpler string is better
                />
            </div>

            {/* Stats Bar */}
            <div className="bg-slate-50 border-b border-gray-200 shadow-inner relative z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-amber-500">{memorial.totalCandles}</div>
                            <div className="text-sm text-gray-500">🕯️ Candles</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200" />
                        <div>
                            <div className="text-3xl font-bold text-blue-500">{memorial.totalMasses}</div>
                            <div className="text-sm text-gray-500">✝️ Masses</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200" />
                        <div>
                            <div className="text-3xl font-bold text-rose-500">{memorial.totalFlowers}</div>
                            <div className="text-sm text-gray-500">🌹 Flowers</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200" />
                        <div>
                            <div className="text-3xl font-bold text-purple-500">{memorial.totalPrayers}</div>
                            <div className="text-sm text-gray-500">🙏 Prayers</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Offerings Section 1 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Light a Candle or Offer a Prayer</h3>
                            <p className="text-gray-500 mb-6">Your presence and prayers are the greatest gift. These offerings are optional — your remembrance is enough.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:border-amber-300 transition-all group"
                                >
                                    <span className="text-3xl mb-2">🕯️</span>
                                    <span className="font-semibold text-gray-900">Light a Candle</span>
                                    <span className="text-xs text-amber-600/70">Suggested offering</span>
                                </button>
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="flex flex-col items-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 hover:border-rose-300 transition-all group"
                                >
                                    <span className="text-3xl mb-2">🌹</span>
                                    <span className="font-semibold text-gray-900">Send Flowers</span>
                                    <span className="text-xs text-rose-600/70">In remembrance</span>
                                </button>
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all group"
                                >
                                    <span className="text-3xl mb-2">🙏</span>
                                    <span className="font-semibold text-gray-900">Offer a Prayer</span>
                                    <span className="text-xs text-blue-600/70">Join in prayer</span>
                                </button>
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100 hover:border-purple-300 transition-all group"
                                >
                                    <span className="text-3xl mb-2">💐</span>
                                    <span className="font-semibold text-gray-900">Floral Tribute</span>
                                    <span className="text-xs text-purple-600/70">A loving gesture</span>
                                </button>
                            </div>
                        </div>

                        {/* Sacred Offerings Section 2 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Sacred Offerings</h3>
                            <p className="text-gray-500 mb-6">The greatest gift — a prayer from the Church</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="flex items-center gap-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 hover:border-indigo-300 transition-all text-left"
                                >
                                    <span className="text-4xl">💿</span>
                                    <div>
                                        <div className="font-semibold text-gray-900">Rosary</div>
                                        <div className="text-sm text-indigo-600">$5 - $15</div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all text-left"
                                >
                                    <span className="text-4xl">✝️</span>
                                    <div>
                                        <div className="font-semibold text-gray-900">Holy Mass</div>
                                        <div className="text-sm text-blue-600">$25</div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Spiritual Bouquets */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
                            <div className="flex items-center gap-3 mb-2">
                                <Gift className="w-6 h-6 text-amber-600" />
                                <h3 className="text-xl font-bold text-amber-800">Spiritual Bouquets</h3>
                            </div>
                            <p className="text-amber-700 mb-6">The most meaningful tribute you can give</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="p-5 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 transition-all text-left"
                                >
                                    <div className="font-bold text-gray-900">Garden of Grace</div>
                                    <p className="text-sm text-gray-500 mb-2">3 candles + 1 rosary + prayer card</p>
                                    <div className="text-amber-600 font-bold">$19</div>
                                </button>
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="p-5 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 transition-all text-left"
                                >
                                    <div className="font-bold text-gray-900">Heavenly Tribute</div>
                                    <p className="text-sm text-gray-500 mb-2">7 candles + 1 Mass + 1 rosary</p>
                                    <div className="text-amber-600 font-bold">$49</div>
                                </button>
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="p-5 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 transition-all text-left"
                                >
                                    <div className="font-bold text-gray-900">Eternal Peace</div>
                                    <p className="text-sm text-gray-500 mb-2">30 candles + 3 Masses + 3 rosaries + flowers</p>
                                    <div className="text-amber-600 font-bold">$99</div>
                                </button>
                                <button
                                    onClick={() => setOfferingDialogOpen(true)}
                                    className="p-5 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 transition-all text-left"
                                >
                                    <div className="font-bold text-gray-900">Legacy Remembrance</div>
                                    <p className="text-sm text-gray-500 mb-2">100 candles + 10 Masses + weekly rosary for 1 year</p>
                                    <div className="text-amber-600 font-bold">$299</div>
                                </button>
                            </div>
                        </div>

                        {/* Biography */}
                        {memorial.biography && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Life Story</h3>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {memorial.biography}
                                </div>
                            </div>
                        )}

                        {/* Tributes & Memories */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-rose-500" />
                                Tributes & Memories
                            </h3>

                            {/* Add Message - Auth Required */}
                            {isLoggedIn ? (
                                <div className="mb-6">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Share a memory or message of tribute..."
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                                        rows={3}
                                    />
                                    <button
                                        onClick={submitGuestbook}
                                        disabled={!newMessage.trim() || submitting}
                                        className="mt-2 px-6 py-2 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
                                    >
                                        {submitting ? 'Posting...' : 'Share Tribute'}
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm">
                                            <LogIn className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-1">Sign in to Leave a Tribute</h4>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Join our community to share memories and messages of remembrance for {fullName}.
                                            </p>
                                            <Link
                                                href={`/auth/signin?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold text-sm rounded-xl hover:bg-amber-600 transition-colors"
                                            >
                                                <LogIn className="w-4 h-4" />
                                                Sign In
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            <div className="space-y-4">
                                {memorial.guestbook.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">Be the first to share a tribute.</p>
                                ) : (
                                    memorial.guestbook.map((entry) => (
                                        <div key={entry.id} className="p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-gray-900">
                                                    {entry.user?.displayName || entry.guestName || 'Anonymous'}
                                                </span>
                                                <span className="text-sm text-gray-400">
                                                    {formatRelativeTime(entry.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{entry.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Tributes */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4">Recent Tributes</h4>
                            {memorial.offerings.length === 0 ? (
                                <p className="text-sm text-gray-500">No tributes yet. Be the first!</p>
                            ) : (
                                <div className="space-y-3">
                                    {memorial.offerings.slice(0, 10).map((offering) => {
                                        const offeringInfo = OFFERING_LABELS[offering.type] || { label: offering.type, icon: '🎁' };
                                        const displayName = offering.isAnonymous
                                            ? 'Anonymous'
                                            : offering.user?.displayName || offering.guestName || 'Someone';
                                        return (
                                            <div key={offering.id} className="flex items-start gap-3 text-sm">
                                                <span className="text-lg">{offeringInfo.icon}</span>
                                                <div>
                                                    <span className="font-medium text-gray-900">{displayName}</span>
                                                    <span className="text-gray-500"> sent a {offeringInfo.label}</span>
                                                    <div className="text-xs text-gray-400">
                                                        {formatRelativeTime(offering.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* QR Code for Physical Memorials */}
                        <QRCodeGenerator memorialSlug={memorial.slug} memorialName={fullName} />

                        {/* Anniversary Reminders */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-amber-500" />
                                Remembrance Days
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Receive a gentle email reminder on {memorial.firstName}'s birthday and anniversary.
                            </p>
                            <button
                                onClick={() => setRemindersEnabled(!remindersEnabled)}
                                className={`w-full py-2 font-semibold rounded-xl transition-colors border ${remindersEnabled
                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {remindersEnabled ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        Reminders Active
                                    </span>
                                ) : (
                                    'Enable Reminders'
                                )}
                            </button>
                        </div>

                        {/* Sidebar Ad */}
                        <SmartAdSlot page="memorials" position="sidebar" />

                        {/* Invite Family */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                Invite Family
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Invite loved ones to contribute to this memorial.
                            </p>
                            <button
                                onClick={shareInvitation}
                                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                            >
                                {linkCopied ? '✅ Link Copied!' : 'Share Invitation'}
                            </button>
                        </div>

                        {/* Upgrade CTA for Basic Tier - HIDDEN until upgrade page is implemented
                        {memorial.tier === 'BASIC' && (
                            <div className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 rounded-2xl p-6 border-2 border-amber-400 shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Crown className="w-6 h-6 text-amber-600" />
                                    <h4 className="text-lg font-bold text-gray-900">Feature Memorial</h4>
                                </div>
                                <ul className="text-sm text-gray-700 mb-4 space-y-2">
                                    <li className="flex items-center gap-2">✓ <span>Golden premium styling</span></li>
                                    <li className="flex items-center gap-2">✓ <span>Unlimited photos & videos</span></li>
                                    <li className="flex items-center gap-2">✓ <span>Background music</span></li>
                                    <li className="flex items-center gap-2">✓ <span>Ad-free experience</span></li>
                                    <li className="flex items-center gap-2">✓ <span>Priority placement</span></li>
                                </ul>
                                <Link
                                    href={`/memorials/${memorial.slug}/upgrade`}
                                    className="block w-full py-3 bg-gradient-to-r from-amber-50 to-orange-500 text-white font-bold rounded-xl text-center shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                                >
                                    ⭐ Feature This Memorial — $49.99
                                </Link>
                            </div>
                        )}
                        */}
                    </div>
                </div>
            </div>

            {/* Offering Dialog */}
            <OfferingDialog
                memorial={{ id: memorial.id, firstName: memorial.firstName, lastName: memorial.lastName, photoUrl: memorial.photoUrl }}
                isOpen={offeringDialogOpen}
                onClose={() => setOfferingDialogOpen(false)}
            />
        </div >
    );
}
