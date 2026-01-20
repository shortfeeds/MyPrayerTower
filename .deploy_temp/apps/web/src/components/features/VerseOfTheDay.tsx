'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, Loader2 } from 'lucide-react';

interface VerseData {
    book: string;
    bookName: string;
    chapter: number;
    verse: number;
    text: string;
    reference: string;
}

export function VerseOfTheDay() {
    const [verse, setVerse] = useState<VerseData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/bible/verse-of-day')
            .then(res => res.json())
            .then(data => {
                setVerse(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
                </div>
            </div>
        );
    }

    if (!verse) return null;

    return (
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-gold-400" />
                    <span className="text-gold-400 font-semibold text-sm uppercase tracking-wider">
                        Verse of the Day
                    </span>
                </div>

                {/* Verse Text */}
                <blockquote className="text-xl md:text-2xl font-serif leading-relaxed mb-6 font-light italic">
                    "{verse.text}"
                </blockquote>

                {/* Reference & CTA */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="text-primary-200 font-medium">
                        — {verse.reference}
                    </span>
                    <Link
                        href={`/bible/${verse.book}/${verse.chapter}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors text-sm"
                    >
                        Read Chapter
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
