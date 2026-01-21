import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Plus, Search, Flame, Flower, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMemorials } from '@/lib/api/memorials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

    const { items: memorials, meta } = memorialsDate;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-b from-white to-rose-50 dark:from-slate-900 dark:to-rose-950/20 overflow-hidden">
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
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-8">Recent Tributes</h2>

                {memorials.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No memorials found.</p>
                        {search && <p className="text-sm mt-2">Try adjusting your search terms.</p>}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memorials.map((memorial) => (
                            <Link key={memorial.id} href={`/memorials/${memorial.id}`}>
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow group h-full">
                                    <div className="h-48 bg-gray-200 dark:bg-slate-800 relative">
                                        {memorial.photoUrl ? (
                                            <img
                                                src={memorial.photoUrl}
                                                alt={`${memorial.firstName} ${memorial.lastName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-rose-50 dark:bg-rose-900/10">
                                                <Heart className="w-12 h-12 opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-1 group-hover:text-rose-600 transition-colors">
                                            {memorial.firstName} {memorial.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {memorial.birthDate && new Date(memorial.birthDate).getFullYear()} - {memorial.deathDate && new Date(memorial.deathDate).getFullYear()}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-amber-500" /> {memorial.totalCandles} Candles</span>
                                                <span className="flex items-center gap-1" title="Flowers Given"><Flower className="w-4 h-4 text-rose-500" /> {memorial.totalFlowers}</span>
                                            </div>

                                            {memorial.owner && (
                                                <div className="flex items-center gap-2" title={`Created by ${memorial.owner.displayName || memorial.owner.firstName}`}>
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage src={memorial.owner.avatarUrl} />
                                                        <AvatarFallback className="text-[10px] bg-rose-100 text-rose-600">
                                                            {memorial.owner.firstName?.[0]}{memorial.owner.lastName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Simple Pagination */}
                {meta.lastPage > 1 && (
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
                )}
            </section>
        </div>
    );
}
