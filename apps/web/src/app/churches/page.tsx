import { getChurches } from '@/app/actions/church-directory';
import { ChurchCard } from '@/components/churches/ChurchCard';
import { DirectoryFilters } from '@/components/churches/DirectoryFilters';
import { Building, MapPin, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';

export const dynamic = 'force-dynamic';

interface ChurchesPageProps {
    searchParams: {
        q?: string;
        page?: string;
        denomination?: string;
        type?: string;
    };
}

export default async function ChurchesPage({ searchParams }: ChurchesPageProps) {
    const query = searchParams.q || '';
    const page = Number(searchParams.page) || 1;
    const denomination = searchParams.denomination;
    const type = searchParams.type;

    const { data: churches, meta } = await getChurches(page, 12, query, { denomination, type });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
            {/* Header */}
            <div className="bg-sacred-900 pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Church Directory</h1>
                    <p className="text-xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">
                        Connect with your local parish community. Find Mass times, confession schedules, and spiritual homes near you.
                    </p>

                    <DirectoryFilters />
                </div>
            </div>

            {/* Results Area */}
            <div className="container mx-auto px-6 -mt-8 pb-24 relative z-20">
                {churches.length > 0 ? (
                    <div className="space-y-12">
                        <div className="flex items-center justify-between text-sm">
                            <p className="text-gray-500 dark:text-gray-400">
                                Showing <span className="font-bold text-gray-900 dark:text-white">{churches.length}</span> parishes
                                {query && <span> for "<span className="italic">{query}</span>"</span>}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {churches.map((church: any) => (
                                <ChurchCard key={church.id} church={church} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 pt-12 border-t border-gray-100 dark:border-white/5">
                                {page > 1 && (
                                    <Link
                                        href={`/churches?page=${page - 1}${query ? `&q=${query}` : ''}${denomination ? `&denomination=${denomination}` : ''}${type ? `&type=${type}` : ''}`}
                                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl hover:bg-gold-500 hover:text-black dark:hover:bg-gold-500 dark:hover:text-black transition-all duration-300"
                                        title="Previous Page"
                                    >
                                        <ArrowRight className="w-5 h-5 rotate-180" />
                                    </Link>
                                )}

                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    {[...Array(meta.totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        const isCurrent = page === pageNum;

                                        // Simple logic to show only a few pages if there are many
                                        if (meta.totalPages > 7) {
                                            if (pageNum !== 1 && pageNum !== meta.totalPages && Math.abs(page - pageNum) > 1) {
                                                if (pageNum === page - 2 || pageNum === page + 2) return <span key={i} className="px-1 text-gray-400">...</span>;
                                                return null;
                                            }
                                        }

                                        return (
                                            <Link
                                                key={i}
                                                href={`/churches?page=${pageNum}${query ? `&q=${query}` : ''}${denomination ? `&denomination=${denomination}` : ''}${type ? `&type=${type}` : ''}`}
                                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-300 ${isCurrent
                                                    ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20'
                                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {page < meta.totalPages && (
                                    <Link
                                        href={`/churches?page=${page + 1}${query ? `&q=${query}` : ''}${denomination ? `&denomination=${denomination}` : ''}${type ? `&type=${type}` : ''}`}
                                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl hover:bg-gold-500 hover:text-black dark:hover:bg-gold-500 dark:hover:text-black transition-all duration-300"
                                        title="Next Page"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold mb-2">No Parishes Found</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            We couldn't find any churches matching your current filters. Try adjusting your search term or clearing filters.
                        </p>
                        <Link
                            href="/churches"
                            className="px-8 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-400 transition inline-block"
                        >
                            Reset All Filters
                        </Link>
                    </div>
                )}
            </div>

            {/* Bottom Ad */}
            <div className="container mx-auto px-6 pb-12">
                <SmartAdSlot page="churches" position="bottom" showPlaceholder={false} />
            </div>
        </div>
    );
}

