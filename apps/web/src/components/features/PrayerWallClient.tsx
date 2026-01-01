'use client';

import { useState, useEffect } from 'react';
import { Heart, Share2, Flag, CheckCircle, Filter, Loader2, MapPin, Clock, Facebook, Twitter, Copy, X, Globe, Sparkles, Church, Flame } from 'lucide-react';
import { submitPrayerRequest, prayForRequest } from '@/app/actions/prayer';
import Link from 'next/link';
import { MassOfferingCTA } from '@/components/giving/MassOfferingCTA';
import { MasonryGrid } from '@/components/ui/MasonryGrid';
import { cn } from '@/lib/utils'; // Assuming you have this utility

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

// Category color mappings for gradient borders
const categoryColors: Record<string, string> = {
    Health: 'from-emerald-400 to-teal-500',
    Family: 'from-rose-400 to-pink-500',
    Work: 'from-blue-400 to-indigo-500',
    Thanksgiving: 'from-amber-400 to-orange-500',
    Spiritual: 'from-violet-400 to-purple-500',
    default: 'from-gray-400 to-slate-500'
};

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
        <div className="min-h-screen bg-[#FDFBF7] pt-20">
            {/* Header */}
            <div className="relative mb-8 pb-10">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-[#FDFBF7] h-96 z-0" />
                <div className="container mx-auto px-4 relative z-10 text-center pt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/50 border border-indigo-200 text-indigo-800 text-sm font-medium mb-6 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="tabular-nums">{liveCount.toLocaleString()}</span> prayers offered this week
                    </div>

                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                        Global Prayer Wall
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Join thousands of believers lifting each other up. Your prayer can change a life today.
                    </p>

                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="px-8 py-4 bg-gray-900 text-white font-medium rounded-full shadow-xl shadow-gray-200 transform transition-all hover:scale-105 hover:bg-black active:scale-95 flex items-center gap-2 mx-auto"
                    >
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        Share Your Prayer Request
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-y border-gray-100/50 py-3 mb-8 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                                    selectedCategory === cat
                                        ? "bg-gray-900 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Prayer Grid */}
            <div className="container mx-auto px-4 pb-20">
                {filteredPrayers.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No prayers found</h3>
                        <p className="text-gray-500">Be the first to share a prayer in this category.</p>
                    </div>
                ) : (
                    <MasonryGrid columns={{ default: 1, md: 2, lg: 3 }} gap={24}>
                        {filteredPrayers.map((prayer) => (
                            <div
                                key={prayer.id}
                                className={cn(
                                    "relative bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100 group",
                                    prayer.isAnswered && "bg-green-50/50 border-green-100"
                                )}
                                style={{
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                                }}
                            >
                                {/* Category Gradient Line */}
                                <div className={cn(
                                    "absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r opacity-60",
                                    categoryColors[prayer.category] || categoryColors.default
                                )} />

                                {/* Header */}
                                <div className="flex items-start justify-between mb-4 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <div className={cn("w-2 h-2 rounded-full", prayer.isAnswered ? "bg-green-500" : "bg-gray-300")} />
                                        <span className="font-medium text-gray-900">
                                            {prayer.user ? `${prayer.user.firstName} ${prayer.user.lastName?.charAt(0)}.` : 'Anonymous'}
                                        </span>
                                        {prayer.country && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-xs">{prayer.country}</span>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {getTimeAgo(prayer.createdAt)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="mb-6 relative">
                                    <p className="text-gray-800 text-lg leading-relaxed font-serif">
                                        "{prayer.content}"
                                    </p>
                                    {prayer.isAnswered && (
                                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Answered
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handlePray(prayer.id)}
                                            disabled={prayedIds.has(prayer.id)}
                                            className={cn(
                                                "group/btn relative overflow-hidden px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 text-sm",
                                                prayedIds.has(prayer.id)
                                                    ? "bg-amber-50 text-amber-700 cursor-default pl-4"
                                                    : "bg-gray-900 text-white hover:bg-black hover:shadow-lg active:scale-95"
                                            )}
                                        >
                                            {prayedIds.has(prayer.id) ? (
                                                <>
                                                    <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
                                                    <span>Prayed</span>
                                                    <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-xs ml-1">
                                                        {prayer.prayerCount}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        <Flame className="w-4 h-4 text-amber-300 group-hover/btn:animate-pulse" />
                                                        <span>I'll Pray</span>
                                                    </span>
                                                    <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-xs ml-1 relative z-10">
                                                        {prayer.prayerCount}
                                                    </span>
                                                    {/* Button Shine Effect */}
                                                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                                </>
                                            )}
                                        </button>

                                        {/* Subtle Mass Offering Link */}
                                        {prayedIds.has(prayer.id) && (
                                            <Link
                                                href={`/mass-offerings?intention=${encodeURIComponent(prayer.content.substring(0, 50))}`}
                                                className="flex items-center gap-1.5 text-[10px] text-amber-600 hover:text-amber-700 transition-colors bg-amber-50 px-2 py-1 rounded-md animate-fade-in"
                                            >
                                                <Church className="w-3 h-3" />
                                                Offer Mass
                                            </Link>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setShowShareModal(prayer.id)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                            title="Share"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                                            title="Report"
                                        >
                                            <Flag className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </MasonryGrid>
                )}

                {/* Mass Offering CTA Banner */}
                <div className="max-w-4xl mx-auto mt-20 px-4">
                    <MassOfferingCTA variant="banner" context="prayer" />
                </div>

                {/* Load More */}
                {filteredPrayers.length >= 10 && (
                    <div className="text-center mt-12 pb-12">
                        <button className="px-8 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-full transition-all duration-300">
                            Load More Prayers
                        </button>
                    </div>
                )}
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-serif font-bold text-gray-900">New Prayer Request</h2>
                            <button onClick={() => setShowSubmitModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Given Name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <select
                                        name="country"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                    >
                                        <option value="">Select...</option>
                                        {COUNTRIES.map((country) => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Prayer Intention *
                                </label>
                                <textarea
                                    name="content"
                                    required
                                    minLength={5}
                                    rows={4}
                                    placeholder="Share your heart. What should we pray for?"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none transition-all bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <select name="category" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white">
                                    {categories.filter(c => c !== 'All').map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Privacy Settings
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all peer-checked:border-gray-900">
                                        <input type="radio" name="visibility" value="public" defaultChecked className="w-5 h-5 text-gray-900 focus:ring-gray-900" />
                                        <div>
                                            <span className="font-semibold text-gray-900 block">🌍 Public Prayer</span>
                                            <span className="text-sm text-gray-500">Shared with the global community</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                                        <input type="radio" name="visibility" value="anonymous" className="w-5 h-5 text-gray-900 focus:ring-gray-900" />
                                        <div>
                                            <span className="font-semibold text-gray-900 block">👤 Anonymous</span>
                                            <span className="text-sm text-gray-500">Shared publicly, but your name is hidden</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitModal(false)}
                                    className="flex-1 py-4 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Prayer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
