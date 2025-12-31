'use client';

import { useState, useEffect } from 'react';
import { Heart, Share2, Flag, CheckCircle, Filter, Loader2, MapPin, Clock, Facebook, Twitter, Copy, X, Globe, Sparkles } from 'lucide-react';
import { submitPrayerRequest, prayForRequest } from '@/app/actions/prayer';

export interface Prayer {
    id: string;
    content: string;
    category: string;
    visibility: string;
    user: { firstName: string | null; lastName: string | null } | null;
    prayerCount: number;
    createdAt: Date;
    isAnswered: boolean;
    country?: string;
}

const categories = ['All', 'Health', 'Family', 'Work', 'Finances', 'Relationships', 'Grief', 'Thanksgiving', 'Spiritual', 'World', 'Other'];

// Sample prayers with realistic data
const SAMPLE_PRAYERS: Prayer[] = [
    {
        id: 'sample-1',
        content: "Please pray for my mother's surgery tomorrow. We trust in God's healing power and ask for the surgeon's hands to be guided.",
        category: 'Health',
        visibility: 'public',
        user: { firstName: 'Maria', lastName: 'Santos' },
        prayerCount: 247,
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
        isAnswered: false,
        country: 'Philippines',
    },
    {
        id: 'sample-2',
        content: "For guidance in finding a new job opportunity that aligns with His will. I've been searching for 3 months and need His direction.",
        category: 'Work',
        visibility: 'public',
        user: { firstName: 'John', lastName: 'Davis' },
        prayerCount: 89,
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        isAnswered: false,
        country: 'United States',
    },
    {
        id: 'sample-3',
        content: "Thanksgiving for a safe delivery of our baby boy! God is good and we are so grateful for this blessing.",
        category: 'Thanksgiving',
        visibility: 'public',
        user: { firstName: 'Sarah', lastName: 'Miller' },
        prayerCount: 412,
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        isAnswered: true,
        country: 'Canada',
    },
    {
        id: 'sample-4',
        content: "Pray for peace in my family and reconciliation with my brother. We haven't spoken in years and I miss him deeply.",
        category: 'Family',
        visibility: 'public',
        user: null,
        prayerCount: 156,
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
        isAnswered: false,
        country: 'Ireland',
    },
    {
        id: 'sample-5',
        content: "For my son who is struggling with addiction. Please pray for his healing and strength to overcome this battle.",
        category: 'Health',
        visibility: 'public',
        user: { firstName: 'Patricia', lastName: 'O\'Connor' },
        prayerCount: 534,
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        isAnswered: false,
        country: 'United States',
    },
    {
        id: 'sample-6',
        content: "For all the victims of natural disasters around the world. May God protect and comfort them in these difficult times.",
        category: 'World',
        visibility: 'public',
        user: { firstName: 'Fr. Michael', lastName: 'Chen' },
        prayerCount: 892,
        createdAt: new Date(Date.now() - 1000 * 60 * 90),
        isAnswered: false,
        country: 'Singapore',
    },
];

