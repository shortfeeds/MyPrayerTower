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

    return (
        <div className={`adsense-container relative ${className}`} style={{ minHeight: '100px', ...style }}>
            {isDev && (
                <div className="ad-dev-debug-overlay">
                    <span className="ad-dev-debug-label">Google Ad: {slot}</span>
                </div>
            )}
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%', ...style }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1009360672921924'}
                data-ad-slot={slot}
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
