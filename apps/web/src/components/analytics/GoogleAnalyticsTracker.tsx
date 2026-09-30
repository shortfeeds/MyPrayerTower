'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

/**
 * Identify AI Engine referrers to provide crystal clear visibility in GA4
 */
function identifyAiReferrer(referrer: string): string | null {
    if (!referrer) return null;
    const lower = referrer.toLowerCase();
    if (lower.includes('chatgpt.com') || lower.includes('chat.openai.com')) return 'ChatGPT';
    if (lower.includes('claude.ai') || lower.includes('anthropic.com')) return 'Claude';
    if (lower.includes('perplexity.ai')) return 'Perplexity';
    if (lower.includes('gemini.google.com') || lower.includes('bard.google.com')) return 'Gemini';
    if (lower.includes('deepseek.com')) return 'DeepSeek';
    if (lower.includes('copilot.microsoft.com') || lower.includes('bing.com/chat')) return 'Copilot';
    if (lower.includes('meta.ai')) return 'Meta AI';
    if (lower.includes('you.com')) return 'You.com';
    return null;
}

export function GoogleAnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const previousPathRef = useRef<string | null>(null);
    const initialReferrerRef = useRef<string>('');

    useEffect(() => {
        if (typeof document !== 'undefined') {
            initialReferrerRef.current = document.referrer;
        }
    }, []);

    useEffect(() => {
        if (!pathname || typeof window === 'undefined') return;

        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        const currentTitle = document.title || 'MyPrayerTower - Catholic Sanctuary';
        
        // Determine correct referrer:
        // On first page load: use document.referrer (e.g. from Google, ChatGPT, Bing)
        // On subsequent in-app page transitions: use the previous URL path
        const referrer = previousPathRef.current 
            ? `${window.location.origin}${previousPathRef.current}` 
            : (initialReferrerRef.current || document.referrer || '(direct)');

        // Log page_view to GA4
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_location: window.location.href,
                page_path: url,
                page_title: currentTitle,
                page_referrer: referrer,
                send_to: 'G-1X6N63VWZH',
            });

            // Check if user arrived from an AI engine
            const aiEngine = identifyAiReferrer(referrer);
            if (aiEngine) {
                window.gtag('event', 'ai_search_visit', {
                    ai_engine: aiEngine,
                    landing_page: url,
                    referrer_url: referrer,
                });
            }
        }

        previousPathRef.current = url;
    }, [pathname, searchParams]);

    return null;
}
