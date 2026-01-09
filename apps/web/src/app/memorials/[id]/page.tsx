'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Calendar, Flame, Cross, Heart, Share2, Users,
    MessageSquare, Loader2, ExternalLink, Sparkles, Gift
} from 'lucide-react';
import { SmartAdSlot } from '@/components/ads';
import { ShareButtons } from '@/components/social/ShareButtons';

interface Offering {
    id: string;
    type: string;
    amount: number;
    message: string | null;
    isAnonymous: boolean;
    guestName: string | null;
    createdAt: string;
    user: { displayName: string | null; avatarUrl: string | null } | null;
}

interface GuestbookEntry {
    id: string;
    message: string;
    guestName: string | null;
    createdAt: string;
    user: { displayName: string | null; avatarUrl: string | null } | null;
}

interface Memorial {
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

export default function MemorialDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [memorial, setMemorial] = useState<Memorial | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchMemorial() {
            try {
                const res = await fetch(`/api/memorials/${id}`);
                if (!res.ok) throw new Error('Memorial not found');
                const data = await res.json();
                setMemorial(data);
            } catch (err) {
                setError('Memorial not found');
            } finally {
                setLoading(false);
            }
        }
        fetchMemorial();
    }, [id]);

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
            const res = await fetch(`/api/memorials/${id}`);
            const data = await res.json();
            setMemorial(data);
        } catch (err) {
            console.error('Error submitting message:', err);
        } finally {
            setSubmitting(false);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
        );
    }

    if (error || !memorial) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Cross className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Memorial Not Found</h1>
                    <p className="text-gray-500 mb-6">The memorial you're looking for doesn't exist.</p>
                    <Link href="/memorials" className="text-amber-600 hover:underline">
                        ← Back to Memorials
                    </Link>
                </div>
            </div>
        );
    }

    const fullName = `${memorial.firstName} ${memorial.lastName}`;
    const lifeSpan = memorial.birthDate || memorial.deathDate
        ? `${formatDate(memorial.birthDate) || '?'} — ${formatDate(memorial.deathDate) || '?'}`
        : null;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white">
                <div className="absolute inset-0 opacity-30">
                    {memorial.photoUrl && (
                        <img src={memorial.photoUrl} alt="" className="w-full h-full object-cover blur-xl" />
                    )}
                </div>
                <div className="relative z-10 container mx-auto px-4 pt-24 pb-32">
                    <Link href="/memorials" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Memorials
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Photo */}
                        <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden bg-slate-700 flex-shrink-0 shadow-2xl border-4 border-white/20">
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
                            {memorial.tier === 'PREMIUM' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full mb-3">
                                    <Sparkles className="w-3 h-3" /> Featured Memorial
                                </span>
                            )}
                            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-2">
                                In Loving Memory of
                            </h1>
                            <h2 className="text-5xl lg:text-6xl font-serif font-bold text-amber-400 mb-4">
                                {fullName}
                            </h2>
                            {lifeSpan && (
                                <div className="flex items-center gap-2 text-slate-300 text-lg mb-4">
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

            {/* Stats Bar */}
            <div className="bg-white border-b border-gray-100 shadow-sm -mt-10 relative z-20">
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
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Acts of Love</h3>
                            <p className="text-gray-500 mb-6">A small gesture, eternal love</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link
                                    href={`/candles?memorial=${memorial.id}&name=${encodeURIComponent(fullName)}`}
                                    className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:border-amber-300 transition-all group"
                                >
                                    <span className="text-3xl mb-2">🕯️</span>
                                    <span className="font-semibold text-gray-900">Candle</span>
                                    <span className="text-sm text-amber-600">$1-5</span>
                                </Link>
                                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 hover:border-rose-300 transition-all group">
                                    <span className="text-3xl mb-2">🌹</span>
                                    <span className="font-semibold text-gray-900">Flowers</span>
                                    <span className="text-sm text-rose-600">$3</span>
                                </button>
                                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all group">
                                    <span className="text-3xl mb-2">🙏</span>
                                    <span className="font-semibold text-gray-900">Prayer</span>
                                    <span className="text-sm text-blue-600">$2</span>
                                </button>
                                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100 hover:border-purple-300 transition-all group">
                                    <span className="text-3xl mb-2">💐</span>
                                    <span className="font-semibold text-gray-900">Bouquet</span>
                                    <span className="text-sm text-purple-600">$7</span>
                                </button>
                            </div>
                        </div>

                        {/* Sacred Offerings Section 2 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Sacred Offerings</h3>
                            <p className="text-gray-500 mb-6">The greatest gift — a prayer from the Church</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button className="flex items-center gap-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 hover:border-indigo-300 transition-all text-left">
                                    <span className="text-4xl">📿</span>
                                    <div>
                                        <div className="font-semibold text-gray-900">Rosary</div>
                                        <div className="text-sm text-indigo-600">$5 - $15</div>
                                    </div>
                                </button>
                                <Link
                                    href={`/mass-offerings?memorial=${memorial.id}&intention=${encodeURIComponent(`For the repose of the soul of ${fullName}`)}`}
                                    className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all text-left"
                                >
                                    <span className="text-4xl">✝️</span>
                                    <div>
                                        <div className="font-semibold text-gray-900">Holy Mass</div>
                                        <div className="text-sm text-blue-600">$25</div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                                </Link>
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
                                <button className="p-5 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 transition-all text-left">
                                    <div className="font-bold text-gray-900">Garden of Grace</div>
                                    <p className="text-sm text-gray-500 mb-2">3 candles + 1 rosary + prayer card</p>
                                    <div className="text-amber-600 font-bold">$19</div>
                                </button>
                                <button className="p-5 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 transition-all text-left">
                                    <div className="font-bold text-gray-900">Heavenly Tribute</div>
                                    <p className="text-sm text-gray-500 mb-2">7 candles + 1 Mass + 1 rosary</p>
                                    <div className="text-amber-600 font-bold">$49</div>
                                </button>
                                <button className="p-5 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 transition-all text-left">
                                    <div className="font-bold text-gray-900">Eternal Peace</div>
                                    <p className="text-sm text-gray-500 mb-2">30 candles + 3 Masses + 3 rosaries + flowers</p>
                                    <div className="text-amber-600 font-bold">$99</div>
                                </button>
                                <button className="p-5 bg-white rounded-2xl border border-amber-200 hover:border-amber-400 transition-all text-left">
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

                        {/* Guestbook */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-blue-500" />
                                Guestbook
                            </h3>

                            {/* Add Message */}
                            <div className="mb-6">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Leave a message of remembrance..."
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                                    rows={3}
                                />
                                <button
                                    onClick={submitGuestbook}
                                    disabled={!newMessage.trim() || submitting}
                                    className="mt-2 px-6 py-2 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
                                >
                                    {submitting ? 'Posting...' : 'Post Message'}
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="space-y-4">
                                {memorial.guestbook.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">Be the first to leave a message.</p>
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
                            <button className="w-full py-2 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors">
                                Share Invitation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
