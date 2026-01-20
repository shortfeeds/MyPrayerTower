'use client';

interface SkeletonProps {
    className?: string;
}

/**
 * Base skeleton component with shimmer effect
 */
export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`skeleton ${className}`} aria-hidden="true" />
    );
}

/**
 * Card skeleton for prayer/saint cards
 */
export function SkeletonCard({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 ${className}`}>
            {/* Header badge */}
            <Skeleton className="h-6 w-24 mb-4" />

            {/* Title */}
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-4" />

            {/* Content lines */}
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />

            {/* Footer */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    );
}

/**
 * Text skeleton for paragraphs
 */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
                />
            ))}
        </div>
    );
}

/**
 * Avatar skeleton
 */
export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return <Skeleton className={`${sizes[size]} rounded-full`} />;
}

/**
 * Image skeleton with aspect ratio
 */
export function SkeletonImage({
    aspectRatio = '16/9',
    className = ''
}: {
    aspectRatio?: string;
    className?: string;
}) {
    return (
        <Skeleton
            className={`w-full ${className}`}
            style={{ aspectRatio }}
        />
    );
}

/**
 * List item skeleton
 */
export function SkeletonListItem() {
    return (
        <div className="flex items-center gap-4 p-4">
            <SkeletonAvatar size="md" />
            <div className="flex-1">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-8 w-16 rounded-full" />
        </div>
    );
}

/**
 * Stats skeleton for counters
 */
export function SkeletonStats({ count = 3 }: { count?: number }) {
    return (
        <div className="flex justify-around">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="text-center">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                </div>
            ))}
        </div>
    );
}

/**
 * Prayer card grid skeleton
 */
export function SkeletonPrayerGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
