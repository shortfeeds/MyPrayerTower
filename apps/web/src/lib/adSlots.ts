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
        banner: process.env.NEXT_PUBLIC_ADSENSE_HOME_BANNER || '2324777328',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_HOME_SIDEBAR || '5549367155',
        inline: process.env.NEXT_PUBLIC_ADSENSE_HOME_INLINE || '7054020518',
    },

    // Prayer Library ads
    prayers: {
        top: process.env.NEXT_PUBLIC_ADSENSE_PRAYERS_TOP || '2324777328',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_PRAYERS_SIDEBAR || '5549367155',
        inline: process.env.NEXT_PUBLIC_ADSENSE_PRAYERS_INLINE || '7054020518',
    },

    // Saints pages ads
    saints: {
        top: process.env.NEXT_PUBLIC_ADSENSE_SAINTS_TOP || '2324777328',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_SAINTS_SIDEBAR || '5549367155',
        inline: process.env.NEXT_PUBLIC_ADSENSE_SAINTS_INLINE || '7054020518',
    },

    // Bible pages ads
    bible: {
        top: process.env.NEXT_PUBLIC_ADSENSE_BIBLE_TOP || '',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_BIBLE_SIDEBAR || '',
        bottom: process.env.NEXT_PUBLIC_ADSENSE_BIBLE_BOTTOM || '',
    },

    // Daily readings ads
    readings: {
        top: process.env.NEXT_PUBLIC_ADSENSE_READINGS_TOP || '',
        inline: process.env.NEXT_PUBLIC_ADSENSE_READINGS_INLINE || '',
        bottom: process.env.NEXT_PUBLIC_ADSENSE_READINGS_BOTTOM || '',
    },

    // Church finder ads
    churches: {
        top: process.env.NEXT_PUBLIC_ADSENSE_CHURCHES_TOP || '',
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_CHURCHES_SIDEBAR || '',
        bottom: process.env.NEXT_PUBLIC_ADSENSE_CHURCHES_BOTTOM || '',
    },

    // Prayer Wall ads
    prayerWall: {
        inline: process.env.NEXT_PUBLIC_ADSENSE_PRAYERWALL_INLINE || '',
    },

    // Blog pages ads
    blog: {
        sidebar: process.env.NEXT_PUBLIC_ADSENSE_BLOG_SIDEBAR || '',
        inline: process.env.NEXT_PUBLIC_ADSENSE_BLOG_INLINE || '',
        bottom: process.env.NEXT_PUBLIC_ADSENSE_BLOG_BOTTOM || '',
    },

    // Rosary page ads
    rosary: {
        bottom: process.env.NEXT_PUBLIC_ADSENSE_ROSARY_BOTTOM || '',
    },

    // Novenas page ads
    novenas: {
        bottom: process.env.NEXT_PUBLIC_ADSENSE_NOVENAS_BOTTOM || '',
        inline: process.env.NEXT_PUBLIC_ADSENSE_NOVENAS_INLINE || '',
    },

    // Guides page ads
    guides: {
        inline: process.env.NEXT_PUBLIC_ADSENSE_GUIDES_INLINE || '',
        bottom: process.env.NEXT_PUBLIC_ADSENSE_GUIDES_BOTTOM || '',
    },

    // Catechism page ads
    catechism: {
        bottom: process.env.NEXT_PUBLIC_ADSENSE_CATECHISM_BOTTOM || '',
    },

    // General / utility page ads (about, contact, careers, etc.)
    general: {
        bottom: process.env.NEXT_PUBLIC_ADSENSE_GENERAL_BOTTOM || '',
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
    return !!(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1009360672921924');
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
        blog: 5,
        guides: 4,
        novenas: 6,
        news: 5,
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
        '/offerings',
        '/candles',
        '/checkout',
        '/login',
        '/register',
        '/confession',
        '/welcome',
        '/privacy',
        '/terms',
        '/cookies',
        '/dmca',
        '/refunds',
    ],
} as const;
