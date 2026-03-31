'use client';

import { SocialProofToast } from '@/components/engagement/SocialProofToast';
import { PushNotificationPrompt } from '@/components/engagement/PushNotificationPrompt';
import { FloatingPrayerButton } from '@/components/ui/FloatingPrayerButton';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAdStore } from '@/store/useAdStore';
import { AmbientControls } from '@/components/audio/AmbientControls';

/**
 * Global engagement components that appear across the site
 * Includes social proof toasts, push notification prompts, and floating buttons
 */
export function GlobalEngagement() {
    const pathname = usePathname();

    const fetchAds = useAdStore(state => state.fetchAds);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    // Don't show engagement components on admin or payment pages
    const excludedPaths = ['/admin', '/checkout', '/payment'];
    const isExcluded = excludedPaths.some(path => pathname?.startsWith(path));

    if (isExcluded) {
        return null;
    }

    return (
        <>
            {/* Social proof notifications */}
            <SocialProofToast enabled={true} interval={20000} />

            {/* Push notification permission prompt */}
            <PushNotificationPrompt delay={15000} minVisits={2} />

            {/* Floating prayer action button (mobile only) */}
            <FloatingPrayerButton href="/prayers" label="Pray" />

            {/* Atmospheric Sound Controls */}
            <AmbientControls />
        </>
    );
}
