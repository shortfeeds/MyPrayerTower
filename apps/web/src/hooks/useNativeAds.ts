'use client';

import { useCallback } from 'react';
import { useAdStore } from '../store/useAdStore';

/**
 * Hook to interact with the Native Android Ads Bridge
 */
export function useNativeAds() {
    const { getAdForSection } = useAdStore();

    /**
     * Triggers a native interstitial ad
     * @param sectionKey - The database key for the ad (e.g. 'PRAYER_SUBMIT_INTERSTITIAL')
     */
    const triggerInterstitial = useCallback((sectionKey: string) => {
        // Detect if running in TWA
        const isTwa = typeof window !== 'undefined' && (
            window.matchMedia('(display-mode: standalone)').matches || 
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://')
        );

        if (!isTwa) {
            console.log('Not in TWA, skipping native interstitial');
            return;
        }

        const ad = getAdForSection(sectionKey);
        const unitId = ad?.androidUnitId;

        if (unitId) {
            console.log(`Triggering native interstitial for: ${unitId}`);
            // Use the custom scheme bridge
            window.location.href = `mpt-ads://interstitial?unitId=${unitId}`;
        } else {
            console.warn(`No native AdMob ID found for section: ${sectionKey}`);
        }
    }, [getAdForSection]);

    /**
     * Triggers a native rewarded ad (Placeholder for future implementation)
     */
    const triggerRewarded = useCallback((sectionKey: string) => {
        const isTwa = typeof window !== 'undefined' && (
            window.matchMedia('(display-mode: standalone)').matches || 
            (window.navigator as any).standalone
        );

        if (!isTwa) return;

        const ad = getAdForSection(sectionKey);
        const unitId = ad?.androidUnitId;

        if (unitId) {
            window.location.href = `mpt-ads://rewarded?unitId=${unitId}`;
        }
    }, [getAdForSection]);

    return {
        triggerInterstitial,
        triggerRewarded
    };
}
