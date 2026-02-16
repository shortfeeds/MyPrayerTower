'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Command, BookOpen, Clock, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    type: 'blog' | 'guide';
    title: string;
    description: string;
    category: string;
    url: string;
}

export function BlogSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [allData, setAllData] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Load initial index
    useEffect(() => {
        const fetchIndex = async () => {
            try {
                const res = await fetch('/api/blog/search');
                const data = await res.json();
                if (data.results) setAllData(data.results);
            } catch (err) {
                console.error('Failed to load search index:', err);
            }
        };
        fetchIndex();
    }, []);

    // Handle Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Live Search Logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchTerm = query.toLowerCase();
        const filtered = allData.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        ).slice(0, 8);

        setResults(filtered);
    }, [query, allData]);

    const handleSelect = (url: string) => {
        router.push(url);
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="w-full max-w-xl mx-auto flex items-center gap-3 px-5 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-200 transition-all text-gray-400 group"
        >
            <Search className="w-4 h-4 group-hover:text-gold-600" />
            <span className="flex-1 text-left text-sm font-medium">Search 100+ spiritual guides...</span>
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-400">
                <Command className="w-3 h-3" /> K
            </div>
        </button>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            <div className="absolute inset-0 bg-sacred-950/40 backdrop-blur-md animate-fade-in" onClick={() => setIsOpen(false)} />

            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up border border-gold-100">
                <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-50">
                    <Search className="w-5 h-5 text-gold-500" />
                    <input
                        ref={inputRef}
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What are you seeking today?"
                        className="flex-1 bg-transparent text-lg text-gray-900 placeholder-gray-400 focus:outline-none font-serif"
                    />
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-3">
                    {query.length > 0 ? (
                        results.length > 0 ? (
                            <div className="space-y-1">
                                {results.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleSelect(result.url)}
                                        className="w-full flex items-start gap-4 p-4 rounded-2xl hover:bg-sacred-50 transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-sacred-600 group-hover:bg-sacred-900 group-hover:text-white transition-colors">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600">{result.category}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                <span className="text-[10px] uppercase font-bold text-gray-400">{result.type}</span>
                                            </div>
                                            <h4 className="font-serif font-bold text-gray-900 group-hover:text-sacred-900 transition-colors text-lg truncate">{result.title}</h4>
                                            <p className="text-sm text-gray-500 line-clamp-1 italic">{result.description}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 self-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-100" />
                                <p className="text-gray-500 font-serif italic text-lg">No guides found for "{query}"</p>
                                <p className="text-xs text-gray-400 mt-2">Try searching for "Lent", "Mary", or "Prayer"</p>
                            </div>
                        )
                    ) : (
                        <div className="p-4">
                            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Trending Topics</h5>
                            <div className="grid grid-cols-2 gap-3">
                                {['Lent Guide', 'Holy Hour', 'Saints', 'Rosary', 'Confession', 'Miracles'].map(topic => (
                                    <button
                                        key={topic}
                                        onClick={() => setQuery(topic)}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gold-50 hover:text-gold-700 transition-colors text-xs font-bold text-gray-600 border border-transparent hover:border-gold-100"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-600">ENTER</kbd> Select</span>
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-600">ESC</kbd> Close</span>
                    </div>
                    <span>MyPrayerTower Spiritual Index</span>
                </div>
            </div>
        </div>
    );
}
