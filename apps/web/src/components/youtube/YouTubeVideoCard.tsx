'use client';

import { useState, useEffect } from 'react';
import { Play, Calendar, ThumbsUp, Share2, UserPlus, Check, Mic, Moon, Heart, Music, BookOpen, Globe, Youtube } from 'lucide-react';
import { VideoModal } from '@/components/ui/VideoModal';

interface YouTubeVideoCardProps {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    description?: string;
    type?: 'short' | 'video' | 'podcast' | 'rosary' | 'novena' | 'hymn' | 'series';
}


export function YouTubeVideoCard({ id, title, thumbnail, publishedAt, description, type }: YouTubeVideoCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Fix hydration mismatch for dates
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const formattedDate = isMounted 
        ? new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : ''; // Avoid mismatch during SSR

    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    const subscribeUrl = `https://www.youtube.com/channel/UCniFNgosITti05xSQ6hqacg?sub_confirmation=1`;

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Watch this video from My Prayer Tower: ${title}`,
                    url: videoUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(videoUrl);
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
        }
    };

    return (
        <>
            <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="relative bg-gray-200 dark:bg-gray-800 overflow-hidden text-left w-full focus:outline-none"
                    style={{ aspectRatio: type === 'short' ? '9/16' : '16/9' }}
                    aria-label={`Watch: ${title}`}
                >


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
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-red-600 rounded-md text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        {renderBadge(type)}
                    </div>

                </button>

                {/* Content */}
                <div className="p-4 flex-grow cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {decodeHTMLEntities(title)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mb-3">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}</span>
                    </div>
                </div>

                {/* Engagement Bar */}
                <div className="px-3 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50 mt-auto bg-gray-50/50 dark:bg-gray-800/20">
                    <div className="flex items-center gap-3">
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors text-[10px] font-bold"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ThumbsUp size={14} />
                            <span>Like</span>
                        </a>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors text-[10px] font-bold"
                        >
                            {isShared ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                            <span>{isShared ? 'Copied' : 'Share'}</span>
                        </button>
                    </div>
                    
                    <a
                        href={subscribeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors text-[10px] font-black uppercase tracking-tight"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <UserPlus size={14} />
                        <span>Subscribe</span>
                    </a>
                </div>
            </div>


            <VideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                videoUrl={embedUrl}
            />
        </>
    );
}

/** Render a specific badge based on video type */
function renderBadge(type?: YouTubeVideoCardProps['type']) {
    switch (type) {
        case 'short':
            return (
                <span className="flex items-center gap-1 tracking-[0.1em]">
                    <Play className="w-3 h-3 fill-current rotate-90" />
                    Shorts
                </span>
            );
        case 'podcast':
            return (
                <span className="flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    Podcast
                </span>
            );
        case 'rosary':
            return (
                <span className="flex items-center gap-1">
                    <Moon className="w-3 h-3" />
                    Rosary
                </span>
            );
        case 'novena':
            return (
                <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Novena
                </span>
            );
        case 'hymn':
            return (
                <span className="flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    Hymn
                </span>
            );
        case 'series':
            return (
                <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Series
                </span>
            );
        default:
            return (
                <span className="flex items-center gap-1">
                    <Youtube className="w-3 h-3" />
                    Video
                </span>
            );
    }
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
