'use client';

import { useState, useEffect } from 'react';
import { Quote, RefreshCw, Share2, Sparkles } from 'lucide-react';

interface DailyQuote {
    content: string;
    author: string;
    source: string;
    category: string;
    reference?: string;
}

export default function DailyInspirationWidget() {
    const [quote, setQuote] = useState<DailyQuote | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuote();
    }, []);

    const fetchQuote = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/quotes');
            const data = await res.json();
            setQuote(data);
        } catch (err) {
            console.error('Failed to fetch quote:', err);
        } finally {
            setLoading(false);
        }
    };

    const getNewQuote = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/quotes?random=true');
            const data = await res.json();
            setQuote(data);
        } catch (err) {
            console.error('Failed to fetch quote:', err);
        } finally {
            setLoading(false);
        }
    };

    const shareQuote = async () => {
        if (!quote) return;

        const text = `"${quote.content}"\n\n— ${quote.author}${quote.reference ? ` (${quote.reference})` : ''}\n\nvia MyPrayerTower`;

        if (navigator.share) {
            try {
                await navigator.share({ text });
            } catch (err) {
                // Fallback to clipboard
                navigator.clipboard.writeText(text);
            }
        } else {
            navigator.clipboard.writeText(text);
            alert('Quote copied to clipboard!');
        }
    };

    const getSourceBadge = (source: string) => {
        switch (source) {
            case 'saint':
                return { text: 'Saint', color: 'bg-amber-100 text-amber-700' };
            case 'pope':
                return { text: 'Pope', color: 'bg-purple-100 text-purple-700' };
            case 'bible':
                return { text: 'Scripture', color: 'bg-green-100 text-green-700' };
            default:
                return { text: 'Inspiration', color: 'bg-blue-100 text-blue-700' };
        }
    };

    if (loading && !quote) {
        return (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 animate-pulse">
                <div className="h-6 bg-amber-200/50 rounded w-1/4 mb-6"></div>
                <div className="h-4 bg-amber-200/50 rounded w-full mb-3"></div>
                <div className="h-4 bg-amber-200/50 rounded w-3/4 mb-6"></div>
                <div className="h-4 bg-amber-200/50 rounded w-1/3"></div>
            </div>
        );
    }

    if (!quote) return null;

    const sourceBadge = getSourceBadge(quote.source);

    return (
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-8 border border-amber-200/50 shadow-lg relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-10">
                <Sparkles className="w-16 h-16 text-amber-500" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Quote className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Daily Inspiration</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sourceBadge.color}`}>
                            {sourceBadge.text}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quote Content */}
            <blockquote className="relative">
                <p className="text-xl md:text-2xl font-serif text-gray-800 leading-relaxed italic mb-4">
                    "{quote.content}"
                </p>
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center justify-between mt-6">
                <div>
                    <p className="font-bold text-gray-900">— {quote.author}</p>
                    {quote.reference && (
                        <p className="text-sm text-gray-500">{quote.reference}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={getNewQuote}
                        disabled={loading}
                        className="p-2 rounded-full hover:bg-white/50 transition-colors text-gray-500 hover:text-amber-600 disabled:opacity-50"
                        title="Get new quote"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={shareQuote}
                        className="p-2 rounded-full hover:bg-white/50 transition-colors text-gray-500 hover:text-amber-600"
                        title="Share quote"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
