import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
    Heart, Calendar, Flame, Flower, Share2, 
    ArrowLeft, User, MessageCircle, Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMemorialById } from '@/app/actions/memorials';
import { SACRED_COPY } from '@/lib/sacred-copy';

interface MemorialPageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: MemorialPageProps): Promise<Metadata> {
    const memorial = await getMemorialById(params.id);
    if (!memorial) return { title: 'Memorial Not Found' };

    return {
        title: `${memorial.firstName} ${memorial.lastName} | Eternal Memorials`,
        description: memorial.biography?.substring(0, 160) || `A sacred digital memorial for ${memorial.firstName} ${memorial.lastName}.`,
    };
}

export default async function MemorialDetailPage({ params }: MemorialPageProps) {
    const memorial = await getMemorialById(params.id);

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

                            <div className="p-12 rounded-[40px] bg-gradient-to-br from-rose-600 to-rose-800 text-white text-center space-y-8 shadow-2xl shadow-rose-900/20">
                                <h3 className="text-2xl font-serif font-bold">Light a Candle in Remembrance</h3>
                                <p className="text-rose-100 max-w-md mx-auto">
                                    "{SACRED_COPY.memorials.eternally}"
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Link href={`/candles?memorialId=${memorial.id}`}>
                                        <Button className="rounded-full bg-white text-rose-700 hover:bg-rose-50 px-8 py-6 text-lg font-bold shadow-xl">
                                            Light a Candle
                                        </Button>
                                    </Link>
                                    <Link href={`/memorials/${memorial.id}/offer`}>
                                        <Button variant="outline" className="rounded-full border-white/30 hover:bg-white/10 text-white px-8 py-6 text-lg font-bold">
                                            Give Flowers
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
