export default function SaintsLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <div className="h-10 w-48 bg-amber-200/50 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mb-4" />
                    <div className="h-4 w-72 bg-amber-200/50 dark:bg-gray-700 rounded animate-pulse mx-auto" />
                </div>

                {/* Featured saint skeleton */}
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-12">
                    <div className="w-32 h-32 bg-amber-200/50 dark:bg-gray-700 rounded-full animate-pulse mx-auto mb-6" />
                    <div className="h-8 w-48 bg-amber-200/50 dark:bg-gray-700 rounded animate-pulse mx-auto mb-4" />
                    <div className="space-y-2">
                        <div className="h-4 bg-amber-200/50 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 bg-amber-200/50 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-amber-200/50 dark:bg-gray-700 rounded animate-pulse mx-auto" />
                    </div>
                </div>

                {/* Grid skeleton */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4">
                            <div className="w-16 h-16 bg-amber-200/50 dark:bg-gray-700 rounded-full animate-pulse mx-auto mb-3" />
                            <div className="h-5 w-24 bg-amber-200/50 dark:bg-gray-700 rounded animate-pulse mx-auto mb-2" />
                            <div className="h-3 w-16 bg-amber-200/50 dark:bg-gray-700 rounded animate-pulse mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
