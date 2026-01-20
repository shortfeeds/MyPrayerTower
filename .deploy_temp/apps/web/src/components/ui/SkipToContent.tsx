'use client';

/**
 * SkipToContent - Accessibility component for keyboard navigation
 * Allows users to skip directly to main content
 */
export function SkipToContent() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sacred-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
            Skip to main content
        </a>
    );
}
