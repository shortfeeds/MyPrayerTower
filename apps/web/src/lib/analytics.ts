'use client';

import { track } from '@vercel/analytics/react';

/**
 * Unified Analytics Helper
 * Tracks events across Google Analytics 4 and Vercel Analytics
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  try {
    // 1. Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }

    // 2. Vercel Analytics
    track(eventName, params);

    // 3. Console for Dev
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
