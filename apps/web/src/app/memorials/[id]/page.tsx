import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
    Flame, Flower, Share2, 
    ArrowLeft, User, MessageCircle, Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMemorialById } from '@/app/actions/memorials';
import { SACRED_COPY } from '@/lib/sacred-copy';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { Memorial } from '@/lib/types/memorials';

interface MemorialPageProps {
    params: { id: string };
}

// Sample memorials so that demo cards work before real data is in the DB
const SAMPLE_MEMORIALS: Record<string, Memorial> = {
    'sample-1': {
        id: 'sample-1',
        firstName: 'Maria',
        lastName: 'Santos',
        birthDate: '1945-03-15',
        deathDate: '2024-11-22',
        biography: 'A devoted mother, grandmother, and faithful servant of God. Maria touched countless lives with her kindness, her rosary always in hand. She served her parish for over 40 years, organizing food drives and leading prayer groups. Her unwavering faith and selfless love for her community will forever be remembered by all who had the blessing of knowing her.',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Anna Santos', firstName: 'Anna', lastName: 'Santos' },
        totalCandles: 156,
        totalFlowers: 42,
    },
    'sample-2': {
        id: 'sample-2',
        firstName: 'Joseph',
        lastName: "O'Connor",
        birthDate: '1938-07-04',
        deathDate: '2024-08-15',
        biography: "A loving husband of 58 years, proud father, and devoted parishioner of St. Patrick's Church. Joe never missed Sunday Mass. He was a pillar of his community, known for his warm smile and willingness to help anyone in need. His legacy of faith continues through his children and grandchildren.",
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: "Michael O'Connor", firstName: 'Michael', lastName: "O'Connor" },
        totalCandles: 203,
        totalFlowers: 67,
    },
    'sample-3': {
        id: 'sample-3',
        firstName: 'Theresa',
        lastName: 'Rodriguez',
        birthDate: '1952-10-01',
        deathDate: '2025-01-05',
        biography: 'Named after St. Therese of Lisieux, Theresa lived her faith daily through acts of charity and service to the poor in her community. She founded a women\'s shelter that continues to serve hundreds of families each year. Her "little way" of love touched everyone around her.',
        photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Rosa Martinez', firstName: 'Rosa', lastName: 'Martinez' },
        totalCandles: 89,
        totalFlowers: 28,
    },
    'sample-4': {
        id: 'sample-4',
        firstName: 'Patrick',
        lastName: 'Murphy',
        birthDate: '1940-03-17',
        deathDate: '2024-12-25',
        biography: 'A Knight of Columbus for over 40 years, Patrick dedicated his life to faith, family, and serving his parish community. He organized countless charitable events and was known for his booming laugh and generous spirit.',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Sean Murphy', firstName: 'Sean', lastName: 'Murphy' },
        totalCandles: 178,
        totalFlowers: 54,
    },
    'sample-5': {
        id: 'sample-5',
        firstName: 'Catherine',
        lastName: 'Kim',
        birthDate: '1960-08-20',
        deathDate: '2024-09-08',
        biography: 'A convert to Catholicism who embraced the faith with her whole heart. Catherine led the Korean Catholic community choir for 15 years and brought joy to every liturgy she participated in.',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Grace Kim', firstName: 'Grace', lastName: 'Kim' },
        totalCandles: 112,
        totalFlowers: 35,
    },
    'sample-6': {
        id: 'sample-6',
        firstName: 'Antonio',
        lastName: 'Garcia',
        birthDate: '1935-12-12',
        deathDate: '2024-06-13',
        biography: 'Antonio walked 10 miles to daily Mass every morning for 30 years. His faith and dedication inspired all who knew him. He was a devoted husband and the patriarch of a large, loving family.',
        photoUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Maria Garcia', firstName: 'Maria', lastName: 'Garcia' },
        totalCandles: 245,
        totalFlowers: 89,
    },
};

async function getMemorial(id: string): Promise<Memorial | null> {
    // Check sample data first
    if (SAMPLE_MEMORIALS[id]) {
        return SAMPLE_MEMORIALS[id];
    }
    // Otherwise fetch from DB
    return getMemorialById(id);
}

export async function generateMetadata({ params }: MemorialPageProps): Promise<Metadata> {
    const memorial = await getMemorial(params.id);
    if (!memorial) return { title: 'Memorial Not Found' };

    return {
        title: `${memorial.firstName} ${memorial.lastName} | Eternal Memorials`,
        description: memorial.biography?.substring(0, 160) || `A sacred digital memorial for ${memorial.firstName} ${memorial.lastName}.`,
    };
}

