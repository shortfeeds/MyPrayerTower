import { User, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SaintsPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-amber-600" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Saints Library</h1>
                <p className="text-gray-600 mb-8">
                    Discover the lives of the holy men and women who have gone before us. Our comprehensive library is being curated.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-8 opacity-50">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                </div>
                <Link href="/" className="text-amber-600 font-medium hover:underline">
                    Return Home
                </Link>
            </div>
        </div>
    );
}
