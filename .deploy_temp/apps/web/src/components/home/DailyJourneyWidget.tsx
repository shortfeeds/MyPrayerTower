'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, User, Flame, ArrowRight, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyJourneyProps {
    reading?: {
        citation: string;
        text: string;
    };
    saint?: {
        name: string;
        title?: string;
        image?: string;
    };
}

export function DailyJourneyWidget({ reading, saint }: DailyJourneyProps) {
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const toggleStep = (step: number) => {
        if (completedSteps.includes(step)) {
            setCompletedSteps(completedSteps.filter(s => s !== step));
        } else {
            setCompletedSteps([...completedSteps, step]);
        }
    };

    return (
        <section className="relative -mt-16 mb-16 px-4 z-20">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-white rounded-3xl shadow-xl border border-gold-100/50 overflow-hidden backdrop-blur-xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sacred-50 to-cream-50 px-6 py-4 border-b border-gold-100/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sacred-100 rounded-lg">
                                <Flame className="w-5 h-5 text-sacred-600" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-gray-900 text-lg">Your Daily Journey</h3>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-sacred-600 bg-sacred-50 px-3 py-1.5 rounded-full">
                            <span>{completedSteps.length}/3 Complete</span>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-6 rounded-full transition-all duration-500 ${completedSteps.includes(i) ? 'bg-sacred-500' : 'bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Step 1: The Word */}
                        <div className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors group relative">
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => toggleStep(1)}
                                    className={`rounded-full p-1 transition-colors ${completedSteps.includes(1) ? 'text-emerald-500 bg-emerald-50' : 'text-gray-300 hover:text-gray-400'}`}
                                >
                                    <CheckCircle2 className={`w-6 h-6 ${completedSteps.includes(1) ? 'fill-emerald-500 text-white' : ''}`} />
                                </button>
                            </div>

                            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                <BookOpen className="w-3 h-3" /> Step 1
                            </div>

                            <h4 className="font-serif font-bold text-xl text-gray-900 mb-2">The Word</h4>
                            <p className="text-sm font-medium text-sacred-600 mb-3">{reading?.citation || "Matthew 5:1-12"}</p>

                            <div className="prose prose-sm text-gray-600 line-clamp-3 mb-4 italic leading-relaxed">
                                "{reading?.text || "Blessed are the poor in spirit, for theirs is the kingdom of heaven..."}"
                            </div>

                            <Link href="/readings" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-sacred-600 transition-colors group/link">
                                Read Full Gospel <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                        </div>

                        {/* Step 2: Inspiration */}
                        <div className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors relative">
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => toggleStep(2)}
                                    className={`rounded-full p-1 transition-colors ${completedSteps.includes(2) ? 'text-emerald-500 bg-emerald-50' : 'text-gray-300 hover:text-gray-400'}`}
                                >
                                    <CheckCircle2 className={`w-6 h-6 ${completedSteps.includes(2) ? 'fill-emerald-500 text-white' : ''}`} />
                                </button>
                            </div>

                            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                <User className="w-3 h-3" /> Step 2
                            </div>

                            <h4 className="font-serif font-bold text-xl text-gray-900 mb-2">Inspiration</h4>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden ring-2 ring-gold-100">
                                    {saint?.image ? (
                                        <img src={saint.image} alt={saint.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-serif font-bold">
                                            {saint?.name?.charAt(0) || 'S'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm leading-tight">{saint?.name || "St. Francis"}</p>
                                    <p className="text-xs text-gray-500">{saint?.title || "Patron of Peace"}</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                Discover the life and miracles of today's saint. Let their holy life inspire your own journey.
                            </p>

                            <Link href="/saints" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-sacred-600 transition-colors group/link">
                                Meet Today's Saint <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                        </div>

                        {/* Step 3: Action */}
                        <div className="p-6 md:p-8 bg-gradient-to-br from-sacred-900 via-sacred-800 to-sacred-900 text-white relative overflow-hidden group">
                            {/* Background Effects */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>

                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => toggleStep(3)}
                                    className={`rounded-full p-1 transition-colors ${completedSteps.includes(3) ? 'text-emerald-400' : 'text-white/30 hover:text-white'}`}
                                >
                                    <CheckCircle2 className={`w-6 h-6 ${completedSteps.includes(3) ? 'fill-emerald-500 text-white' : ''}`} />
                                </button>
                            </div>

                            <div className="relative z-10">
                                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md text-gold-200 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wide">
                                    <Flame className="w-3 h-3" /> Step 3
                                </div>

                                <h4 className="font-serif font-bold text-xl text-white mb-2">Light a Candle</h4>
                                <p className="text-sm text-blue-100/90 mb-6 leading-relaxed">
                                    Offer a prayer for a loved one or a personal intention. Let the light of faith shine.
                                </p>

                                <Link
                                    href="/candles"
                                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-gold-500 hover:bg-gold-400 text-sacred-900 font-bold rounded-xl transition-all shadow-lg shadow-gold-900/20 group/btn"
                                >
                                    <Flame className="w-4 h-4 mr-2 fill-current" />
                                    Light a Candle Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
