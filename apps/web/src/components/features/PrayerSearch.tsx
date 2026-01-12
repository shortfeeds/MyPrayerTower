'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export function PrayerSearch() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);
        if (searchValue) {
            params.set('q', searchValue);
        } else {
            params.delete('q');
        }

        startTransition(() => {
            router.push(`/prayers?${params.toString()}`);
        });
    };

    return (
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto group">
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex items-center overflow-hidden transition-all focus-within:bg-white focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-white/20">
                <Search className={`absolute left-5 w-6 h-6 transition-colors ${isPending ? 'text-blue-400 animate-pulse' : 'text-blue-100 group-focus-within:text-blue-500'
                    }`} />
                <input
                    name="q"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search for prayers, saints, intentions..."
                    className="w-full pl-16 pr-24 py-5 bg-transparent text-white placeholder-blue-100 group-focus-within:text-gray-900 group-focus-within:placeholder-gray-400 focus:outline-none text-lg font-medium transition-colors"
                // If focusing, text turns dark. If blur, text is white (on dark bg).
                // This requires careful styling if background is dark. Assuming header is dark gradient as seen in page.tsx.
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="absolute right-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                >
                    {isPending ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    );
}

// Filter Chips Component
export function PrayerFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Duration Logic
    const currentDuration = searchParams.get('duration');

    const updateDuration = (dur: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (dur) params.set('duration', dur);
        else params.delete('duration');
        router.push(`/prayers?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 animate-fade-in-up">
            {['short', 'medium', 'long'].map((dur) => {
                const isActive = currentDuration === dur;
                let label = '';
                switch (dur) {
                    case 'short': label = '< 1 min'; break;
                    case 'medium': label = '1-5 mins'; break;
                    case 'long': label = '5+ mins'; break;
                }

                return (
                    <button
                        key={dur}
                        onClick={() => updateDuration(isActive ? null : dur)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${isActive
                                ? 'bg-white text-blue-600 border-white shadow-lg scale-105'
                                : 'bg-white/10 text-blue-50 border-white/20 hover:bg-white/20'
                            }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
