import { Metadata } from 'next';
import { Youtube, Play, Mic, Globe, Moon, Heart, Music, Cloud, BookOpen } from 'lucide-react';
import { YouTubeVideoCard } from '@/components/youtube/YouTubeVideoCard';
import { fetchYouTubeVideos, PLAYLISTS } from '@/lib/youtube';

export const metadata: Metadata = {
    title: 'Watch & Pray | My Prayer Tower',
    description: 'Daily prayers, biblical motivation, and spiritual messages from the My Prayer Tower YouTube channel.',
};

export const revalidate = 3600; // ISR: revalidate every hour

export default async function WatchPage() {
    // Fetch all major sections in parallel for performance
    const [
        shorts, 
        rosary, 
        novenas, 
        hymns, 
        podcastEn, 
        podcastEs, 
        lenten, 
        genesis, 
        allVideos
    ] = await Promise.all([
        fetchYouTubeVideos(12, PLAYLISTS.SHORTS),
        fetchYouTubeVideos(12, PLAYLISTS.ROSARY),
        fetchYouTubeVideos(12, PLAYLISTS.NOVENAS),
        fetchYouTubeVideos(12, PLAYLISTS.HYMNS),
        fetchYouTubeVideos(12, PLAYLISTS.PODCAST_EN),
        fetchYouTubeVideos(12, PLAYLISTS.PODCAST_ES),
        fetchYouTubeVideos(12, PLAYLISTS.LENTEN),
        fetchYouTubeVideos(12, PLAYLISTS.GENESIS),
        fetchYouTubeVideos(24), 
    ]);

    // Filter "General Recent Messages"
    const mainVideos = allVideos
        .filter(v => v.type === 'video')
        .slice(0, 12);

    return (
        <div className="min-h-screen bg-[#faf9f6]/50 dark:bg-gray-950">
            {/* Hero */}
            <div className="bg-gradient-to-br from-red-700 via-red-800 to-rose-900 text-white pt-28 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-400/10 rounded-full blur-[80px]" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
                        <Youtube className="w-4 h-4 text-red-300" />
                        <span>Watch &amp; Pray</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 tracking-tight leading-tight">
                        Video Messages of Hope
                    </h1>
                    <p className="text-lg md:text-xl text-red-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Explore our spiritual library of prayers, teachings, and biblical motivation organized for your journey.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://www.youtube.com/@myprayertower?sub_confirmation=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-red-800 font-bold rounded-full hover:bg-red-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
                        >
                            <Youtube className="w-5 h-5" />
                            Subscribe for Daily Updates
                        </a>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="container mx-auto px-4 py-16 space-y-28">
                
                {/* Shorts Section */}
                {shorts.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-red-100 dark:bg-red-950/50 rounded-xl">
                                <Play className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Viral Shorts</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Quick vertical prayers and bitesize motivation</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {shorts.map((video) => (
                                <YouTubeVideoCard key={`shorts-${video.id}`} {...video} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Holy Rosary */}
                {rosary.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/50 rounded-xl">
                                <Moon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">The Holy Rosary</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Meditate on the mysteries of the Rosary</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {rosary.map((video) => (
                                <YouTubeVideoCard key={`rosary-${video.id}`} {...video} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Novenas */}
                {novenas.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-pink-100 dark:bg-pink-950/50 rounded-xl">
                                <Heart className="w-5 h-5 text-pink-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Novenas &amp; Prayers</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Powerful devotions and 9-day prayer journeys</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {novenas.map((video) => (
                                <YouTubeVideoCard key={`novena-${video.id}`} {...video} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Main Videos Section */}
                {mainVideos.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-rose-100 dark:bg-rose-950/50 rounded-xl">
                                <Youtube className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Recent Messages</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Fresh biblical motivation and teachings</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {mainVideos.map((video) => (
                                <YouTubeVideoCard key={`recent-${video.id}`} {...video} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Catholic Hymns */}
                {hymns.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/50 rounded-xl">
                                <Music className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Catholic Hymns</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Sacred music to lift your spirit in praise</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {hymns.map((video) => (
                                <YouTubeVideoCard key={`hymns-${video.id}`} {...video} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Podcast English Section */}
                {podcastEn.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/50 rounded-xl">
                                <Mic className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">The Podcast (English)</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">In-depth spiritual conversations and faith-building episodes</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {podcastEn.map((video) => (
                                <YouTubeVideoCard key={`podcast-en-${video.id}`} {...video} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Podcast Spanish Section */}
                {podcastEs.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-orange-100 dark:bg-orange-950/50 rounded-xl">
                                <Globe className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">El Podcast (Español)</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Conversaciones espirituales y episodios de fe en español</p>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {podcastEs.map((video) => (
                                <YouTubeVideoCard key={`podcast-es-${video.id}`} {...video} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Lenten Prayers */}
                {lenten.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-purple-100 dark:bg-purple-950/50 rounded-xl">
                                <Cloud className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Lenten Prayers</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Journey through the season of Lent with daily meditation</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {lenten.map((video) => (
                                <YouTubeVideoCard key={`lenten-${video.id}`} {...video} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Genesis series */}
                {genesis.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl">
                                <BookOpen className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Bible Study: Genesis</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Explore the beginnings of faith in our Genesis series</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {genesis.map((video) => (
                                <YouTubeVideoCard key={`genesis-${video.id}`} {...video} />
                            ))}
                        </div>
                    </section>
                )}

                {shorts.length === 0 && mainVideos.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <Youtube className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-xl font-serif font-bold text-gray-600 dark:text-gray-400 mb-2">
                            Videos Coming Soon
                        </h2>
                        <a
                            href="https://www.youtube.com/@myprayertower"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all shadow-lg"
                        >
                            <Youtube className="w-5 h-5" />
                            Visit Our Channel
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
