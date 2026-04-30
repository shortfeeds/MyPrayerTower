'use client';

/**
 * Unified Analytics Helper
 * Tracks events via Google Analytics 4
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  try {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }

    // Console for Dev
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}`, params);
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

/**
 * Sacred Hub Specific Events
 */
export const trackHubAction = (action: string, category: string = 'SanctuaryHub') => {
  trackEvent('hub_action', {
    action,
    category,
    platform: 'TWA',
    timestamp: new Date().toISOString()
  });
};
