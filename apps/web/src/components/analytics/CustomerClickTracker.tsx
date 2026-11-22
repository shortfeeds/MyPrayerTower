'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global Customer Click & Interaction Tracker
 * Automatically captures button clicks, devotional actions, and navigation taps
 * across Website and PWA/TWA app, feeding live counts to the Admin Panel.
 */
export function CustomerClickTracker() {
    const pathname = usePathname();
    const lastClickRef = useRef<{ target: string; time: number }>({ target: '', time: 0 });

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            try {
                const targetEl = (e.target as HTMLElement)?.closest('button, a, [role="button"], [data-track]') as HTMLElement | null;
                if (!targetEl) return;

                // Extract friendly target description
                let target = targetEl.getAttribute('data-track') ||
                             targetEl.getAttribute('aria-label') ||
                             targetEl.getAttribute('title') ||
                             '';

                if (!target) {
                    const text = (targetEl.innerText || targetEl.textContent || '').trim().replace(/\s+/g, ' ');
                    if (text && text.length <= 40) {
                        target = text;
                    } else if (targetEl.tagName.toLowerCase() === 'a') {
                        const href = targetEl.getAttribute('href');
                        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                            target = `Link: ${href}`;
                        }
                    }
                }

                if (!target) return;

                // Deduplicate immediate double clicks (<600ms on same target)
                const now = Date.now();
                if (lastClickRef.current.target === target && (now - lastClickRef.current.time) < 600) {
                    return;
                }
                lastClickRef.current = { target, time: now };

                // Auto categorize
                const lowerTarget = target.toLowerCase();
                let category = 'general';
                if (/pray|rosary|intention|novena|divine mercy|chaplet/i.test(lowerTarget)) {
                    category = 'devotional';
                } else if (/candle|vigil|mass|offering|tribute|memorial|donation|tithing|gift/i.test(lowerTarget)) {
                    category = 'offering';
                } else if (/chimes|chant|sound|audio|silence|ambiance|music|bells/i.test(lowerTarget)) {
                    category = 'audio';
                } else if (/telegram|share|whatsapp|facebook|twitter|youtube/i.test(lowerTarget)) {
                    category = 'social';
                } else if (/menu|explore|search|learn|home|readings|bible|saints/i.test(lowerTarget)) {
                    category = 'navigation';
                }

                const payload = JSON.stringify({
                    eventType: 'click',
                    target: target.slice(0, 150),
                    category,
                    path: pathname || window.location.pathname,
                    platform: window.location.search.includes('source=twa') ? 'android' : 'web',
                });

                if (navigator.sendBeacon) {
                    navigator.sendBeacon('/api/analytics/track', new Blob([payload], { type: 'application/json' }));
                } else {
                    fetch('/api/analytics/track', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: payload,
                        keepalive: true,
                    }).catch(() => {});
                }
            } catch (_) {}
        };

        document.addEventListener('click', handleClick, { capture: true, passive: true });
        return () => {
            document.removeEventListener('click', handleClick, { capture: true });
        };
    }, [pathname]);

    return null;
}
