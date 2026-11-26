'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Targeted Engagement Action Tracker
 * Specifically measures genuine user engagement & devotional interactions:
 * - "I Prayed for this" / "Pray Now"
 * - "Amen" / "Say Amen & Seal Prayer"
 * - "Light a Candle" / "Vigil Lamp"
 * - "Cathedral Chimes" / "Monastic Chants" / "Sacred Ambiance"
 * - "Dedicate an Offering" / "Holy Mass Intention"
 * - "Holy Rosary & Mysteries"
 * - "Share Prayer / Faith Testimony"
 * 
 * STRICTLY EXCLUDED:
 * - All admin panel pages and buttons (/admin/*)
 * - Sign in / Login / Logout buttons
 * - Close / Dismiss / Cancel buttons
 * - General navigation links & menus
 */
function extractEngagementAction(targetEl: HTMLElement): { target: string; category: string; eventType: string } | null {
    // 1. Explicit engagement attributes
    const explicitAction = targetEl.getAttribute('data-engagement') || targetEl.getAttribute('data-track');
    const explicitCategory = targetEl.getAttribute('data-category');

    // 2. Extract button text, aria-label, title
    const rawText = (targetEl.innerText || targetEl.textContent || '').trim().replace(/\s+/g, ' ');
    const ariaLabel = targetEl.getAttribute('aria-label') || '';
    const title = targetEl.getAttribute('title') || '';
    const combined = `${explicitAction || ''} ${rawText} ${ariaLabel} ${title}`.toLowerCase();

    // 3. STRICT EXCLUSIONS: Skip sign in, login, logout, close, dismiss, cancel
    if (
        /sign in|sign-in|login|log in|logout|log out|close|dismiss|cancel|clear|esc\b/i.test(combined) ||
        targetEl.closest('[aria-label*="close" i], [title*="close" i], .close-button, [data-dismiss]') ||
        rawText === '×' || rawText === '✕' || rawText === 'X' || rawText.toLowerCase() === 'close'
    ) {
        return null;
    }

    // 4. Match genuine devotional engagement patterns:
    // Prayer & Amen
    if (/say amen|seal this prayer|\bamen\b/i.test(combined)) {
        return {
            target: 'Say Amen & Seal Prayer',
            category: 'amen',
            eventType: 'amen_affirmation'
        };
    }

    if (/i prayed for this|i prayed|prayed for this|prayed!|pray now|\bpray\b|anchor your intention/i.test(combined)) {
        return {
            target: 'I Prayed for This',
            category: 'prayer',
            eventType: 'prayer_action'
        };
    }

    // Candle Lighting
    if (/light a candle|light candle|light vigil|relight candle|virtual candle|vigil lamp/i.test(combined)) {
        return {
            target: 'Light a Candle',
            category: 'candle',
            eventType: 'candle_action'
        };
    }

    // Sacred Ambiance & Audio
    if (/cathedral chimes|authentic roman bells/i.test(combined)) {
        return {
            target: 'Cathedral Chimes (Ambiance)',
            category: 'audio',
            eventType: 'audio_play'
        };
    }

    if (/monastic chants|contemplative choir drone|chant/i.test(combined)) {
        return {
            target: 'Monastic Chants (Ambiance)',
            category: 'audio',
            eventType: 'audio_play'
        };
    }

    if (/silence audio|silence ambiance|stop audio/i.test(combined)) {
        return {
            target: 'Silence Sacred Ambiance',
            category: 'audio',
            eventType: 'audio_stop'
        };
    }

    if (/sacred ambiance player/i.test(combined)) {
        return {
            target: 'Open Sacred Ambiance',
            category: 'audio',
            eventType: 'audio_toggle'
        };
    }

    // Offerings & Mass Intentions
    if (/dedicate an offering|holy mass intention|perpetual mass|mass offering|spiritual bouquet/i.test(combined)) {
        return {
            target: 'Dedicate an Offering / Mass Intention',
            category: 'offering',
            eventType: 'offering_action'
        };
    }

    // Rosary & Mysteries
    if (/rosary|next mystery|previous mystery|holy rosary|decade/i.test(combined)) {
        return {
            target: 'Holy Rosary Mystery / Decade',
            category: 'rosary',
            eventType: 'rosary_action'
        };
    }

    // Share & Downloads & Community Faith
    if (/share this prayer|share prayer|share intention|copy link|copy prayer|\bshare\b/i.test(combined)) {
        return {
            target: 'Share Prayer / Intention',
            category: 'social',
            eventType: 'share_action'
        };
    }

    if (/download|certificate|pdf|get the app|google play|play store|install app/i.test(combined)) {
        return {
            target: rawText ? rawText.slice(0, 60) : 'Download / App Action',
            category: 'download',
            eventType: 'download_action'
        };
    }

    if (/submit intention|submit prayer|request prayer/i.test(combined)) {
        return {
            target: 'Submit Prayer Intention',
            category: 'prayer',
            eventType: 'intention_submission'
        };
    }

    // Fallback: If explicit action attribute exists AND is not administrative/auth
    if (explicitAction && !/admin|sign|login|close/i.test(explicitAction)) {
        return {
            target: explicitAction,
            category: explicitCategory || 'devotional',
            eventType: 'engagement_click'
        };
    }

    // Otherwise, not an engagement action -> do not track
    return null;
}

export function CustomerClickTracker() {
    const pathname = usePathname();
    const lastClickRef = useRef<{ target: string; time: number }>({ target: '', time: 0 });

    // NEVER run tracking inside Admin Panel
    const isAdmin = pathname?.startsWith('/admin') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));

    useEffect(() => {
        if (isAdmin) return;

        const handleClick = (e: MouseEvent) => {
            try {
                // Secondary check: Never track if currently within /admin
                const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
                if (currentPath.startsWith('/admin')) {
                    return;
                }

                const targetEl = (e.target as HTMLElement)?.closest('button, a, [role="button"], [data-engagement], [data-track]') as HTMLElement | null;
                if (!targetEl) return;

                const engagement = extractEngagementAction(targetEl);
                if (!engagement) {
                    // Ignore non-engagement clicks (menus, links, navigation, sign-in, close buttons, etc.)
                    return;
                }

                // Deduplicate immediate repeat clicks (<600ms on same action)
                const now = Date.now();
                if (lastClickRef.current.target === engagement.target && (now - lastClickRef.current.time) < 600) {
                    return;
                }
                lastClickRef.current = { target: engagement.target, time: now };

                const payload = JSON.stringify({
                    eventType: engagement.eventType,
                    target: engagement.target,
                    category: engagement.category,
                    path: currentPath,
                    platform: (window.location.search.includes('source=twa') || document.cookie.includes('is_twa=1')) ? 'android' : 'web',
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
    }, [pathname, isAdmin]);

    return null;
}
