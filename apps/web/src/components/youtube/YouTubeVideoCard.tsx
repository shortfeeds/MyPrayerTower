'use client';

import { useState } from 'react';
import { Play, Calendar } from 'lucide-react';
import { VideoModal } from '@/components/ui/VideoModal';

interface YouTubeVideoCardProps {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    description?: string;
}

export function YouTubeVideoCard({ id, title, thumbnail, publishedAt, description }: YouTubeVideoCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label={`Watch: ${title}`}
            >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                    </div>
                    {/* YouTube Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-red-600 rounded-md text-white text-[10px] font-bold uppercase tracking-wider">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                            <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {decodeHTMLEntities(title)}
                    </h3>
                    {description && (
                        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                            {decodeHTMLEntities(description)}
                        </p>
                    )}
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </button>

            <VideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                videoUrl={embedUrl}
            />
        </>
    );
}

/** Decode HTML entities from YouTube API (e.g., &amp; → &) */
function decodeHTMLEntities(text: string): string {
    const entities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&apos;': "'",
    };
    return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&apos;/g, (match) => entities[match] || match);
}
