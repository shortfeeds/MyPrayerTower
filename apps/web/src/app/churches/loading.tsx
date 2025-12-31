export default function ChurchesLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header skeleton */}
                <div className="mb-8">
                    <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4" />
                    <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>

                {/* Search bar skeleton */}
                <div className="h-12 w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-8" />

                {/* Grid skeleton */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-4" />
                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
