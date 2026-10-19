/**
 * Universal Analytics & Conversion Tracking Engine
 * For MyPrayerTower (Web, PWA, and TWA Android App)
 */

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

export const GA_TRACKING_ID = 'G-1X6N63VWZH';

/**
 * Detect client platform (Web vs Android TWA vs Standalone PWA)
 */
export function getPlatformType(): 'twa' | 'pwa' | 'web' {
    if (typeof window === 'undefined') return 'web';
    
    // Check if launched via TWA
    if (document.referrer.includes('android-app://') || window.location.search.includes('source=twa')) {
        return 'twa';
    }
    
    // Check if standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
        return 'pwa';
    }

    return 'web';
}

/**
 * Universal Event Tracker for Google Analytics
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
    if (typeof window === 'undefined') return;

    const enrichedParams = {
        platform: getPlatformType(),
        timestamp: new Date().toISOString(),
        url: window.location.href,
        ...params
    };

    if (window.gtag) {
        window.gtag('event', eventName, enrichedParams);
    } else {
        // Queue if gtag is not ready yet
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, ...enrichedParams });
    }
}

/**
 * Conversion: Donation Made
 */
export function trackDonationEvent(amount: number, currency: string = 'USD', tier?: string) {
    trackEvent('donation_complete', {
        value: amount,
        currency,
        tier: tier || 'CUSTOM',
        event_category: 'ecommerce',
        event_label: `Donation: ${currency} ${amount}`
    });
}

/**
 * Conversion: Virtual Candle Lit
 */
export function trackCandleLitEvent(candleId: string, duration: string, amount: number) {
    trackEvent('candle_lit', {
        candle_id: candleId,
        duration,
        amount,
        event_category: 'spiritual_offering',
        event_label: `Candle: ${duration}`
    });
}

/**
 * Conversion: Mass Offering Submitted
 */
export function trackMassOfferingEvent(type: string, amount: number) {
    trackEvent('mass_offering_submitted', {
        offering_type: type,
        value: amount,
        currency: 'USD',
        event_category: 'spiritual_offering',
        event_label: `Mass: ${type}`
    });
}

/**
 * Engagement: Prayer Intention Submitted
 */
export function trackPrayerSubmittedEvent(category?: string, isAnonymous: boolean = false) {
    trackEvent('prayer_submitted', {
        category: category || 'general',
        is_anonymous: isAnonymous,
        event_category: 'engagement',
        event_label: 'Prayer Request'
    });
}

/**
 * Engagement: Telegram Channel Click
 */
export function trackTelegramChannelClick(source: string = 'footer') {
    trackEvent('telegram_join_click', {
        source,
        channel: 't.me/myprayertower',
        event_category: 'social_channel',
        event_label: 'Telegram Join'
    });
}

/**
 * Engagement: App Download Click
 */
export function trackAppDownloadClick(platform: 'android' | 'ios' | 'telegram') {
    trackEvent('app_download_click', {
        platform,
        event_category: 'acquisition',
        event_label: `Download ${platform}`
    });
}

/**
 * Engagement: Hub Action Click
 */
export function trackHubAction(action: string, category: string = 'General') {
    trackEvent(action, {
        action_name: action,
        category,
        event_category: category,
        event_label: action
    });
}


