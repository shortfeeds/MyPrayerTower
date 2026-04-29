'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Sun, Share2, ExternalLink, Volume2, Clock, Loader2, Sparkles } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';
import Link from 'next/link';
import { MassOfferingCTA } from '@/components/giving/MassOfferingCTA';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { ShareButtons } from '@/components/social/ShareButtons';

interface Reading {
    type: string;
    citation: string;
    text: string;
}

interface DailyReadingData {
    date: string;
    season: string;
    title: string;
    readings: Reading[];
    sourceUrl: string;
}

interface LiturgicalCelebration {
    key: string;
    name: string;
    rank: string;
    rankName: string;
    color: string;
    colorHex: string;
    seasonName: string;
}

interface LiturgicalData {
    date: string;
    season: string;
    seasonColor: string;
    celebrations: LiturgicalCelebration[];
    isHolyDayOfObligation: boolean;
}

// Feast rank badge styling
const getRankStyle = (rank: string) => {
    switch (rank) {
        case 'SOLEMNITY':
            return 'bg-amber-500/20 text-amber-100 border-amber-400/30';
        case 'FEAST':
            return 'bg-purple-500/20 text-purple-100 border-purple-400/30';
        case 'MEMORIAL':
            return 'bg-blue-500/20 text-blue-100 border-blue-400/30';
        default:
            return 'bg-white/10 text-white/80 border-white/20';
    }
};

