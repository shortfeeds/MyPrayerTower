'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Star, BookOpen, ChevronRight, Search } from 'lucide-react';

// Mock saint data
const todaySaint = {
    name: 'St. Stephen',
    title: 'First Martyr',
    feastDay: 'December 26',
    imageUrl: null,
    shortBio: 'St. Stephen was one of the seven deacons appointed by the apostles. He was the first Christian martyr, stoned to death for his faith.',
    patronOf: ['Deacons', 'Headaches', 'Stonecutters'],
};

const upcomingSaints = [
    { name: 'St. John the Apostle', date: 'Dec 27', title: 'Apostle & Evangelist' },
    { name: 'Holy Innocents', date: 'Dec 28', title: 'Martyrs' },
    { name: 'St. Thomas Becket', date: 'Dec 29', title: 'Bishop & Martyr' },
    { name: 'St. Sylvester I', date: 'Dec 31', title: 'Pope' },
    { name: 'Mary, Mother of God', date: 'Jan 1', title: 'Solemnity' },
    { name: 'St. Basil the Great', date: 'Jan 2', title: 'Bishop & Doctor' },
];

export default function SaintsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUpcoming = upcomingSaints.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        ⭐ Saints Calendar
                    </h1>
                    <p className="text-purple-100 text-lg max-w-2xl mx-auto">
                        Discover the inspiring lives of saints and their feast days throughout the year
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Today's Saint - Featured */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-gold-500" />
                            Today's Saint
                        </h2>

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="md:flex">
                                {/* Image/Placeholder */}
                                <div className="md:w-1/3 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-8">
                                    <div className="w-32 h-32 bg-purple-200 rounded-full flex items-center justify-center">
                                        <Star className="w-16 h-16 text-purple-400" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="md:w-2/3 p-6">
                                    <div className="flex items-center gap-2 text-purple-600 text-sm font-medium mb-2">
                                        <Calendar className="w-4 h-4" />
                                        {todaySaint.feastDay}
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                        {todaySaint.name}
                                    </h3>
                                    <p className="text-gray-500 mb-4">{todaySaint.title}</p>

                                    <p className="text-gray-700 mb-4">{todaySaint.shortBio}</p>

                                    <div className="mb-4">
                                        <span className="text-sm font-medium text-gray-700">Patron of: </span>
                                        <span className="text-sm text-gray-600">{todaySaint.patronOf.join(', ')}</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <Link
                                            href={`/saints/${todaySaint.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Read Full Biography
                                        </Link>
                                        <button className="px-6 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors">
                                            Prayer to St. Stephen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Saints */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            Upcoming Feast Days
                        </h2>

                        {/* Search in sidebar */}
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search saints..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            {filteredUpcoming.length > 0 ? filteredUpcoming.map((saint, i) => (
                                <Link
                                    key={i}
                                    href={`/saints/${saint.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{saint.name}</p>
                                        <p className="text-sm text-gray-500">{saint.title}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-purple-600 font-medium">{saint.date}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </Link>
                            )) : (
                                <div className="p-4 text-center text-sm text-gray-500">No saints found</div>
                            )}
                        </div>

                        <Link
                            href="/saints/calendar?full=true"
                            className="block text-center mt-4 text-purple-600 hover:text-purple-700 font-medium"
                        >
                            View Full Calendar →
                        </Link>
                    </div>
                </div>

                {/* Browse by Month */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Month</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                            <Link
                                key={month}
                                href={`/saints/month/${i + 1}`}
                                className="py-3 bg-white hover:bg-purple-50 text-center rounded-lg text-gray-700 hover:text-purple-600 font-medium transition-colors shadow-sm"
                            >
                                {month}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
