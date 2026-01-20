export default function PrayerWallLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header skeleton */}
                <div className="text-center mb-8">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mb-4" />
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
                </div>

                {/* Add prayer button skeleton */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="h-32 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
                </div>

                {/* Prayer cards skeleton */}
                <div className="max-w-2xl mx-auto space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                <div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
