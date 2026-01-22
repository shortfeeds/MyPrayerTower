import { Book } from 'lucide-react';
import Link from 'next/link';

export default function BiblePage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Book className="w-10 h-10 text-blue-600" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Holy Bible</h1>
                <p className="text-gray-600 mb-8">
                    The Word of God, coming soon to MyPrayerTower. Read scripture, save highlights, and reflect daily.
                </p>
                <Link href="/" className="text-blue-600 font-medium hover:underline">
                    Return Home
                </Link>
            </div>
        </div>
    );
}
