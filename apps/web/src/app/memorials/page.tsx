import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Plus, Search, Flame, Flower, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { SACRED_COPY } from '@/lib/sacred-copy';
import { getMemorials } from '@/app/actions/memorials';
import { Memorial } from '@/lib/types/memorials';
import { MemorialCard } from './_components/memorial-card';

export const metadata: Metadata = {
    title: 'Eternal Memorials | MyPrayerTower',
    description: 'Create lasting tributes for your loved ones. A sacred digital space for remembrance, prayer, and community support.',
};

export default async function MemorialsPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string };
}) {
    const page = Number(searchParams.page) || 1;
    const search = searchParams.search || '';

    // Fetch memorials from API
    let memorialsDate;
    try {
        memorialsDate = await getMemorials(page, search);
    } catch (error) {
        console.error('Failed to load memorials:', error);
        // Fallback or empty state handled below
        memorialsDate = { items: [], meta: { total: 0, page: 1, lastPage: 1 } };
    }

    // Sample memorials to show when API returns empty (for demo purposes)
    const sampleMemorials: Memorial[] = [
        {
            id: 'sample-1',
            firstName: 'Maria',
            lastName: 'Santos',
            birthDate: '1945-03-15',
            deathDate: '2024-11-22',
            biography: 'A devoted mother, grandmother, and faithful servant of God. Maria touched countless lives with her kindness, her rosary always in hand.',
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
        {
            id: 'sample-5',
            firstName: 'Catherine',
            lastName: 'Kim',
            birthDate: '1960-08-20',
            deathDate: '2024-09-08',
            biography: 'A convert to Catholicism who embraced the faith with her whole heart. Catherine led the Korean Catholic community choir for 15 years.',
            photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
            owner: { displayName: 'Grace Kim', firstName: 'Grace', lastName: 'Kim' },
            totalCandles: 112,
            totalFlowers: 35,
        },
        {
            id: 'sample-6',
            firstName: 'Antonio',
            lastName: 'Garcia',
            birthDate: '1935-12-12',
            deathDate: '2024-06-13',
            biography: 'Antonio walked 10 miles to daily Mass every morning for 30 years. His faith and dedication inspired all who knew him.',
            photoUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face',
            owner: { displayName: 'Maria Garcia', firstName: 'Maria', lastName: 'Garcia' },
            totalCandles: 245,
            totalFlowers: 89,
        },
    ];

    // Use sample memorials if API returns empty and no search term
    const displayMemorials = memorialsDate.items.length > 0
        ? memorialsDate.items
        : (!search ? sampleMemorials : []);

    const { meta } = memorialsDate;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Hero Section - Increased whitespace for reverence */}
            <section className="relative py-32 bg-gradient-to-b from-white to-rose-50 dark:from-slate-900 dark:to-rose-950/20 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 mb-6">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm font-medium">Honor Their Memory</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                            Eternal Memorials
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
                            Create a sacred digital sanctuary to share stories, light candles, and gather prayers for your loved ones who have passed.
                        </p>
                        <p className="text-sm font-medium text-rose-800/60 dark:text-rose-300/60 mb-12 italic font-serif">
                            "{SACRED_COPY.memorials.eternally}"
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/memorials/create">
                                <Button size="lg" className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-8 gap-2">
                                    <Plus className="w-5 h-5" />
                                    Create Memorial
                                </Button>
                            </Link>

                            <form className="relative w-full sm:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search memorials..."
                                    defaultValue={search}
                                    className="h-11 pl-10 pr-4 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full sm:w-64 focus:ring-2 focus:ring-rose-500 outline-none"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured / Recent Memorials */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-12 text-center">Recent Tributes</h2>

                {displayMemorials.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No memorials found.</p>
                        {search && <p className="text-sm mt-2">Try adjusting your search terms.</p>}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayMemorials.map((memorial: Memorial, index) => (
                            <MemorialCard key={memorial.id} memorial={memorial} index={index} />
                        ))}
                    </div>
                )
                }

                {/* Simple Pagination */}
                {
                    meta.lastPage > 1 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {page > 1 && (
                                <Link href={`/memorials?page=${page - 1}${search ? `&search=${search}` : ''}`}>
                                    <Button variant="outline">Previous</Button>
                                </Link>
                            )}
                            <span className="flex items-center px-4 text-sm text-gray-500">
                                Page {page} of {meta.lastPage}
                            </span>
                            {page < meta.lastPage && (
                                <Link href={`/memorials?page=${page + 1}${search ? `&search=${search}` : ''}`}>
                                    <Button variant="outline">Next</Button>
                                </Link>
                            )}
                        </div>
                    )
                }
            </section >
        </div >
    );
}
