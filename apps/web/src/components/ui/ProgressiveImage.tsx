'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ProgressiveImageProps extends Omit<ImageProps, 'onLoad'> {
    /** Low-res blur placeholder (optional, will auto-generate if not provided) */
    blurSrc?: string;
    /** Container className */
    containerClassName?: string;
}

/**
 * Progressive image loading with blur-up effect
 * Uses Next.js Image with custom blur transition
 */
export function ProgressiveImage({
    blurSrc,
    containerClassName = '',
    className = '',
    alt,
    ...props
}: ProgressiveImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {/* Low-res placeholder or gradient */}
            {!isLoaded && !error && (
                <div
                    className="absolute inset-0 skeleton"
                    style={{
                        backgroundImage: blurSrc ? `url(${blurSrc})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}

            {/* Main image */}
            <Image
                {...props}
                alt={alt}
                className={`
                    ${className}
                    transition-all duration-500
                    ${isLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                onLoad={() => setIsLoaded(true)}
                onError={() => setError(true)}
            />

            {/* Error fallback */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <span className="text-gray-400 text-sm">Image unavailable</span>
                </div>
            )}
        </div>
    );
}

/**
 * Lazy loading image that loads when visible
 */
export function LazyImage({
    src,
    alt,
    className = '',
    containerClassName = '',
    ...props
}: Omit<ProgressiveImageProps, 'blurSrc'>) {
    const [isInView, setIsInView] = useState(false);
    const [ref, setRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '50px' }
        );

        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref]);

    return (
        <div ref={setRef} className={`relative overflow-hidden ${containerClassName}`}>
            {isInView ? (
                <ProgressiveImage
                    src={src}
                    alt={alt}
                    className={className}
                    {...props}
                />
            ) : (
                <div className="skeleton w-full h-full" style={{ aspectRatio: '16/9' }} />
            )}
        </div>
    );
}
