import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/lib/auth';
import type { Metadata } from 'next';
import JourneyContent from './JourneyContent';

export const metadata: Metadata = {
    title: 'My Spiritual Journey - MyPrayerTower',
    description: 'Track your prayer life, view your spiritual growth analytics, complete daily challenges, and earn achievements.',
};

/**
 * Journey page with server-side auth check
 * Redirects to login if not authenticated
 */
export default async function JourneyPage() {
    const user = await getUserFromCookie();

    if (!user) {
        // Redirect to login with return URL
        redirect('/login?redirect=/journey&message=Sign in to access your spiritual journey');
    }

    return (
        <Suspense fallback={<JourneyPageSkeleton />}>
            <JourneyContent />
        </Suspense>
    );
}

function JourneyPageSkeleton() {
    return (
        <div className="min-h-screen bg-cream-50 dark:bg-gray-950">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-sacred-600 to-sacred-700 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="h-8 w-64 bg-white/20 rounded animate-pulse mb-2" />
                        <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto py-4 flex gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto grid gap-6">
                    <div className="h-64 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="h-48 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
                        <div className="h-48 bg-white dark:bg-gray-900 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
