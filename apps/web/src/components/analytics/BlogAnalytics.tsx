'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

export function BlogAnalytics() {
  useEffect(() => {
    const handleCtaClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link) {
        const href = link.getAttribute('href') || '';
        const text = link.innerText || '';

        // Track clicks to specific high-value services
        if (href.includes('candles') || href.includes('prayer-wall') || href.includes('telegram') || href.includes('play.google.com')) {
          sendGAEvent('event', 'blog_cta_click', {
            event_category: 'Conversion',
            event_label: text,
            value: href,
          });
          console.log(`GA Event Tracked: blog_cta_click - ${text}`);
        }
      }
    };

    document.addEventListener('click', handleCtaClick);
    return () => document.removeEventListener('click', handleCtaClick);
  }, []);

  return null;
}
