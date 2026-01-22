import { Church, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function ChurchesPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Church className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Find a Church</h1>
                <p className="text-gray-600 mb-8">
                    We are building a global directory of Catholic churches, mass times, and adoration schedules. Check back soon.
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 opacity-60">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                        <Search className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-400 text-sm">Search by city or zip...</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>Use my location</span>
                    </div>
                </div>
                <Link href="/" className="text-emerald-600 font-medium hover:underline">
                    Return Home
                </Link>
            </div>
        </div>
    );
}
