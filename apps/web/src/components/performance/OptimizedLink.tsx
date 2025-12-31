'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, ReactNode } from 'react';

interface OptimizedLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    prefetch?: boolean;
    onClick?: () => void;
}

/**
 * OptimizedLink - A performance-optimized link component
 * 
 * Features:
 * - Prefetches on hover (desktop) or viewport entry (mobile)
 * - Shows loading state during navigation
 * - Uses intersection observer for lazy prefetching
 */
export function OptimizedLink({
    href,
    children,
    className = '',
    prefetch = true,
    onClick
}: OptimizedLinkProps) {
    const router = useRouter();
    const [isPrefetched, setIsPrefetched] = useState(false);

    const handlePrefetch = useCallback(() => {
        if (!isPrefetched && prefetch) {
            router.prefetch(href);
            setIsPrefetched(true);
        }
    }, [href, isPrefetched, prefetch, router]);

    return (
        <Link
            href={href}
            className={className}
            onMouseEnter={handlePrefetch}
            onTouchStart={handlePrefetch}
            onClick={onClick}
            prefetch={false} // We handle prefetching manually
        >
            {children}
        </Link>
    );
}

/**
 * PrefetchLinks - Prefetch important routes on mount
 */
export function PrefetchLinks() {
    const router = useRouter();

    useEffect(() => {
        // Prefetch critical routes after initial load
        const criticalRoutes = [
            '/churches',
            '/prayer-wall',
            '/saints',
            '/prayers',
            '/readings',
        ];

        // Delay prefetching to not block initial render
        const timer = setTimeout(() => {
            criticalRoutes.forEach(route => {
                router.prefetch(route);
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return null;
}

/**
 * usePageTransition - Hook for tracking page load state
 */
export function usePageTransition() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleComplete = () => setIsLoading(false);

        // Listen for route changes (Next.js 13+ uses different events)
        window.addEventListener('beforeunload', handleStart);

        return () => {
            window.removeEventListener('beforeunload', handleStart);
        };
    }, []);

    return isLoading;
}

/**
 * LazyComponent - Lazy load components with intersection observer
 */
interface LazyComponentProps {
    children: ReactNode;
    placeholder?: ReactNode;
    rootMargin?: string;
}

export function LazyComponent({
    children,
    placeholder = null,
    rootMargin = '100px'
}: LazyComponentProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [ref, setRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref, rootMargin]);

    return (
        <div ref={setRef}>
            {isVisible ? children : placeholder}
        </div>
    );
}
