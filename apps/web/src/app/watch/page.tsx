import { Metadata } from 'next';
import { Youtube, ExternalLink } from 'lucide-react';
import { YouTubeVideoCard } from '@/components/youtube/YouTubeVideoCard';
import { fetchYouTubeVideos } from '@/lib/youtube';

export const metadata: Metadata = {
    title: 'Watch',
    description: 'Watch short prayer videos, biblical motivation, and daily spiritual messages from My Prayer Tower on YouTube.',
    openGraph: {
        title: 'Watch | MyPrayerTower',
        description: 'Watch short prayer videos, biblical motivation, and daily spiritual messages from My Prayer Tower.',
    },
};

export const revalidate = 3600; // ISR: revalidate every hour

export default async function WatchPage() {
    const videos = await fetchYouTubeVideos(12);

    return (
        <div className="min-h-screen bg-[#faf9f6] dark:bg-gray-950">
            {/* Hero */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white pt-28 pb-16 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-400/10 rounded-full blur-[80px]" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Youtube className="w-4 h-4 text-red-200" />
                        <span>Watch &amp; Pray</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        Video Messages of Hope
                    </h1>
                    <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">
                        Short prayers, biblical motivation, and daily reminders that Jesus loves you — from the My Prayer Tower YouTube channel.
                    </p>
                    <a
                        href="https://www.youtube.com/@myprayertower?sub_confirmation=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-red-700 font-bold rounded-full hover:bg-red-50 transition-colors shadow-xl"
                    >
                        <Youtube className="w-5 h-5" />
                        Subscribe on YouTube
                        <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                </div>
            </div>

            {/* Videos Grid */}
            <div className="container mx-auto px-4 py-12">
                {videos.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <YouTubeVideoCard
                                key={video.id}
                                id={video.id}
                                title={video.title}
                                thumbnail={video.thumbnail}
                                publishedAt={video.publishedAt}
                                description={video.description}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Youtube className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-serif font-bold text-gray-600 dark:text-gray-400 mb-2">
                            Videos Coming Soon
                        </h2>
                        <p className="text-gray-400 dark:text-gray-500 mb-6">
                            Visit our YouTube channel to watch our latest videos.
                        </p>
                        <a
                            href="https://www.youtube.com/@myprayertower"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
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
