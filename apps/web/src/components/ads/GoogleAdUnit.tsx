'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface GoogleAdUnitProps {
    /** AdSense slot ID (e.g., "1234567890") */
    slot: string;
    /** Ad format - auto adjusts to container, or specify format */
    format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle' | 'fluid';
    /** Full width responsive (default: true) */
    responsive?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Container style */
    style?: React.CSSProperties;
}

/**
 * Google AdSense unit component for web.
 * Renders a responsive ad from Google AdSense.
 * 
 * Usage:
 * ```tsx
 * <GoogleAdUnit slot="1234567890" format="auto" />
 * ```
 */
export function GoogleAdUnit({
    slot,
    format = 'auto',
    responsive = true,
    className = '',
    style
}: GoogleAdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        // Only load once per component instance
        if (isLoaded.current) return;

        try {
            // Push ad to queue
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isLoaded.current = true;
        } catch (error) {
            console.warn('AdSense push failed:', error);
        }
    }, []);

    const isDev = process.env.NODE_ENV === 'development';

    if (!slot) return null;

    // Detect if this is an AdMob ID (contains /) or AdSense ID (numeric)
    const isAdMob = slot.includes('/');
    const adClient = isAdMob ? (slot.split('/')[0].startsWith('ca-app-pub-') ? slot.split('/')[0] : process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) : process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    const finalSlot = isAdMob ? slot.split('/')[1] : slot;

    return (
        <div className={`adsense-container relative overflow-hidden flex items-center justify-center ${className}`} style={{ minHeight: '100px', ...style }}>
            {isDev && (
                <div className="absolute inset-0 bg-blue-500/10 border border-dashed border-blue-500 flex items-center justify-center pointer-events-none z-10">
                    <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        {isAdMob ? 'AdMob' : 'AdSense'}: {slot}
                    </span>
                </div>
            )}
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%', ...style }}
                data-ad-client={adClient || 'ca-pub-1009360672921924'}
                data-ad-slot={finalSlot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
}

// Pre-configured ad sizes
export function BannerAd({ slot, className }: { slot: string; className?: string }) {
    return <GoogleAdUnit slot={slot} format="horizontal" className={className} />;
}

export function SidebarAd({ slot, className }: { slot: string; className?: string }) {
    return <GoogleAdUnit slot={slot} format="rectangle" className={className} />;
}

export function InlineAd({ slot, className }: { slot: string; className?: string }) {
    return <GoogleAdUnit slot={slot} format="fluid" className={className} />;
}