export default function ReadingsPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('lg');
    const [data, setData] = useState<DailyReadingData | null>(null);
    const [liturgical, setLiturgical] = useState<LiturgicalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeReading, setActiveReading] = useState(0);

    const goToToday = () => setCurrentDate(new Date());
    const nextDay = () => setCurrentDate(addDays(currentDate, 1));
    const prevDay = () => setCurrentDate(subDays(currentDate, 1));

    useEffect(() => {
        setLoading(true);
        const dateStr = format(currentDate, 'yyyy-MM-dd');

        // Fetch both readings and liturgical data in parallel
        Promise.all([
            fetch(`/api/readings?date=${dateStr}`).then(res => res.json()),
            fetch(`/api/calendar/liturgical?date=${dateStr}`).then(res => res.json()).catch(() => null)
        ])
            .then(([readingsData, liturgicalData]) => {
                setData(readingsData);
                setLiturgical(liturgicalData);
                setActiveReading(0);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [currentDate]);

    const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');

    // Get liturgical color for styling (default to green for Ordinary Time)
    const liturgicalColor = liturgical?.seasonColor || '#008000';
    const primaryCelebration = liturgical?.celebrations?.[0];


    const fontSizeClasses = {
        sm: 'text-base',
        base: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl'
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 text-white pt-28 pb-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <BookOpen className="w-4 h-4" />
                        <span>Catholic Daily Readings</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Daily Mass Readings
                    </h1>
                    <p className="text-xl text-green-100 mb-8 max-w-xl mx-auto">
                        Scripture readings for the Holy Mass following the Roman Rite liturgical calendar.
                    </p>

                    {/* Date Navigation */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={prevDay}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="min-w-[250px]">
                            <p className="text-2xl font-bold">{format(currentDate, 'MMMM d, yyyy')}</p>
                            <p className="text-green-200 text-sm">{format(currentDate, 'EEEE')}</p>
                        </div>

                        <button
                            onClick={nextDay}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {!isToday(currentDate) && (
                        <button
                            onClick={goToToday}
                            className="mt-4 text-sm text-green-200 hover:text-white underline"
                        >
                            Go to Today
                        </button>
                    )}
                </div>
            </div>

            {/* Liturgical Season Banner with Dynamic Color */}
            {(liturgical || data?.season) && (
                <div
                    className="text-white py-4 text-center"
                    style={{ backgroundColor: liturgicalColor }}
                >
                    <div className="container mx-auto px-4">
                        {/* Season Name */}
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className="text-sm font-medium uppercase tracking-wider">
                                {liturgical?.season || data?.season}
                            </span>

                            {/* Feast Rank Badge */}
                            {primaryCelebration && primaryCelebration.rank !== 'WEEKDAY' && (
                                <>
                                    <span className="opacity-50">•</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${getRankStyle(primaryCelebration.rank)}`}>
                                        <Sparkles className="w-3 h-3" />
                                        {primaryCelebration.rankName}
                                    </span>
                                </>
                            )}

                            {/* Holy Day of Obligation */}
                            {liturgical?.isHolyDayOfObligation && (
                                <>
                                    <span className="opacity-50">•</span>
                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/30 text-white border border-red-400/30">
                                        Holy Day of Obligation
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Celebration Name */}
                        {primaryCelebration && primaryCelebration.name && (
                            <p className="mt-2 text-white/90 font-medium">
                                {primaryCelebration.name}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-10">
                <div className="max-w-4xl mx-auto">
                    {/* Controls */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Text size:</span>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {(['sm', 'base', 'lg', 'xl'] as const).map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setFontSize(size)}
                                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${fontSize === size ? 'bg-white shadow text-green-700' : 'text-gray-500'
                                            }`}
                                    >
                                        {size === 'sm' ? 'S' : size === 'base' ? 'M' : size === 'lg' ? 'L' : 'XL'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {data?.sourceUrl && (
                            <a
                                href={data.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="hidden sm:inline">View on USCCB</span>
                            </a>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                            <p className="text-gray-500">Loading today's readings...</p>
                        </div>
                    ) : data?.readings && data.readings.length > 0 ? (
                        <>
                            {/* Reading Tabs */}
                            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                                {data.readings.map((reading, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveReading(idx)}
                                        className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${activeReading === idx
                                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {reading.type}
                                    </button>
                                ))}
                            </div>

                            {/* Active Reading */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
                                    <h2 className="text-2xl font-bold mb-1">{data.readings[activeReading].type}</h2>
                                    <p className="text-green-100 italic">{data.readings[activeReading].citation}</p>
                                </div>

                                <div className={`p-8 md:p-10 font-serif leading-relaxed ${fontSizeClasses[fontSize]} text-gray-800`}>
                                    {data.readings[activeReading].text.split('\n\n').map((paragraph, i) => (
                                        <p key={i} className="mb-6 last:mb-0 text-justify">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Reading Navigation */}
                            <div className="flex items-center justify-between mt-6">
                                <button
                                    onClick={() => setActiveReading(prev => Math.max(0, prev - 1))}
                                    disabled={activeReading === 0}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${activeReading === 0
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Previous
                                </button>

                                <span className="text-gray-400 text-sm">
                                    {activeReading + 1} of {data.readings.length}
                                </span>

                                <button
                                    onClick={() => setActiveReading(prev => Math.min(data.readings.length - 1, prev + 1))}
                                    disabled={activeReading === data.readings.length - 1}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${activeReading === data.readings.length - 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Share This Reading */}
                            <div className="mt-8 text-center bg-green-50 rounded-2xl p-6 border border-green-100">
                                <p className="text-green-800 text-sm mb-4 font-serif italic">
                                    Today&apos;s Word from God spoke to my heart. Share it and let it bless others too 📖
                                </p>
                                <ShareButtons
                                    url="/readings"
                                    title={`Daily Mass Readings — ${formattedDate}`}
                                    description={data?.readings?.[activeReading]?.citation || 'Catholic Daily Mass Readings'}
                                    contentType="reading"
                                    label="Share Today's Reading"
                                    variant="cta"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Readings Not Available</h3>
                            <p className="text-gray-500 mb-6">
                                The readings for this date couldn't be loaded.
                            </p>
                            {data?.sourceUrl && (
                                <a
                                    href={data.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                                >
                                    View on USCCB <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    )}

                    {/* Ad Slot — Between Readings and Reflection */}
                    <div className="mt-10 mb-4">
                        <SmartAdSlot page="readings" position="bottom" showPlaceholder={false} />
                    </div>

                    {/* Daily Reflection CTA */}
                    <div className="mt-12 bg-gradient-to-br from-green-800 to-green-900 text-white rounded-2xl p-8 md:p-10 text-center">
                        <Sun className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-3">Daily Reflection</h3>
                        <p className="text-green-100 mb-6 max-w-lg mx-auto">
                            Take time to meditate on today's Word. Let the Scripture speak to your heart and guide your day.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/bible"
                                className="px-8 py-3 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors"
                            >
                                Read the Bible
                            </Link>
                            <Link
                                href="/prayer-wall"
                                className="px-8 py-3 bg-green-700 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
                            >
                                Share a Prayer
                            </Link>
                        </div>
                    </div>

                    {/* Mass Offering CTA */}
                    <div className="mt-8">
                        <MassOfferingCTA variant="inline" context="reading" />
                    </div>
                </div>
            </div>
        </div>
    );
}
