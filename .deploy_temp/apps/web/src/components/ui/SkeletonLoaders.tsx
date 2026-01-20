import { Skeleton } from '@/components/ui/Skeleton';

export function HeroSkeleton() {
    return (
        <div className="relative min-h-[600px] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 w-full">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <Skeleton className="h-16 w-3/4 mx-auto bg-white/10 rounded-2xl" />
                    <Skeleton className="h-6 w-1/2 mx-auto bg-white/5 rounded-xl" />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Skeleton className="h-14 w-48 bg-white/10 rounded-xl" />
                        <Skeleton className="h-14 w-48 bg-white/5 rounded-xl" />
                    </div>
                </div>
            </div>
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <Skeleton className="w-full h-full bg-gray-900" />
            </div>
        </div>
    );
}

export function PrayerCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                    <Skeleton className="h-6 w-1/3 rounded-lg" />
                    <Skeleton className="h-4 w-1/4 rounded bg-gray-100 dark:bg-gray-700" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-700">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    );
}

export function ChurchCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col">
            <Skeleton className="h-48 w-full" />
            <div className="p-5 space-y-4 flex-1">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-full rounded" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-2/3 rounded" />
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function SectionSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <PrayerCardSkeleton key={i} />
            ))}
        </div>
    );
}