export default async function MemorialDetailPage({ params }: MemorialPageProps) {
    const memorial = await getMemorial(params.id);

    if (!memorial) {
        notFound();
    }

    const birthYear = memorial.birthDate ? new Date(memorial.birthDate).getFullYear() : '???';
    const deathYear = memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : 'Present';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Simple Top Nav */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/memorials" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-rose-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">All Memorials</span>
                    </Link>
                    <div className="flex items-center gap-2">
                         <Button variant="ghost" size="sm" className="rounded-full gap-2">
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Share</span>
                         </Button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12">
                {/* Top Ad */}
                <div className="max-w-5xl mx-auto mb-8">
                    <SmartAdSlot page="memorials" position="top" showPlaceholder={false} />
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-12">
                        
                        {/* Profile Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-rose-50 dark:bg-rose-900/10 border border-gray-100 dark:border-slate-800 shadow-xl">
                                {memorial.photoUrl ? (
                                    <img 
                                        src={memorial.photoUrl} 
                                        alt={`${memorial.firstName} ${memorial.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-rose-200 dark:text-rose-900/30">
                                        <User className="w-32 h-32" />
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-sm uppercase tracking-widest font-bold text-gray-400">Remembrance Stats</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                            <Flame className="w-6 h-6 text-amber-500 mb-2" />
                                            <span className="text-xl font-bold text-amber-700 dark:text-amber-400">{memorial.totalCandles}</span>
                                            <span className="text-[10px] text-amber-600/60 uppercase font-bold">Candles</span>
                                        </div>
                                        <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                            <Flower className="w-6 h-6 text-rose-500 mb-2" />
                                            <span className="text-xl font-bold text-rose-700 dark:text-rose-400">{memorial.totalFlowers}</span>
                                            <span className="text-[10px] text-rose-600/60 uppercase font-bold">Flowers</span>
                                        </div>
                                    </div>
                                </div>

                                {memorial.owner && (
                                    <div className="pt-6 border-t border-gray-50 dark:border-slate-800">
                                        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-bold">Maintained By</p>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 ring-2 ring-rose-50 dark:ring-rose-900/20">
                                                <AvatarImage src={memorial.owner.avatarUrl} />
                                                <AvatarFallback className="bg-rose-100 text-rose-600">
                                                    {memorial.owner.firstName?.[0]}{memorial.owner.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{memorial.owner.displayName}</p>
                                                <p className="text-xs text-gray-500">Memorial Guardian</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Sidebar Ad */}
                                <div className="pt-6 border-t border-gray-50 dark:border-slate-800">
                                    <SmartAdSlot page="memorials" position="sidebar" showPlaceholder={false} />
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-widest">
                                    <Star className="w-3 h-3" />
                                    In Loving Memory
                                </div>
                                <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                                    {memorial.firstName}<br />{memorial.lastName}
                                </h1>
                                <div className="flex items-center gap-4 text-xl text-gray-500 font-serif italic">
                                    <span>{birthYear}</span>
                                    <span className="w-8 h-px bg-gray-300"></span>
                                    <span>{deathYear}</span>
                                </div>
                            </div>

                            <div className="prose prose-rose dark:prose-invert max-w-none">
                                <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative italic text-lg leading-loose text-gray-600 dark:text-gray-300">
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/20">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    {memorial.biography || "No biography provided for this eternal memorial."}
                                </div>
                            </div>

                            {/* Inline Ad after biography */}
                            <SmartAdSlot page="memorials" position="inline" showPlaceholder={false} />

                            <div className="p-12 rounded-[40px] bg-gradient-to-br from-rose-600 to-rose-800 text-white text-center space-y-8 shadow-2xl shadow-rose-900/20">
                                <h3 className="text-2xl font-serif font-bold">Light a Candle in Remembrance</h3>
                                <p className="text-rose-100 max-w-md mx-auto">
                                    &quot;{SACRED_COPY.memorials.eternally}&quot;
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Link href={`/candles?memorialId=${memorial.id}`}>
                                        <Button className="rounded-full bg-white text-rose-700 hover:bg-rose-50 px-8 py-6 text-lg font-bold shadow-xl">
                                            Light a Candle
                                        </Button>
                                    </Link>
                                    <Link href="/memorials">
                                        <Button variant="outline" className="rounded-full border-white/30 hover:bg-white/10 text-white px-8 py-6 text-lg font-bold">
                                            View All Memorials
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Bottom Ad */}
                            <SmartAdSlot page="memorials" position="bottom" showPlaceholder={false} />
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
