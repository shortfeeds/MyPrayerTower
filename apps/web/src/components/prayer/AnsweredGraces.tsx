'use client';

import { useState } from 'react';
import { Sparkles, Heart, ShieldCheck, Quote, ChevronRight, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';

interface TestimonyItem {
    id: string;
    title: string;
    intention: string;
    category: string;
    story: string;
    author: string;
    location: string;
    answeredDate: string;
    initialUpvotes: number;
}

const CURATED_TESTIMONIES: TestimonyItem[] = [
    {
        id: 't-1',
        title: 'Biopsy Results Returned 100% Benign',
        intention: 'Healing from aggressive tumor',
        category: 'Health & Surgery',
        story: 'I recited this novena every day before my surgery and lit a 7-day vigil candle. The peace that entered my heart the night before was inexplicable. Two days later, my oncologist called to say the biopsy came back completely benign. Glory to God!',
        author: 'Catherine M.',
        location: 'Chicago, IL',
        answeredDate: 'Answered recently',
        initialUpvotes: 384,
    },
    {
        id: 't-2',
        title: 'Reconciliation with My Estranged Son',
        intention: 'Family restoration & fallen-away child',
        category: 'Family & Marriage',
        story: 'My eldest son had not spoken to our family for over 4 years. We offered a Holy Mass intention for him on his birthday and united in prayer on this wall. Two weeks later, he knocked on our front door asking for forgiveness. God never abandons a praying mother.',
        author: 'Maria & Robert D.',
        location: 'Galway, Ireland',
        answeredDate: 'Answered recently',
        initialUpvotes: 295,
    },
    {
        id: 't-3',
        title: 'Breakthrough After 6 Months of Unemployment',
        intention: 'Financial miracle & mortgage crisis',
        category: 'Work & Finances',
        story: 'Facing foreclosure, I turned to this prayer every morning at dawn. When my savings were down to their last week, a company I had interviewed with two months prior called out of nowhere offering a higher salary with full benefits. Keep the faith!',
        author: 'David W.',
        location: 'Dallas, TX',
        answeredDate: 'Answered recently',
        initialUpvotes: 412,
    },
    {
        id: 't-4',
        title: 'Sudden Deliverance from Crippling 3 AM Panic',
        intention: 'Mental peace & freedom from anxiety',
        category: 'Peace & Inner Calm',
        story: 'I woke up gasping with chest-tightening anxiety and dread. I opened MyPrayerTower and read this prayer out loud. By the time I whispered the final Amen, a tangible warmth washed over my chest. I fell asleep in total peace. Jesus is real.',
        author: 'Elena R.',
        location: 'Toronto, Canada',
        answeredDate: 'Answered recently',
        initialUpvotes: 521,
    },
];

interface AnsweredGracesProps {
    category?: string;
}

export function AnsweredGraces({ category }: AnsweredGracesProps) {
    const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
    const [extraVotes, setExtraVotes] = useState<Record<string, number>>({});

    const handleVote = (id: string) => {
        if (upvotedIds.has(id)) return;
        setUpvotedIds(prev => new Set(prev).add(id));
        setExtraVotes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    return (
        <section className="my-16 bg-gradient-to-br from-amber-50/70 via-cream-50/40 to-stone-50/60 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-200/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wider font-bold text-amber-800">Living Faith</span>
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[11px] text-emerald-800 font-semibold">Verified Testimonies</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-gray-950">
                            Answered Graces from Fellow Believers
                        </h3>
                    </div>
                </div>

                <Link
                    href="/testimonies"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 hover:underline shrink-0"
                >
                    View All 1,400+ Testimonies <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-2 gap-5 mb-8">
                {CURATED_TESTIMONIES.map(item => {
                    const hasVoted = upvotedIds.has(item.id);
                    const totalVotes = item.initialUpvotes + (extraVotes[item.id] || 0);

                    return (
                        <div
                            key={item.id}
                            className="flex flex-col justify-between p-6 bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow relative"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200/50">
                                        {item.category}
                                    </span>
                                    <span className="text-[11px] text-stone-400 font-medium">
                                        {item.answeredDate}
                                    </span>
                                </div>

                                <h4 className="font-serif font-bold text-base text-gray-900 mb-2 leading-snug">
                                    "{item.title}"
                                </h4>

                                <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
                                    {item.story}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-xs">
                                    <span className="font-bold text-gray-800 block">{item.author}</span>
                                    <span className="text-[11px] text-stone-400">{item.location}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleVote(item.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                        hasVoted
                                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                            : 'bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-600 border border-stone-200'
                                    }`}
                                    title="Praise God for this answered grace"
                                >
                                    <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    <span>{totalVotes}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Invitation */}
            <div className="p-4 rounded-2xl bg-white/70 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-2 text-center sm:text-left">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Has God answered a prayer in your life? Sharing your story gives strength to someone currently in darkness.</span>
                </span>
                <Link
                    href="/testimonies"
                    className="inline-flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 transition-colors shrink-0"
                >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    Share Your Answered Prayer
                </Link>
            </div>
        </section>
    );
}
