'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchClientInterfaceProps {
    initialQuery: string;
    activeType: string;
    counts: {
        all: number;
        prayers: number;
        novenas: number;
        saints: number;
        articles: number;
        churches: number;
    };
}

export default function SearchClientInterface({
    initialQuery,
    activeType,
    counts
}: SearchClientInterfaceProps) {
    const [query, setQuery] = useState(initialQuery);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            router.push(`/search?q=${encodeURIComponent(trimmed)}${activeType !== 'all' ? `&type=${activeType}` : ''}`);
        } else {
            router.push('/search');
        }
    };

    const handleTypeChange = (type: string) => {
        const trimmed = query.trim();
        if (trimmed) {
            router.push(`/search?q=${encodeURIComponent(trimmed)}${type !== 'all' ? `&type=${type}` : ''}`);
        } else {
            router.push(`/search${type !== 'all' ? `?type=${type}` : ''}`);
        }
    };

    const filterTabs = [
        { id: 'all', label: 'All', count: counts.all },
        { id: 'prayers', label: 'Prayers', count: counts.prayers },
        { id: 'novenas', label: 'Novenas', count: counts.novenas },
        { id: 'saints', label: 'Saints', count: counts.saints },
        { id: 'articles', label: 'Articles', count: counts.articles },
        { id: 'churches', label: 'Parishes', count: counts.churches },
    ];

    return (
        <div className="space-y-4">
            {/* Search Input Box */}
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-gold-400 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search prayers, novenas, saints, blog, churches..."
                        className="w-full pl-12 pr-24 py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 text-base shadow-xl backdrop-blur-sm transition-all"
                    />
                    <div className="absolute right-3 flex items-center gap-2">
                        {query && (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery('');
                                    router.push('/search');
                                }}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0a0612] font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>

            {/* Filter Tabs */}
            {initialQuery && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {filterTabs.map((tab) => {
                        const isActive = activeType === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTypeChange(tab.id)}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                    isActive
                                        ? 'bg-gold-500 text-[#0a0612] font-bold shadow-md shadow-gold-500/20'
                                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/5'
                                }`}
                            >
                                <span>{tab.label}</span>
                                {tab.count > 0 && (
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        isActive ? 'bg-[#0a0612]/20 text-[#0a0612]' : 'bg-white/10 text-white/60'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
