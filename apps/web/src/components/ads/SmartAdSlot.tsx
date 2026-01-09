'use client';

import { useState, useEffect } from 'react';
import { GoogleAdUnit } from './GoogleAdUnit';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Ad {
    id: string;
    adSource: 'OFFLINE' | 'GOOGLE';
    imageUrl: string;
    linkUrl: string;
    altText: string;
    googleAdUnitId: string;
    position: string;
}

interface SmartAdSlotProps {
    /** Page identifier for fetching relevant ads */
    page: 'home' | 'churches' | 'saints' | 'prayers' | 'bible' | 'readings' | 'prayer-wall' | 'memorials';
    /** Position on the page */
    position: 'top' | 'sidebar' | 'inline' | 'bottom';
    /** Additional CSS classes */
    className?: string;
    /** Show placeholder when no ad available */
    showPlaceholder?: boolean;
}

/**
 * Smart Ad Slot Component
 * 
 * Fetches and displays the appropriate ad based on priority:
 * 1. Offline sponsor ads (higher priority - direct revenue)
 * 2. Google AdSense/AdMob ads (fill unsold inventory)
 * 3. Placeholder with "Advertise here" link
 * 
 * Usage:
 * ```tsx
 * <SmartAdSlot page="prayers" position="sidebar" />
 * ```
 */
export function SmartAdSlot({
    page,
    position,
    className = '',
    showPlaceholder = true
}: SmartAdSlotProps) {
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAd();
    }, [page, position]);

    const fetchAd = async () => {
        try {
            const res = await fetch(`/api/sponsored?page=${page}&position=${position}`);
            const data = await res.json();

            // Get the first matching ad (already sorted by priority on server)
            if (data.ads && data.ads.length > 0) {
                setAd(data.ads[0]);
            }
        } catch (error) {
            console.warn('Failed to fetch ad:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        if (ad?.id && ad.adSource === 'OFFLINE') {
            // Track click for offline ads only (Google tracks its own)
            fetch(`/api/sponsored/${ad.id}/click`, { method: 'POST' }).catch(() => { });
        }
    };

    // Track impression when ad renders
    useEffect(() => {
        if (ad?.id && ad.adSource === 'OFFLINE') {
            fetch(`/api/sponsored/${ad.id}/impression`, { method: 'POST' }).catch(() => { });
        }
    }, [ad?.id]);

    // Loading state
    if (loading) return null;

    // Render Google Ad if source is Google
    if (ad?.adSource === 'GOOGLE' && ad.googleAdUnitId) {
        return (
            <div className={`relative ${className}`}>
                <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 bg-black/50 text-white text-[9px] font-medium rounded">
                    Ad
                </div>
                <GoogleAdUnit
                    slot={ad.googleAdUnitId}
                    format={position === 'sidebar' ? 'rectangle' : position === 'inline' ? 'fluid' : 'horizontal'}
                />
            </div>
        );
    }

    // Render Offline Sponsor Ad
    if (ad?.adSource === 'OFFLINE' && ad.imageUrl) {
        const aspectRatio = position === 'sidebar' ? '300/250' : position === 'top' ? '728/90' : '100%';

        return (
            <div className={`relative ${className}`}>
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded uppercase tracking-wide">
                    Sponsored
                </div>
                <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={handleClick}
                    className="block overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all"
                >
                    <img
                        src={ad.imageUrl}
                        alt={ad.altText || 'Sponsored content'}
                        className="w-full h-full object-cover"
                        style={{ aspectRatio }}
                    />
                </a>
            </div>
        );
    }

    // Placeholder when no ad available
    if (showPlaceholder) {
        const styles = {
            top: 'w-full h-20 bg-gradient-to-r from-gray-100 to-gray-200',
            sidebar: 'w-full aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200',
            inline: 'w-full h-28 bg-gradient-to-r from-gray-50 to-gray-100',
            bottom: 'w-full h-20 bg-gradient-to-r from-gray-100 to-gray-200',
        };

        return (
            <div className={`${styles[position]} rounded-xl flex items-center justify-center border border-gray-200/50 ${className}`}>
                <div className="text-center">
                    <Sparkles className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 font-medium">Sponsored</p>
                    <Link href="/advertise" className="text-[10px] text-blue-500 hover:underline">
                        Advertise here
                    </Link>
                </div>
            </div>
        );
    }

    return null;
}

// Pre-configured slot components for common positions
export function TopBannerAd({ page, className }: { page: SmartAdSlotProps['page']; className?: string }) {
    return <SmartAdSlot page={page} position="top" className={className} />;
}

export function SidebarAd({ page, className }: { page: SmartAdSlotProps['page']; className?: string }) {
    return <SmartAdSlot page={page} position="sidebar" className={className} />;
}

export function InlineAd({ page, className }: { page: SmartAdSlotProps['page']; className?: string }) {
    return <SmartAdSlot page={page} position="inline" className={className} showPlaceholder={false} />;
}

export function BottomBannerAd({ page, className }: { page: SmartAdSlotProps['page']; className?: string }) {
    return <SmartAdSlot page={page} position="bottom" className={className} />;
}
