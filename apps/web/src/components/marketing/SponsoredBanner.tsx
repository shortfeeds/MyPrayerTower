'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SponsoredContent {
    id: string;
    type: string;
    title: string;
    description: string | null;
    imageUrl: string;
    linkUrl: string;
    advertiser: string;
}

interface SponsoredBannerProps {
    placement: 'homepage' | 'sidebar' | 'prayer-wall' | 'events' | 'footer';
    className?: string;
}

export function SponsoredBanner({ placement, className = '' }: SponsoredBannerProps) {
    const [content, setContent] = useState<SponsoredContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/sponsored?placement=${placement}`)
            .then(res => res.json())
            .then(data => {
                if (data.content) {
                    setContent(data.content);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [placement]);

    // Track impression
    useEffect(() => {
        if (content?.id) {
            fetch(`/api/sponsored/${content.id}/impression`, { method: 'POST' }).catch(() => { });
        }
    }, [content?.id]);

    const handleClick = () => {
        if (content?.id) {
            fetch(`/api/sponsored/${content.id}/click`, { method: 'POST' }).catch(() => { });
        }
    };

    if (loading || !content) return null;

    const isNative = content.type === 'NATIVE';

    return (
        <div className={`relative ${className}`}>
            {/* Sponsored Label */}
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded uppercase tracking-wide">
                Sponsored
            </div>

            <a
                href={content.linkUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={handleClick}
                className={`block overflow-hidden transition-all ${isNative
                        ? 'bg-gradient-to-r from-primary-50 to-gold-50 border border-primary-100 rounded-xl p-4 hover:shadow-md'
                        : 'rounded-xl shadow-sm hover:shadow-lg'
                    }`}
            >
                {isNative ? (
                    // Native Ad (text + small image)
                    <div className="flex gap-4">
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={content.imageUrl}
                                alt={content.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">
                                {content.title}
                            </h4>
                            {content.description && (
                                <p className="text-gray-600 text-xs line-clamp-2">
                                    {content.description}
                                </p>
                            )}
                            <span className="text-primary-600 text-xs font-medium mt-1 inline-block">
                                Learn More →
                            </span>
                        </div>
                    </div>
                ) : (
                    // Banner Ad (image only)
                    <div className="relative w-full" style={{ aspectRatio: placement === 'sidebar' ? '300/250' : '728/90' }}>
                        <img
                            src={content.imageUrl}
                            alt={content.title}
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                )}
            </a>
        </div>
    );
}

// Sidebar Banner Component
export function SidebarSponsor({ className = '' }: { className?: string }) {
    return <SponsoredBanner placement="sidebar" className={className} />;
}

// Homepage Hero Banner
export function HomepageSponsor({ className = '' }: { className?: string }) {
    return <SponsoredBanner placement="homepage" className={className} />;
}

// Native Ad for Prayer Wall
export function PrayerWallSponsor({ className = '' }: { className?: string }) {
    return <SponsoredBanner placement="prayer-wall" className={className} />;
}
