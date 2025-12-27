/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

// Screen reader announcements
export function announceForAccessibility(message: string) {
    if (typeof window !== 'undefined') {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Focus management
export function focusElement(selector: string) {
    if (typeof window !== 'undefined') {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
            element.focus();
        }
    }
}

// Skip to main content
export function setupSkipLink() {
    if (typeof window !== 'undefined') {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-4 focus:rounded-lg focus:shadow-lg';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// High contrast mode detection
export function prefersHighContrast(): boolean {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-contrast: more)').matches;
    }
    return false;
}

// Reduced motion detection
export function prefersReducedMotion(): boolean {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
}

// Color contrast checker (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
export function getContrastRatio(color1: string, color2: string): number {
    const getLuminance = (hex: string) => {
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

// Keyboard trap prevention
export function trapFocus(containerSelector: string) {
    if (typeof window === 'undefined') return () => { };

    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return () => { };

    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
}

// ARIA live region for dynamic content
export const AriaLiveRegion = {
    polite: (id: string) => ({
        id,
        role: 'status',
        'aria-live': 'polite',
        'aria-atomic': 'true',
    }),
    assertive: (id: string) => ({
        id,
        role: 'alert',
        'aria-live': 'assertive',
        'aria-atomic': 'true',
    }),
};
