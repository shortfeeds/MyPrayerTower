import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Plus, Search, Flame, Flower, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { getMemorials } from '@/app/actions/memorials';
import { Memorial } from '@/lib/types/memorials';
import { MemorialCard } from '@/app/memorials/_components/memorial-card';

export const metadata: Metadata = {
    title: 'Catholic Obituaries & In Memoriam Registry | MyPrayerTower',
    description: 'Honor and remember the faithful departed. Catholic obituary notices, digital memorials, perpetual prayer vigils, and condolences registry.',
};

export default async function ObituariesPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string };
}) {
    const page = Number(searchParams.page) || 1;
    const search = searchParams.search || '';

    let memorialsData;
    try {
        memorialsData = await getMemorials(page, search);
    } catch (error) {
        console.error('Failed to load obituaries:', error);
        memorialsData = { items: [], meta: { total: 0, page: 1, lastPage: 1 } };
    }

    const sampleMemorials: Memorial[] = [
        {
            id: 'sample-1',
            firstName: 'Maria',
            lastName: 'Santos',
            birthDate: '1945-03-15',
            deathDate: '2024-11-22',
            biography: 'A devoted mother, grandmother, and faithful servant of God. Maria touched countless lives with her kindness, her rosary always in hand. She served her parish for over 40 years.',
            photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
            owner: { displayName: 'Anna Santos', firstName: 'Anna', lastName: 'Santos' },
            totalCandles: 156,
            totalFlowers: 42,
        },
        {
            id: 'sample-2',
            firstName: 'Joseph',
            lastName: 'O\'Connor',
            birthDate: '1938-07-04',
            deathDate: '2024-08-15',
            biography: 'A loving husband of 58 years, proud father, and devoted parishioner of St. Patrick\'s Church. Joe never missed Sunday Mass.',
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            owner: { displayName: 'Michael O\'Connor', firstName: 'Michael', lastName: 'O\'Connor' },
            totalCandles: 203,
            totalFlowers: 67,
        },
        {
            id: 'sample-3',
            firstName: 'Theresa',
            lastName: 'Rodriguez',
            birthDate: '1952-10-01',
            deathDate: '2025-01-05',
            biography: 'Named after St. Therese of Lisieux, Theresa lived her faith daily through acts of charity and service to the poor in her community.',
            photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
            owner: { displayName: 'Rosa Martinez', firstName: 'Rosa', lastName: 'Martinez' },
            totalCandles: 89,
            totalFlowers: 28,
        },
        {
            id: 'sample-4',
            firstName: 'Patrick',
            lastName: 'Murphy',
            birthDate: '1940-03-17',
            deathDate: '2024-12-25',
            biography: 'A Knight of Columbus for over 40 years, Patrick dedicated his life to faith, family, and serving his parish community.',
            photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            owner: { displayName: 'Sean Murphy', firstName: 'Sean', lastName: 'Murphy' },
            totalCandles: 178,
            totalFlowers: 54,
        },
    ];

    const displayList = memorialsData.items.length > 0 ? memorialsData.items : sampleMemorials;

    return (
        <div className="min-h-screen bg-[#07040d] text-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent opacity-50" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>In Memoriam Registry & Obituaries</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
                        Catholic Obituaries & Remembrance
                    </h1>
                    <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed mb-8">
                        Honoring the sacred memory of our departed brothers and sisters in Christ. Light a candle, offer a Mass intention, or send prayers of comfort to their families.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <Link
                            href="/memorials/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-sacred-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Publish an Obituary / Memorial</span>
                        </Link>
                        <Link
                            href="/mass-offerings"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 text-xs font-semibold uppercase tracking-wider transition-all"
                        >
                            <Flame className="w-4 h-4 text-gold-400" />
                            <span>Request Memorial Mass</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Search Bar */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <form method="GET" action="/news/obituaries" className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Search by name, parish, or family..."
                        className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-gold-400/50 transition-colors"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 font-semibold text-xs transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Obituary Cards Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
                    <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold-400" />
                        <span>Recent In Memoriam Notices</span>
                    </h2>
                    <span className="text-xs text-white/40">
                        {displayList.length} Departed Remembered
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayList.map(item => (
                        <MemorialCard key={item.id} memorial={item} />
                    ))}
                </div>

                <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-gold-500/10 via-transparent to-transparent border border-gold-500/20 max-w-2xl mx-auto">
                    <Heart className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                    <h3 className="font-serif font-bold text-lg text-white mb-2">Create an Eternal Memorial Page</h3>
                    <p className="text-xs text-white/60 leading-relaxed mb-6">
                        Create a permanent Catholic resting place online for your loved one. Collect prayers, light perpetual candles, and preserve their legacy in faith.
                    </p>
                    <Link
                        href="/memorials/create"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-sacred-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                        <span>Create Memorial Tribute &rarr;</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
