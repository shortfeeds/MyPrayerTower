'use client';

import Link from 'next/link';
import { Youtube, ArrowRight } from 'lucide-react';
import { YouTubeVideoCard } from '@/components/youtube/YouTubeVideoCard';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
}

interface YouTubeChannelSectionProps {
    /** Videos pre-fetched server-side (ISR cached) — no client-side API call needed */
    videos: Video[];
}

export function YouTubeChannelSection({ videos }: YouTubeChannelSectionProps) {
    // Don't render if no videos
    if (!videos || videos.length === 0) return null;

    return (
        <section className="py-20 bg-[#18120D] border-t border-gold-500/15 text-[#FAF6EE] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-10 right-10 w-96 h-96 bg-crimson-600 rounded-full blur-[150px]" />
                <div className="absolute bottom-10 left-10 w-72 h-72 bg-gold-500 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-600/25 border border-gold-500/30 rounded-full text-sm text-gold-300 mb-6">
                        <Youtube className="w-4 h-4" />
                        <span className="font-medium">Watch &amp; Be Inspired</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-[#FAF6EE] mb-4">
                        Latest from Our Channel
                    </h2>
                    <p className="text-[#CFC5B4] max-w-xl mx-auto text-lg">
                        Short messages of hope, prayers, and daily reminders that Jesus loves you.
                    </p>
                </div>

                {/* Video Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {videos.slice(0, 6).map((video) => (
                        <YouTubeVideoCard
                            key={video.id}
                            id={video.id}
                            title={video.title}
                            thumbnail={video.thumbnail}
                            publishedAt={video.publishedAt}
                        />
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/watch"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg group"
                    >
                        View All Videos
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                        href="https://www.youtube.com/@myprayertower?sub_confirmation=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-red-500/20"
                    >
                        <Youtube className="w-5 h-5" />
                        Subscribe on YouTube
                    </a>
                </div>
            </div>
        </section>
    );
}
