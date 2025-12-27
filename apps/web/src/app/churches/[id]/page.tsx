'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ChevronLeft, MapPin, Phone, Globe, Clock, Calendar, Users,
    CheckCircle2, AlertCircle, Loader2, Share2, Heart
} from 'lucide-react';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Fallback church data when API is unavailable
const fallbackChurches: Record<string, any> = {
    'st-patricks-cathedral-new-york': {
        id: '1',
        name: "St. Patrick's Cathedral",
        type: 'CATHEDRAL',
        address: '460 Madison Ave, New York, NY 10022',
        city: 'New York',
        country: 'United States',
        phone: '+1 212-753-2261',
        website: 'https://saintpatrickscathedral.org',
        isVerified: true,
        description: "St. Patrick's Cathedral is a decorated Neo-Gothic-style Roman Catholic cathedral in the Midtown Manhattan neighborhood of New York City.",
        massSchedule: {
            sunday: ['7:00 AM', '8:00 AM', '9:00 AM', '10:15 AM', '12:00 PM', '1:00 PM', '5:30 PM'],
            saturday: ['8:00 AM', '12:00 PM', '5:30 PM (Vigil)'],
            weekday: ['7:00 AM', '7:30 AM', '8:00 AM', '12:00 PM', '12:30 PM', '1:00 PM', '5:30 PM']
        },
        confessionSchedule: { times: ['Mon-Fri: 11:30 AM - 12:15 PM, 1:00 PM - 1:30 PM', 'Sat: 12:30 PM - 2:00 PM, 4:00 PM - 5:00 PM'] },
        latitude: 40.7586,
        longitude: -73.9760,
    },
    'basilica-national-shrine-washington': {
        id: '2',
        name: 'Basilica of the National Shrine',
        type: 'BASILICA',
        address: '400 Michigan Ave NE, Washington, DC 20017',
        city: 'Washington D.C.',
        country: 'United States',
        phone: '+1 202-526-8300',
        website: 'https://www.nationalshrine.org',
        isVerified: true,
        description: 'The Basilica of the National Shrine of the Immaculate Conception is the largest Catholic church in North America.',
        massSchedule: {
            sunday: ['7:30 AM', '9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '4:30 PM'],
            saturday: ['8:00 AM', '12:00 PM', '5:15 PM (Vigil)'],
            weekday: ['7:00 AM', '7:30 AM', '8:00 AM', '12:00 PM', '5:15 PM']
        },
        latitude: 38.9331,
        longitude: -76.9949,
    },
};

interface Church {
    id: string;
    name: string;
    slug?: string;
    type: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
    website?: string;
    email?: string;
    description?: string;
    isVerified: boolean;
    massSchedule?: any;
    confessionSchedule?: any;
    latitude?: number;
    longitude?: number;
}

export default function ChurchDetailPage({ params }: { params: { id: string } }) {
    const [church, setChurch] = useState<Church | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        async function fetchChurch() {
            setLoading(true);
            try {
                // Try to fetch from API first
                const response = await fetch(`${API_BASE_URL}/churches/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setChurch(data);
                } else {
                    // Fallback to local data
                    const fallback = fallbackChurches[params.id] || Object.values(fallbackChurches)[0];
                    if (fallback) {
                        setChurch(fallback);
                    } else {
                        setError('Church not found');
                    }
                }
            } catch (err) {
                // API unavailable, use fallback
                const fallback = fallbackChurches[params.id] || Object.values(fallbackChurches)[0];
                if (fallback) {
                    setChurch(fallback);
                } else {
                    setError('Church not found');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchChurch();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !church) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Church Not Found</h1>
                    <p className="text-gray-500 mb-6">The church you're looking for doesn't exist.</p>
                    <Link href="/churches" className="text-blue-600 hover:underline">
                        ← Back to Church Finder
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 text-white">
                <div className="container mx-auto px-4">
                    <Link href="/churches" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Church Finder
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded">
                                        {church.type}
                                    </span>
                                    {church.isVerified ? (
                                        <span className="flex items-center gap-1 text-green-200 text-sm">
                                            <CheckCircle2 className="w-4 h-4" /> Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-yellow-200 text-sm">
                                            <AlertCircle className="w-4 h-4" /> Unverified
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl font-bold">{church.name}</h1>
                                <p className="text-blue-200 mt-1">{church.city}, {church.country}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-3 rounded-xl ${isFavorite ? 'bg-white text-red-500' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            >
                                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500' : ''}`} />
                            </button>
                            <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl">
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        {church.description && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                                <p className="text-gray-600 leading-relaxed">{church.description}</p>
                            </div>
                        )}

                        {/* Mass Schedule */}
                        {church.massSchedule && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" /> Mass Schedule
                                </h2>
                                <div className="space-y-4">
                                    {church.massSchedule.sunday && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Sunday</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {church.massSchedule.sunday.map((time: string, i: number) => (
                                                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                        {time}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {church.massSchedule.saturday && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Saturday</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {church.massSchedule.saturday.map((time: string, i: number) => (
                                                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                        {time}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {church.massSchedule.weekday && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Weekdays</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {church.massSchedule.weekday.map((time: string, i: number) => (
                                                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                        {time}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Confession Schedule */}
                        {church.confessionSchedule?.times && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-600" /> Confession Schedule
                                </h2>
                                <ul className="space-y-2">
                                    {church.confessionSchedule.times.map((time: string, i: number) => (
                                        <li key={i} className="text-gray-600">{time}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Address</p>
                                        <p className="text-gray-500 text-sm">{church.address}</p>
                                    </div>
                                </div>
                                {church.phone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">Phone</p>
                                            <a href={`tel:${church.phone}`} className="text-blue-600 text-sm hover:underline">
                                                {church.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {church.website && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">Website</p>
                                            <a
                                                href={church.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 text-sm hover:underline"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map placeholder */}
                        {church.latitude && church.longitude && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Location</h3>
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                    <a
                                        href={`https://www.google.com/maps?q=${church.latitude},${church.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Open in Google Maps
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Claim Church */}
                        {!church.isVerified && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                                <h3 className="font-bold text-yellow-900 mb-2">Claim This Church</h3>
                                <p className="text-yellow-700 text-sm mb-4">
                                    Are you affiliated with this church? Claim it to manage the listing.
                                </p>
                                <Link
                                    href={`/claim/${church.id}`}
                                    className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                                >
                                    Start Claim Process
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
