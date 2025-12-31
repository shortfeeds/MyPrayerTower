'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Check, Settings, Type, ArrowLeft, X, Volume2, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Verse {
    verse: number;
    text: string;
}

interface ChapterData {
    book: string;
    bookName: string;
    chapter: number;
    totalChapters: number;
    version: string;
    verses: Verse[];
    hasPrevious: boolean;
    hasNext: boolean;
    previousChapter: number | null;
    nextChapter: number | null;
    error?: string;
}

export default function BibleChapterPage() {
    const params = useParams();
    const book = params.book as string;
    const chapter = params.chapter as string;
    const contentRef = useRef<HTMLDivElement>(null);

    const [data, setData] = useState<ChapterData | null>(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl' | '2xl'>('xl');
    const [marked, setMarked] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        setLoading(true);
        setMarked(false);
        fetch(`/api/bible/${book}/${chapter}`)
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
                // Scroll to top when chapter changes
                contentRef.current?.scrollTo(0, 0);
            })
            .catch(() => setLoading(false));
    }, [book, chapter]);

    const fontSizeClasses: Record<string, string> = {
        base: 'text-lg leading-relaxed',
        lg: 'text-xl leading-relaxed',
        xl: 'text-2xl leading-loose',
        '2xl': 'text-3xl leading-loose'
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading scripture...</p>
                </div>
            </div>
        );
    }

    if (!data || data.error || !data.verses?.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
                <div className="text-center p-8 max-w-md">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-gray-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Chapter Not Available</h1>
                    <p className="text-gray-400 mb-8">We couldn't load this chapter. Please try again or select a different chapter.</p>
                    <Link
                        href="/bible"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-amber-500/20"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Bible
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-gray-100">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a]/95 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/bible" className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Bible</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="font-serif text-lg">
                            <span className="text-amber-400">{data.bookName}</span>
                            <span className="text-gray-500 mx-2">•</span>
                            <span className="text-white font-bold">{data.chapter}</span>
                        </span>
                    </div>

                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2.5 rounded-xl transition-all ${showSettings ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        {showSettings ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                    </button>
                </div>

                {/* Settings Dropdown */}
                {showSettings && (
                    <div className="absolute right-4 top-full mt-2 w-64 bg-[#1a1a2e] border border-white/10 rounded-2xl p-4 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Type className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-gray-300 font-medium">Text Size</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {(['base', 'lg', 'xl', '2xl'] as const).map(size => (
                                <button
                                    key={size}
                                    onClick={() => setFontSize(size)}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${fontSize === size
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {size === 'base' ? 'S' : size === 'lg' ? 'M' : size === 'xl' ? 'L' : 'XL'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main ref={contentRef} className="pt-20 pb-32 overflow-auto">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    {/* Chapter Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-sm font-semibold uppercase tracking-widest mb-4">
                            {data.bookName}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-3">
                            Chapter {data.chapter}
                        </h1>
                        <p className="text-gray-500">
                            {data.verses.length} verses • King James Version
                        </p>
                    </div>

                    {/* Verses */}
                    <article className={`font-serif ${fontSizeClasses[fontSize]} text-gray-200`}>
                        {data.verses.map((verse, index) => (
                            <span key={verse.verse} className="inline group">
                                <sup className="text-amber-500 text-sm font-sans font-bold mr-1 select-none align-top">
                                    {verse.verse}
                                </sup>
                                <span className="hover:bg-amber-500/5 rounded transition-colors">
                                    {verse.text}
                                </span>
                                {' '}
                            </span>
                        ))}
                    </article>

                    {/* Divider */}
                    <div className="flex items-center justify-center gap-4 my-12">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => setMarked(true)}
                            disabled={marked}
                            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-semibold text-lg transition-all ${marked
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30'
                                }`}
                        >
                            <Check className={`w-6 h-6 ${marked ? 'animate-bounce' : ''}`} />
                            {marked ? 'Marked as Read!' : 'Mark Chapter as Read'}
                        </button>
                    </div>
                </div>
            </main>

            {/* Fixed Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#0f0f1a]/95 backdrop-blur-xl border-t border-white/5">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {data.hasPrevious ? (
                            <Link
                                href={`/bible/${book}/${data.previousChapter}`}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span className="hidden sm:inline">Chapter {data.previousChapter}</span>
                                <span className="sm:hidden">{data.previousChapter}</span>
                            </Link>
                        ) : (
                            <div />
                        )}

                        <Link
                            href="/bible"
                            className="px-4 py-2 text-gray-500 hover:text-amber-400 transition-colors text-sm"
                        >
                            All Books
                        </Link>

                        {data.hasNext ? (
                            <Link
                                href={`/bible/${book}/${data.nextChapter}`}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
                            >
                                <span className="hidden sm:inline">Chapter {data.nextChapter}</span>
                                <span className="sm:hidden">{data.nextChapter}</span>
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        ) : (
                            <Link
                                href="/bible"
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl transition-all"
                            >
                                <Check className="w-5 h-5" />
                                Complete
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
