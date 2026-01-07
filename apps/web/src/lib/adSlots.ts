/**
 * Centralized AdSense slot configuration
 * Replace the placeholder slot IDs with your actual AdSense slot IDs
 * 
 * To get slot IDs:
 * 1. Go to AdSense Dashboard → Ads → By ad unit
 * 2. Create new ad units with the names below
 * 3. Copy the data-ad-slot value for each unit
 */

export const AD_SLOTS = {
    // Homepage ads
    home: {
        banner: process.env.NEXT_PUBLIC_ADSENSE_HOME_BANNER || '',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_HOME_SIDEBAR || '',
    },

    // Prayer Library ads
    prayers: {
        top: process.env.NEXT_PUBLIC_ADSENSE_PRAYERS_TOP || '',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_PRAYERS_SIDEBAR || '',
        inline: process.env.NEXT_PUBLIC_ADSENSE_PRAYERS_INLINE || '',
    },

    // Saints pages ads
    saints: {
        top: process.env.NEXT_PUBLIC_ADSENSE_SAINTS_TOP || '',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_SAINTS_SIDEBAR || '',
        inline: process.env.NEXT_PUBLIC_ADSENSE_SAINTS_INLINE || '',
    },

    // Bible pages ads
    bible: {
        top: process.env.NEXT_PUBLIC_ADSENSE_BIBLE_TOP || '',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_BIBLE_SIDEBAR || '',
    },

    // Daily readings ads
    readings: {
        top: process.env.NEXT_PUBLIC_ADSENSE_READINGS_TOP || '',
        inline: process.env.NEXT_PUBLIC_ADSENSE_READINGS_INLINE || '',
    },

    // Church finder ads
    churches: {
        top: process.env.NEXT_PUBLIC_ADSENSE_CHURCHES_TOP || '',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_CHURCHES_SIDEBAR || '',
    },

    // Prayer Wall ads
    prayerWall: {
        inline: process.env.NEXT_PUBLIC_ADSENSE_PRAYERWALL_INLINE || '',
    },

    // Global ads
    global: {
        anchor: process.env.NEXT_PUBLIC_ADSENSE_ANCHOR || '',
        interstitial: process.env.NEXT_PUBLIC_ADSENSE_INTERSTITIAL || '',
    },
} as const;

/**
 * Get slot ID for a specific page and position
 */
export function getAdSlot(page: keyof typeof AD_SLOTS, position: string): string {
    const pageSlots = AD_SLOTS[page] as Record<string, string>;
    return pageSlots?.[position] || '';
}

/**
 * Check if ads are enabled (client ID exists)
 */
export function isAdsEnabled(): boolean {
    return !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
}

/**
 * Ad placement configuration
 * Controls frequency and positioning of ads
 */
export const AD_CONFIG = {
    // How often to show inline ads (every N items)
    inlineFrequency: {
        prayers: 8,
        saints: 6,
        prayerWall: 10,
    },

    // Minimum content before showing first inline ad
    minItemsBeforeAd: 3,

    // Whether to show anchor/sticky ads on mobile
    showMobileAnchor: true,

    // Pages that should NOT show ads
    excludedPages: [
        '/admin',
        '/donate',
        '/mass-offerings',
        '/candles',
        '/checkout',
    ],
} as const;
