'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Search, Church, Navigation, Phone, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface NearbyChurch {
    id: string;
    name: string;
    address: string;
    distance: string;
    massTimes: string[];
    phone?: string;
}

// Sample data - in production, this would come from an API with geolocation
const SAMPLE_CHURCHES: NearbyChurch[] = [
    { id: '1', name: 'St. Patrick\'s Cathedral', address: '5th Avenue, New York, NY', distance: '0.3 mi', massTimes: ['7:00 AM', '8:00 AM', '12:00 PM', '5:30 PM'], phone: '(212) 753-2261' },
    { id: '2', name: 'Holy Name of Jesus Church', address: '96th St, New York, NY', distance: '0.8 mi', massTimes: ['8:30 AM', '10:00 AM', '12:00 PM'], phone: '(212) 749-2200' },
    { id: '3', name: 'Church of St. Francis of Assisi', address: '135 W 31st St, New York, NY', distance: '1.2 mi', massTimes: ['7:00 AM', '8:00 AM', '9:00 AM', '11:00 AM', '12:30 PM', '5:00 PM'], phone: '(212) 736-8500' },
    { id: '4', name: 'St. Agnes Church', address: '143 E 43rd St, New York, NY', distance: '1.5 mi', massTimes: ['7:30 AM', '12:10 PM', '5:30 PM'], phone: '(212) 682-5722' },
];

export default function MassTimesPage() {
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState<string | null>(null);

    useEffect(() => {
        // In production, use geolocation API
        setLocation('New York, NY');
    }, []);

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Clock className="w-4 h-4 text-blue-300" />
                        <span>Find Mass Near You</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Mass Times</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                        Find Catholic churches and Mass times in your area.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Enter city, zip code, or church name..."
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {location && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-blue-200">
                            <MapPin className="w-4 h-4" />
                            <span>Showing results near: {location}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Results */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {SAMPLE_CHURCHES.map(church => (
                        <div key={church.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{church.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        <span>{church.address}</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {church.distance}
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Mass Times</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {church.massTimes.map(time => (
                                        <span key={time} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                                            {time}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                {church.phone && (
                                    <a href={`tel:${church.phone}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{church.phone}</span>
                                    </a>
                                )}
                                <Link href={`/churches`} className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline ml-auto">
                                    View Details <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* External Resources */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold mb-6">More Resources</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://masstimes.org/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            MassTimes.org <ExternalLink className="w-4 h-4" />
                        </a>
                        <a href="https://www.catholicscomehome.org/find-a-parish/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            Find a Parish <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
