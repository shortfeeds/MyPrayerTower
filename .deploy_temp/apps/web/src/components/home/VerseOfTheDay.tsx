'use client';

import { Star, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

// Collection of inspiring Bible verses
const VERSES = [
    { text: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", reference: "John 3:16" },
    { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
    { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
    { text: "The Lord is my light and my salvation—whom shall I fear?", reference: "Psalm 27:1" },
    { text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" },
    { text: "Come to me, all you who are weary and burdened, and I will give you rest.", reference: "Matthew 11:28" },
    { text: "And we know that in all things God works for the good of those who love him.", reference: "Romans 8:28" },
    { text: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.", reference: "Numbers 6:24-25" },
];

function getVerseOfDay() {
    // Get consistent verse based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return VERSES[dayOfYear % VERSES.length];
}

export function VerseOfTheDay({ variant = 'card' }: { variant?: 'card' | 'banner' | 'compact' }) {
    const [verse, setVerse] = useState(getVerseOfDay());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshVerse = () => {
        setIsRefreshing(true);
        const randomIndex = Math.floor(Math.random() * VERSES.length);
        setTimeout(() => {
            setVerse(VERSES[randomIndex]);
            setIsRefreshing(false);
        }, 300);
    };

    if (variant === 'banner') {
        return (
            <div className="bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 border border-gold-200/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-gold-600" />
                            <span className="text-xs font-semibold text-gold-700 uppercase tracking-wide">Verse of the Day</span>
                        </div>
                        <p className={`text-gray-800 font-serif italic leading-relaxed ${isRefreshing ? 'opacity-50' : ''} transition-opacity`}>
                            "{verse.text}"
                        </p>
                        <p className="text-gold-700 font-semibold text-sm mt-2">— {verse.reference}</p>
                    </div>
                    <button
                        onClick={refreshVerse}
                        className="p-2 hover:bg-gold-100 rounded-lg transition-colors"
                        title="Get another verse"
                    >
                        <ChevronRight className={`w-4 h-4 text-gold-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div className="text-center py-3 px-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <p className="text-white/90 font-serif italic text-sm">"{verse.text}"</p>
                <p className="text-gold-300 text-xs mt-1 font-medium">— {verse.reference}</p>
            </div>
        );
    }

    // Default card variant
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Verse of the Day</h3>
                        <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    </div>
                </div>
                <button
                    onClick={refreshVerse}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Get another verse"
                >
                    <ChevronRight className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>
            <blockquote className={`text-gray-700 font-serif italic text-lg leading-relaxed ${isRefreshing ? 'opacity-50' : ''} transition-opacity`}>
                "{verse.text}"
            </blockquote>
            <p className="text-gold-700 font-semibold mt-3">— {verse.reference}</p>
        </div>
    );
}
