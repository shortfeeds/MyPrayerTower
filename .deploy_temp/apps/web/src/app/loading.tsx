import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center animate-pulse">
                    <span className="text-white font-serif font-bold text-2xl">M</span>
                </div>
                <Loader2 className="w-6 h-6 mx-auto text-gold-500 animate-spin" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
        </div>
    );
}
