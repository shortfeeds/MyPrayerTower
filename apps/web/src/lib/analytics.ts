/**
 * Universal Analytics & Conversion Tracking Engine
 * For MyPrayerTower (Web, PWA, and TWA Android App)
 * Full GA4 E-Commerce & Lifecycle Standard Implementation
 */

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

export const GA_TRACKING_ID = (process.env.NEXT_PUBLIC_GA_ID || 'G-XHPBKVZBZH').trim();

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
        page_location: window.location.href,
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

/* =====================================================================
   GA4 STANDARD E-COMMERCE FUNNEL EVENTS
===================================================================== */

/**
 * Standard GA4 view_item event
 */
export function trackViewItem(itemName: string, value: number, currency: string = 'USD', itemId?: string, category: string = 'Spiritual Offering') {
    trackEvent('view_item', {
        currency,
        value: typeof value === 'number' ? value : parseFloat(value || '0'),
        items: [{
            item_id: itemId || itemName.toLowerCase().replace(/\s+/g, '_'),
            item_name: itemName,
            price: typeof value === 'number' ? value : parseFloat(value || '0'),
            quantity: 1,
            item_category: category
        }]
    });
}

/**
 * Standard GA4 add_to_cart event
 */
export function trackAddToCart(itemName: string, value: number, currency: string = 'USD', itemId?: string, category: string = 'Spiritual Offering', quantity: number = 1) {
    trackEvent('add_to_cart', {
        currency,
        value: typeof value === 'number' ? value : parseFloat(value || '0'),
        items: [{
            item_id: itemId || itemName.toLowerCase().replace(/\s+/g, '_'),
            item_name: itemName,
            price: typeof value === 'number' ? value : parseFloat(value || '0'),
            quantity,
            item_category: category
        }]
    });
}

/**
 * Standard GA4 begin_checkout event
 */
export function trackBeginCheckout(itemName: string, value: number, currency: string = 'USD', itemId?: string, category: string = 'Spiritual Offering') {
    trackEvent('begin_checkout', {
        currency,
        value: typeof value === 'number' ? value : parseFloat(value || '0'),
        items: [{
            item_id: itemId || itemName.toLowerCase().replace(/\s+/g, '_'),
            item_name: itemName,
            price: typeof value === 'number' ? value : parseFloat(value || '0'),
            quantity: 1,
            item_category: category
        }]
    });
}

/**
 * Standard GA4 purchase event (Key Event / Conversion)
 */
export function trackPurchase(
    transactionId: string, 
    value: number, 
    items: Array<{ item_id: string; item_name: string; price: number; quantity?: number; item_category?: string }>, 
    currency: string = 'USD'
) {
    const numericValue = typeof value === 'number' ? value : parseFloat(value || '0');
    trackEvent('purchase', {
        transaction_id: transactionId,
        value: numericValue,
        currency,
        items: items.length > 0 ? items.map(item => ({
            item_id: item.item_id,
            item_name: item.item_name,
            price: typeof item.price === 'number' ? item.price : parseFloat(item.price || '0'),
            quantity: item.quantity || 1,
            item_category: item.item_category || 'Spiritual Offering'
        })) : [{
            item_id: transactionId,
            item_name: 'Spiritual Offering',
            price: numericValue,
            quantity: 1,
            item_category: 'Spiritual Offering'
        }]
    });
}

/* =====================================================================
   GA4 STANDARD LIFECYCLE & KEY EVENTS
===================================================================== */

/**
 * Standard GA4 qualify_lead / generate_lead (Direct match for Key Events)
 */
export function trackQualifyLead(leadType: string, value: number = 0, currency: string = 'USD') {
    trackEvent('qualify_lead', {
        lead_type: leadType,
        value,
        currency,
        event_category: 'leads'
    });
    trackEvent('generate_lead', {
        lead_type: leadType,
        value,
        currency,
        event_category: 'leads'
    });
}

/**
 * Standard GA4 sign_up event
 */
export function trackSignUp(method: string = 'email') {
    trackEvent('sign_up', {
        method,
        event_category: 'engagement'
    });
}

/**
 * Standard GA4 login event
 */
export function trackLogin(method: string = 'email') {
    trackEvent('login', {
        method,
        event_category: 'engagement'
    });
}

/**
 * Standard GA4 share event
 */
export function trackShare(method: string, contentType: string, itemId?: string) {
    trackEvent('share', {
        method,
        content_type: contentType,
        item_id: itemId || contentType
    });
}

/**
 * Cart Abandonment Telemetry
 */
export function trackCartAbandoned(type: string, value: number, email?: string, step?: string) {
    trackEvent('cart_abandoned', {
        cart_type: type,
        value: typeof value === 'number' ? value : parseFloat(value || '0'),
        currency: 'USD',
        step: step || 'CHECKOUT_DROPOFF',
        has_email: Boolean(email)
    });
}

/* =====================================================================
   DEVOTIONAL & DOMAIN CONVERSION EVENTS
===================================================================== */

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
 * Conversion: Spiritual Bouquet Created
 */
export function trackSpiritualBouquetEvent(bouquetId: string, amount: number, recipient: string) {
    trackEvent('spiritual_bouquet_created', {
        bouquet_id: bouquetId,
        value: amount,
        recipient_name: recipient,
        currency: 'USD',
        event_category: 'spiritual_offering',
        event_label: `Bouquet for ${recipient}`
    });
}

/**
 * Conversion: Sacred Blessing Ritual Completed
 */
export function trackBlessingRequestedEvent(occasion: string, amount: number) {
    trackEvent('blessing_ritual_completed', {
        occasion,
        value: amount,
        currency: 'USD',
        event_category: 'spiritual_offering',
        event_label: `Blessing: ${occasion}`
    });
}

/**
 * Conversion: Tabernacle Sanctuary Vigil / Perpetual Lamp Lit
 */
export function trackTabernacleVigilEvent(vigilType: string, amount: number) {
    trackEvent('tabernacle_vigil_lit', {
        vigil_type: vigilType,
        value: amount,
        currency: 'USD',
        event_category: 'spiritual_offering',
        event_label: `Vigil: ${vigilType}`
    });
}

/**
 * Conversion: Candle Lit
 */
export function trackCandleLitEvent(candleId: string, duration: string, amount: number) {
    trackEvent('candle_lit', {
        candle_id: candleId,
        duration,
        value: amount,
        currency: 'USD',
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
    trackQualifyLead('PRAYER_INTENTION');
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
