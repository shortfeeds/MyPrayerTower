'use client';

import { useState, useEffect } from 'react';
import { Heart, Share2, Flag, CheckCircle, Filter, Loader2, MapPin, Clock, Facebook, Twitter, Copy, X, Globe, Sparkles, Church, Bookmark, MessageCircle, Search, ShieldAlert } from 'lucide-react';
import { useSpiritualJourney } from '@/components/journey/SpiritualJourneyProvider';
import { submitPrayerRequest, prayForRequest, markPrayerAnswered, reportPrayer, getPrayerRequests } from '@/app/actions/prayer';
import Link from 'next/link';
import { MassOfferingCTA } from '@/components/giving/MassOfferingCTA';
import confetti from 'canvas-confetti';
import { PrayerCardSkeleton } from '@/components/ui/SkeletonLoaders';
import { ClosingPrayerModal, ReportModal, AnsweredModal } from './PrayerInteractionModals';
import { SmartAdSlot } from '@/components/ads';

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
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ON_HOLD' | 'ARCHIVED';
}

const categories = ['All', 'Health', 'Family', 'Work', 'Finances', 'Relationships', 'Grief', 'Thanksgiving', 'Spiritual', 'World', 'Other'];

// ... (Keep SAMPLE_PRAYERS and COUNTRIES) ...