const COUNTRIES = [
    'United States', 'Canada', 'United Kingdom', 'Ireland', 'Australia',
    'Philippines', 'India', 'Nigeria', 'Mexico', 'Brazil', 'Poland',
    'Italy', 'Spain', 'France', 'Germany', 'Other',
];

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export default function PrayerWallClient({ initialPrayers }: { initialPrayers: Prayer[] }) {
    const [prayers, setPrayers] = useState<Prayer[]>([...SAMPLE_PRAYERS, ...initialPrayers]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());
    const [liveCount, setLiveCount] = useState(1247);

    // Simulate live prayer count updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCount(prev => prev + Math.floor(Math.random() * 3));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredPrayers = selectedCategory === 'All'
        ? prayers
        : prayers.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

    const handlePray = async (prayerId: string) => {
        if (prayedIds.has(prayerId)) return;

        setPrayedIds(prev => new Set([...prev, prayerId]));
        setPrayers(current =>
            current.map(p =>
                p.id === prayerId ? { ...p, prayerCount: p.prayerCount + 1 } : p
            )
        );

        // Only call API for non-sample prayers
        if (!prayerId.startsWith('sample-')) {
            const result = await prayForRequest(prayerId);
            if (!result.success) {
                setPrayedIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(prayerId);
                    return newSet;
                });
                setPrayers(current =>
                    current.map(p =>
                        p.id === prayerId ? { ...p, prayerCount: p.prayerCount - 1 } : p
                    )
                );
            }
        }
    };

    const handleShare = (prayerId: string, platform: 'facebook' | 'twitter' | 'copy') => {
        const prayer = prayers.find(p => p.id === prayerId);
        if (!prayer) return;

        const shareText = `🙏 Please join me in prayer: "${prayer.content.substring(0, 100)}..." - Pray with us on MyPrayerTower`;
        const shareUrl = `https://myprayertower.com/prayer-wall?prayer=${prayerId}`;

        if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        } else {
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            alert('Link copied to clipboard!');
        }
        setShowShareModal(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const result = await submitPrayerRequest(null, formData);

        setIsSubmitting(false);
        if (result.success) {
            setShowSubmitModal(false);
            window.location.reload();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white pt-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-600 via-sacred-700 to-sacred-800 text-white py-16 relative overflow-hidden">
                {/* Background orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-15"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-sm font-medium text-gold-200">{liveCount.toLocaleString()} prayers this week</span>
                    </div>

                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                        🙏 Global Prayer Wall
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                        Share your prayer intentions and join believers worldwide in united prayer.
                        Together, we lift each other up to God.
                    </p>
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gold-500/30"
                    >
                        <Sparkles className="w-5 h-5 inline mr-2" />
                        Submit Prayer Request
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-sacred-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Prayer Cards */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-5">
                    {filteredPrayers.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No prayers found in this category. Be the first to share!
                        </div>
                    ) : (
                        filteredPrayers.map((prayer) => (
                            <div
                                key={prayer.id}
                                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 ${prayer.isAnswered ? 'border-2 border-green-200 bg-green-50/30' : ''
                                    }`}
                            >
                                {/* Answered Badge */}
                                {prayer.isAnswered && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-3">
                                        <CheckCircle className="w-4 h-4" />
                                        Prayer Answered! 🎉
                                    </div>
                                )}

                                {/* Content */}
                                <p className="text-gray-800 text-lg leading-relaxed mb-4 font-serif">
                                    &quot;{prayer.content}&quot;
                                </p>

                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                                    <span className="font-semibold text-gray-700">
                                        {prayer.user ? `${prayer.user.firstName} ${prayer.user.lastName?.charAt(0)}.` : 'Anonymous'}
                                    </span>
                                    {prayer.country && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Globe className="w-3.5 h-3.5" />
                                                {prayer.country}
                                            </span>
                                        </>
                                    )}
                                    <span>•</span>
                                    <span className="px-2 py-0.5 bg-sacred-100 text-sacred-700 rounded-full text-xs font-medium">
                                        {prayer.category}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {getTimeAgo(prayer.createdAt)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <button
                                        onClick={() => handlePray(prayer.id)}
                                        disabled={prayedIds.has(prayer.id)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all ${prayedIds.has(prayer.id)
                                                ? 'bg-green-100 text-green-700 cursor-default'
                                                : 'bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white shadow-md hover:shadow-lg active:scale-95'
                                            }`}
                                    >
                                        {prayedIds.has(prayer.id) ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Prayed</span>
                                            </>
                                        ) : (
                                            <>
                                                🙏 <span>Pray Now</span>
                                            </>
                                        )}
                                        <span className={`ml-1 px-2 py-0.5 rounded-full text-sm ${prayedIds.has(prayer.id) ? 'bg-green-200' : 'bg-white/20'
                                            }`}>
                                            {prayer.prayerCount}
                                        </span>
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowShareModal(prayer.id)}
                                            className="p-2.5 text-gray-400 hover:text-sacred-600 hover:bg-sacred-50 rounded-xl transition-colors"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                        <button className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                            <Flag className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Share Modal */}
                                {showShareModal === prayer.id && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-gray-700">Share this prayer</span>
                                            <button onClick={() => setShowShareModal(null)} className="text-gray-400 hover:text-gray-600">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleShare(prayer.id, 'facebook')}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-lg transition-colors"
                                            >
                                                <Facebook className="w-4 h-4" />
                                                Facebook
                                            </button>
                                            <button
                                                onClick={() => handleShare(prayer.id, 'twitter')}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1da1f2] hover:bg-[#1a94da] text-white rounded-lg transition-colors"
                                            >
                                                <Twitter className="w-4 h-4" />
                                                Twitter
                                            </button>
                                            <button
                                                onClick={() => handleShare(prayer.id, 'copy')}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                                            >
                                                <Copy className="w-4 h-4" />
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )))}
                </div>

                {/* Load More */}
                {filteredPrayers.length >= 10 && (
                    <div className="text-center mt-8">
                        <button className="px-8 py-3 border-2 border-sacred-600 text-sacred-600 hover:bg-sacred-50 font-semibold rounded-full transition-colors">
                            Load More Prayers
                        </button>
                    </div>
                )}
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-display font-bold text-gray-900">Submit Prayer Request</h2>
                            <button onClick={() => setShowSubmitModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sacred-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country
                                    </label>
                                    <select
                                        name="country"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sacred-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Select country</option>
                                        {COUNTRIES.map((country) => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Prayer Intention *
                                </label>
                                <textarea
                                    name="content"
                                    required
                                    minLength={5}
                                    rows={4}
                                    placeholder="Share your prayer request with our global community..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sacred-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select name="category" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sacred-500 focus:border-transparent bg-white">
                                    {categories.filter(c => c !== 'All').map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Visibility
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="radio" name="visibility" value="public" defaultChecked className="text-sacred-600 focus:ring-sacred-500" />
                                        <div>
                                            <span className="font-medium">🌍 Public</span>
                                            <p className="text-sm text-gray-500">Visible to everyone with your name</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="radio" name="visibility" value="anonymous" className="text-sacred-600 focus:ring-sacred-500" />
                                        <div>
                                            <span className="font-medium">👤 Anonymous</span>
                                            <p className="text-sm text-gray-500">Visible to everyone, name hidden</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="radio" name="visibility" value="private" className="text-sacred-600 focus:ring-sacred-500" />
                                        <div>
                                            <span className="font-medium">🔒 Private</span>
                                            <p className="text-sm text-gray-500">Only you and admins can see</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitModal(false)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-sacred-600 to-sacred-700 hover:from-sacred-500 hover:to-sacred-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Request'}
                                </button>
                            </div>
                        </form>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            All prayer requests are reviewed by our team before publishing.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
