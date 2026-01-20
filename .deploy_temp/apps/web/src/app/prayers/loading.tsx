export default function PrayersLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header skeleton */}
                <div className="mb-8">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4" />
                    <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>

                {/* Categories skeleton */}
                <div className="flex gap-3 mb-8 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
                    ))}
                </div>

                {/* Grid skeleton */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