// Sample prayers with realistic data - older requests have higher prayer counts
const SAMPLE_PRAYERS: Prayer[] = [
    // Oldest/Most Prayed (500-900+ prayers)
    { id: 's-1', content: "For all the victims of natural disasters around the world. May God protect and comfort them in these difficult times.", category: 'World', visibility: 'public', user: { firstName: 'Fr. Michael', lastName: 'Chen' }, prayerCount: 892, createdAt: new Date(Date.now() - 1000 * 60 * 180), isAnswered: false, country: 'Singapore' },
    { id: 's-2', content: "For my son who is struggling with addiction. Please pray for his healing and strength to overcome this battle.", category: 'Health', visibility: 'public', user: { firstName: 'Patricia', lastName: "O'Connor" }, prayerCount: 756, createdAt: new Date(Date.now() - 1000 * 60 * 150), isAnswered: false, country: 'United States' },
    { id: 's-3', content: "For the conversion of sinners worldwide and for peace in our troubled world. Lord, have mercy on us.", category: 'Spiritual', visibility: 'public', user: { firstName: 'Sr. Teresa', lastName: 'Marie' }, prayerCount: 634, createdAt: new Date(Date.now() - 1000 * 60 * 120), isAnswered: false, country: 'Poland' },
    { id: 's-4', content: "For all single mothers struggling to provide for their children. God bless them with strength and provision.", category: 'Family', visibility: 'public', user: null, prayerCount: 589, createdAt: new Date(Date.now() - 1000 * 60 * 100), isAnswered: false, country: 'Nigeria' },

    // Medium-High (300-500 prayers)
    { id: 's-5', content: "Thanksgiving for a safe delivery of our baby boy! God is good and we are so grateful for this blessing.", category: 'Thanksgiving', visibility: 'public', user: { firstName: 'Sarah', lastName: 'Miller' }, prayerCount: 478, createdAt: new Date(Date.now() - 1000 * 60 * 90), isAnswered: true, country: 'Canada' },
    { id: 's-6', content: "For my husband's cancer treatment. The doctors say Stage 3, but we believe in God's healing power.", category: 'Health', visibility: 'public', user: { firstName: 'Maria', lastName: 'Garcia' }, prayerCount: 423, createdAt: new Date(Date.now() - 1000 * 60 * 80), isAnswered: false, country: 'Mexico' },
    { id: 's-7', content: "For all priests and religious facing persecution. May God give them courage and protection.", category: 'Spiritual', visibility: 'public', user: { firstName: 'Deacon John', lastName: 'Murphy' }, prayerCount: 367, createdAt: new Date(Date.now() - 1000 * 60 * 70), isAnswered: false, country: 'Ireland' },
    { id: 's-8', content: "For my daughter starting university abroad. Keep her safe and strengthen her faith.", category: 'Family', visibility: 'public', user: { firstName: 'Angela', lastName: 'Nwosu' }, prayerCount: 312, createdAt: new Date(Date.now() - 1000 * 60 * 65), isAnswered: false, country: 'Nigeria' },

    // Medium (150-300 prayers)
    { id: 's-9', content: "Please pray for my grandmother in hospice care. She's been a pillar of faith for our family.", category: 'Health', visibility: 'public', user: { firstName: 'Anthony', lastName: 'Romano' }, prayerCount: 267, createdAt: new Date(Date.now() - 1000 * 60 * 55), isAnswered: false, country: 'Italy' },
    { id: 's-10', content: "Pray for peace in my family and reconciliation with my brother. We haven't spoken in years.", category: 'Family', visibility: 'public', user: null, prayerCount: 198, createdAt: new Date(Date.now() - 1000 * 60 * 50), isAnswered: false, country: 'Ireland' },
    { id: 's-11', content: "For wisdom as we make a difficult decision about our family business. May God's will be done.", category: 'Work', visibility: 'public', user: { firstName: 'Robert', lastName: 'Kim' }, prayerCount: 176, createdAt: new Date(Date.now() - 1000 * 60 * 45), isAnswered: false, country: 'South Korea' },
    { id: 's-12', content: "For all expecting mothers, especially those at risk. May St. Gerard intercede for their safety.", category: 'Health', visibility: 'public', user: { firstName: 'Lisa', lastName: 'Thompson' }, prayerCount: 156, createdAt: new Date(Date.now() - 1000 * 60 * 40), isAnswered: false, country: 'Australia' },

    // Lower-Medium (80-150 prayers)
    { id: 's-13', content: "For my upcoming job interview on Thursday. I've been unemployed for 6 months and trusting in God.", category: 'Work', visibility: 'public', user: { firstName: 'David', lastName: 'Wilson' }, prayerCount: 134, createdAt: new Date(Date.now() - 1000 * 60 * 35), isAnswered: false, country: 'United Kingdom' },
    { id: 's-14', content: "Thanksgiving for answered prayers! My surgery went well and doctors are happy with results.", category: 'Thanksgiving', visibility: 'public', user: { firstName: 'James', lastName: 'Okafor' }, prayerCount: 112, createdAt: new Date(Date.now() - 1000 * 60 * 30), isAnswered: true, country: 'Nigeria' },
    { id: 's-15', content: "For the souls of my parents who recently passed. May perpetual light shine upon them.", category: 'Grief', visibility: 'public', user: null, prayerCount: 98, createdAt: new Date(Date.now() - 1000 * 60 * 25), isAnswered: false, country: 'Philippines' },
    { id: 's-16', content: "For guidance in finding a new job opportunity that aligns with His will. Searching for 3 months.", category: 'Work', visibility: 'public', user: { firstName: 'John', lastName: 'Davis' }, prayerCount: 89, createdAt: new Date(Date.now() - 1000 * 60 * 20), isAnswered: false, country: 'United States' },

    // Recent (20-80 prayers)
    { id: 's-17', content: "Please pray for my exam results coming out tomorrow. I studied hard but I'm very nervous.", category: 'Work', visibility: 'public', user: { firstName: 'Anna', lastName: 'Kowalski' }, prayerCount: 67, createdAt: new Date(Date.now() - 1000 * 60 * 15), isAnswered: false, country: 'Poland' },
    { id: 's-18', content: "For healing in my marriage. We're going through a difficult time but believe God can restore us.", category: 'Relationships', visibility: 'public', user: null, prayerCount: 53, createdAt: new Date(Date.now() - 1000 * 60 * 10), isAnswered: false, country: 'Brazil' },
    { id: 's-19', content: "Please pray for my mother's surgery tomorrow. We trust in God's healing power.", category: 'Health', visibility: 'public', user: { firstName: 'Maria', lastName: 'Santos' }, prayerCount: 34, createdAt: new Date(Date.now() - 1000 * 60 * 5), isAnswered: false, country: 'Philippines' },
    { id: 's-20', content: "For protection during my travels to see family for the holidays. St. Christopher, pray for us.", category: 'Other', visibility: 'public', user: { firstName: 'Michael', lastName: 'Brown' }, prayerCount: 21, createdAt: new Date(Date.now() - 1000 * 60 * 2), isAnswered: false, country: 'United States' },
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

export default function PrayerWallClient({ initialPrayers, currentUserId }: { initialPrayers: Prayer[], currentUserId?: string }) {
    const [prayers, setPrayers] = useState<Prayer[]>([...SAMPLE_PRAYERS, ...initialPrayers]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    // ... (Keep existing state)
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());
    const [liveCount, setLiveCount] = useState(21247);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(2);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { triggerSacredMoment } = useSpiritualJourney();

    // -- New Modal States --
    const [closingPrayerFor, setClosingPrayerFor] = useState<Prayer | null>(null);
    const [reportingPrayerId, setReportingPrayerId] = useState<string | null>(null);
    const [answeringPrayerId, setAnsweringPrayerId] = useState<string | null>(null);

    // Load saved prayers from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('mpt-saved-prayers');
        if (saved) {
            const parsed = JSON.parse(saved);
            setSavedIds(new Set(parsed.map((p: any) => p.id)));
        }
    }, []);

    const toggleSave = (prayer: Prayer) => {
        const newSavedIds = new Set(savedIds);
        let currentSaved: any[] = [];
        try {
            currentSaved = JSON.parse(localStorage.getItem('mpt-saved-prayers') || '[]');
        } catch (e) { currentSaved = []; }

        if (newSavedIds.has(prayer.id)) {
            newSavedIds.delete(prayer.id);
            currentSaved = currentSaved.filter((p: any) => p.id !== prayer.id);
            alert("Removed from Saved Prayers");
        } else {
            newSavedIds.add(prayer.id);
            currentSaved.unshift({ ...prayer, savedAt: new Date() });
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
                colors: ['#FFD700', '#FFFFFF']
            });
            // alert("Saved to your Prayer Corner!");
        }

        setSavedIds(newSavedIds);
        localStorage.setItem('mpt-saved-prayers', JSON.stringify(currentSaved));
    };

    // Simulate live prayer count updates - always stays above 20,000
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCount(prev => {
                const newCount = prev + Math.floor(Math.random() * 3) + 1;
                return Math.max(20000, newCount); // Never go below 20,000
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredPrayers = selectedCategory === 'All'
        ? prayers
        : prayers.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

    const handlePray = async (prayerId: string) => {
        if (prayedIds.has(prayerId)) return;

        // Find the prayer for the modal
        const prayer = prayers.find(p => p.id === prayerId);
        if (prayer) {
            triggerSacredMoment('prayer');
            // setClosingPrayerFor(prayer); // Replaced by global modal
        }

        setPrayedIds(prev => new Set(Array.from(prev).concat([prayerId])));
        setPrayers(current =>
            current.map(p =>
                p.id === prayerId ? { ...p, prayerCount: p.prayerCount + 1 } : p
            )
        );

        // Only call API for non-sample prayers
        if (!prayerId.startsWith('sample-') && !prayerId.startsWith('s-')) {
            const result = await prayForRequest(prayerId);
            if (!result.success) {
                // Revert on failure
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

    // Called when user clicks "Amen" in the modal
    const handleClosingPrayerAmen = () => {
        setClosingPrayerFor(null);
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#FFD700', '#87CEEB', '#ffffff']
        });
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

    const handleReport = (prayerId: string) => {
        setReportingPrayerId(prayerId);
    };

    const submitReport = async (details: string) => {
        if (!reportingPrayerId) return;
        await reportPrayer(reportingPrayerId, details);
        alert("Thank you. We have received your report and will review it.");
        setReportingPrayerId(null);
    }

    const handleMarkAnswered = (prayerId: string) => {
        setAnsweringPrayerId(prayerId);
    };

    const submitAnswered = async (testimony: string) => {
        if (!answeringPrayerId) return;

        // Optimistic update
        setPrayers(current =>
            current.map(p =>
                p.id === answeringPrayerId ? { ...p, isAnswered: true } : p
            )
        );

        const result = await markPrayerAnswered(answeringPrayerId); // Note: server action doesn't take testimony yet, but we'll add it or log it later. 
        // For now, focusing on UX flow. 

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#ffffff']
        });

        setAnsweringPrayerId(null);
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

    const handleLoadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const category = selectedCategory === 'All' ? undefined : selectedCategory;
            const result = await getPrayerRequests(page, 10, category);

            if (result.prayers.length > 0) {
                setPrayers(prev => {
                    // Deduplicate based on ID to avoid issues with mixed sample data
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNew = result.prayers.filter((p: any) => !existingIds.has(p.id));
                    return [...prev, ...uniqueNew];
                });
                setPage(p => p + 1);
            }
            // If we got fewer than requested, we might be done
            if (result.prayers.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(!!result.hasMore);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white pt-28 pb-16 relative overflow-hidden">
                {/* Background orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-600 rounded-full blur-[100px] opacity-15"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-5"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8 shadow-xl">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-amber-100 tracking-wide">{liveCount.toLocaleString()} prayers this week</span>
                    </div>

                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Global Prayer Wall
                    </h1>
                    <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Share your intentions. Join the global chorus of prayer. <br className="hidden md:block" />
                        Together, we lift each other up to the Heavens.
                    </p>
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 rounded-full bg-white/20 group-hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 duration-500" />
                        <Sparkles className="w-5 h-5" />
                        <span>Submit Prayer Request</span>
                    </button>
                    <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest font-medium">Join {liveCount.toLocaleString()} warriors in faith</p>
                </div>
            </div>

            {/* Categories (Mobile Only) */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm lg:hidden">
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

            {/* Main Content Layout */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Prayer Grid */}
                    <div className="flex-1">
                        {/* Desktop Title/Filter Status (Optional) */}
                        <div className="hidden lg:flex items-center justify-between mb-6">
                            <h2 className="font-display text-2xl font-bold text-gray-800 flex items-center gap-2">
                                {selectedCategory === 'All' ? 'Latest Prayers' : `${selectedCategory} Prayers`}
                                <span className="text-sm font-sans font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {filteredPrayers.length}
                                </span>
                            </h2>
                        </div>

                        {filteredPrayers.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">No prayers found</h3>
                                <p className="text-gray-500">Be the first to share a prayer in this category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredPrayers.map((prayer, index) => (
                                    <div
                                        key={prayer.id}
                                        className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col ${prayer.isAnswered ? 'border-2 border-green-200 bg-green-50/30' :
                                            prayer.status === 'ARCHIVED' ? 'opacity-75 bg-gray-50 border-gray-200' : ''
                                            }`}
                                    >
                                        {/* Answered Badge */}
                                        {prayer.isAnswered && (
                                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-3">
                                                <CheckCircle className="w-4 h-4" />
                                                Answered!
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="flex-1">
                                            <p className="text-gray-800 text-lg leading-relaxed mb-4 font-serif">
                                                &quot;{prayer.content}&quot;
                                            </p>
                                        </div>

                                        {/* Meta */}
                                        <div className="mt-auto">
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4 border-t border-gray-50 pt-3">
                                                <span className="font-semibold text-gray-700">
                                                    {prayer.user ? `${prayer.user.firstName} ${prayer.user.lastName?.charAt(0)}.` : 'Anonymous'}
                                                </span>
                                                {prayer.country && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Globe className="w-3 h-3" />
                                                            {prayer.country}
                                                        </span>
                                                    </>
                                                )}
                                                <span>•</span>
                                                <span className="px-2 py-0.5 bg-sacred-100 text-sacred-700 rounded-full text-xs font-medium">
                                                    {prayer.category}
                                                </span>
                                                <span className="ml-auto flex items-center gap-1 text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {getTimeAgo(prayer.createdAt)}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between pt-2">
                                                <button
                                                    onClick={() => handlePray(prayer.id)}
                                                    disabled={prayedIds.has(prayer.id) || prayer.status === 'ARCHIVED'}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${prayer.status === 'ARCHIVED'
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : prayedIds.has(prayer.id)
                                                            ? 'bg-green-100 text-green-700 cursor-default'
                                                            : 'bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white shadow-md'
                                                        }`}
                                                >
                                                    {prayer.status === 'ARCHIVED' ? (
                                                        <span>Archived</span>
                                                    ) : prayedIds.has(prayer.id) ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3" />
                                                            <span>Prayed</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            🙏 <span>Pray</span>
                                                        </>
                                                    )}
                                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${prayedIds.has(prayer.id) ? 'bg-green-200' : 'bg-white/20'
                                                        }`}>
                                                        {prayer.prayerCount}
                                                    </span>
                                                </button>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => toggleSave(prayer)}
                                                        className={`p-2 rounded-lg transition-colors ${savedIds.has(prayer.id)
                                                            ? 'text-gold-600 bg-gold-50'
                                                            : 'text-gray-400 hover:text-gold-600 hover:bg-gold-50'
                                                            }`}
                                                    >
                                                        <Bookmark className={`w-4 h-4 ${savedIds.has(prayer.id) ? 'fill-current' : ''}`} />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowShareModal(prayer.id)}
                                                        className="p-2 text-gray-400 hover:text-sacred-600 hover:bg-sacred-50 rounded-lg transition-colors"
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReport(prayer.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Report"
                                                    >
                                                        <Flag className="w-4 h-4" />
                                                    </button>

                                                    {/* Owner Actions */}
                                                    {currentUserId && prayer.userId === currentUserId && !prayer.isAnswered && (
                                                        <button
                                                            onClick={() => handleMarkAnswered(prayer.id)}
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Mark as Answered"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* CTA after praying */}
                                            {prayedIds.has(prayer.id) && (
                                                <div className="mt-3 text-center">
                                                    <Link
                                                        href={`/mass-offerings?intention=${encodeURIComponent(prayer.content.substring(0, 50))}`}
                                                        className="text-[10px] text-amber-600 hover:text-amber-700 font-medium hover:underline inline-flex items-center gap-1"
                                                    >
                                                        <Church className="w-3 h-3" />
                                                        Offer a Mass for this intention
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination/Load More */}
                        {hasMore && filteredPrayers.length >= 10 && (
                            <div className="text-center mt-12">
                                {loadingMore ? (
                                    <div className="flex justify-center p-4">
                                        <Loader2 className="w-6 h-6 animate-spin text-sacred-500" />
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleLoadMore}
                                        className="px-8 py-3 bg-white border border-gray-200 hover:border-sacred-300 text-gray-600 hover:text-sacred-600 font-medium rounded-xl shadow-sm hover:shadow-md transition-all"
                                    >
                                        Load More Prayers
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="mt-8">
                            <MassOfferingCTA variant="banner" context="prayer" />
                        </div>
                    </div>

                    {/* Right Sidebar (Desktop) */}
                    <aside className="hidden lg:block w-80 space-y-8 flex-shrink-0">

                        {/* Sidebar: Categories */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                            <h3 className="font-display font-bold text-lg mb-4 text-gray-900 border-b border-gray-100 pb-2">
                                Categories
                            </h3>
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${selectedCategory === cat
                                            ? 'bg-sacred-50 text-sacred-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span>{cat}</span>
                                        {selectedCategory === cat && <CheckCircle className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowSubmitModal(true)}
                                    className="w-full py-3 bg-gradient-to-r from-sacred-600 to-sacred-700 hover:from-sacred-500 hover:to-sacred-600 text-white font-bold rounded-xl shadow-lg shadow-sacred-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Post a Prayer
                                </button>
                            </div>
                        </div>

                        {/* Sidebar: Ad */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                            <span className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Sponsored</span>
                            <SmartAdSlot page="prayer-wall" position="sidebar" />
                        </div>

                        {/* Sidebar: Community Stats */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-gold-400" />
                                World Prayer
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Live Prayers</div>
                                    <div className="text-2xl font-bold font-mono text-gold-400">
                                        {liveCount.toLocaleString()}
                                    </div>
                                </div>
                                <div className="h-px bg-white/10" />
                                <p className="text-sm text-gray-300 italic">
                                    "For where two or three are gathered in my name, there am I among them."
                                    <span className="block mt-1 text-xs text-gray-500">- Matthew 18:20</span>
                                </p>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>

            {/* Submit Modal */}
            {
                showSubmitModal && (
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
                                        {/* Honeypot for spam bots */}
                                        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
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
                )
            }
            {/* Closing Prayer Modal - Replaced by Global SacredMomentModal */}
            {/* <ClosingPrayerModal ... /> */}

            {/* Report Modal */}
            <ReportModal
                isOpen={!!reportingPrayerId}
                onClose={() => setReportingPrayerId(null)}
                onSubmit={submitReport}
            />

            {/* Answered Prayer Modal */}
            <AnsweredModal
                isOpen={!!answeringPrayerId}
                onClose={() => setAnsweringPrayerId(null)}
                onSubmit={submitAnswered}
            />
        </div>
    );
}
