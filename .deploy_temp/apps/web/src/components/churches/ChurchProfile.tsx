'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    ChevronLeft, MapPin, Phone, Globe, Clock, Calendar, Building2,
    CheckCircle2, AlertCircle, Loader2, Share2, Heart, Sparkles, Mail, Send, Shield, Users, Eye,
    User, Image as ImageIcon
} from 'lucide-react';
import { SmartAdSlot } from '@/components/ads';

// Define full interface matching the API response
export interface ChurchStaff {
    id: string;
    name: string;
    title: string;
    imageUrl: string | null;
}

export interface ChurchImage {
    id: string;
    url: string;
    caption: string | null;
    isPrimary: boolean;
}

export interface ChurchEvent {
    id: string;
    title: string;
    startDate: string;
    eventType: string;
}

export interface Church {
    id: string;
    name: string;
    slug?: string;
    type: string;
    denomination?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    website?: string;
    email?: string;
    description?: string;
    isVerified: boolean;
    massSchedule?: any;
    confessionSchedule?: any;
    adorationSchedule?: any;
    latitude?: number;
    longitude?: number;
    followerCount: number;
    viewCount: number;
    primaryImageUrl?: string;
    Diocese?: { id: string; name: string; type: string };
    ChurchStaff?: ChurchStaff[];
    ChurchImage?: ChurchImage[];
    ChurchEvent?: ChurchEvent[];
}

// ClaimForm removed

export function ChurchProfile({ church }: { church: Church }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const getLocationString = () => {
        const parts = [church.city, church.state, church.country, church.postalCode].filter(Boolean);
        return parts.join(', ');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
            {/* Premium Header - Dynamic Background if image exists */}
            <div className={`relative overflow-hidden ${church.primaryImageUrl ? 'h-[500px]' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />

                {church.primaryImageUrl && (
                    <div className="absolute inset-0">
                        <img src={church.primaryImageUrl} alt={church.name} className="w-full h-full object-cover mix-blend-overlay opacity-50" fetchPriority="high" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                        <div className="absolute inset-0 bg-blue-900/30" />
                    </div>
                )}

                {!church.primaryImageUrl && (
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-20 w-80 h-80 bg-purple-400 rounded-full blur-3xl" />
                    </div>
                )}

                <div className="relative z-10 pt-28 pb-12 px-4 h-full flex flex-col justify-between">
                    <div className="container mx-auto">
                        <Link href="/churches" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors group bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-black/30">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Church Finder
                        </Link>
                    </div>

                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex items-start gap-6">
                                {/* Profile Img / Icon */}
                                {!church.primaryImageUrl && (
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-xl flex-shrink-0">
                                        <Building2 className="w-10 h-10 text-white" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                        {church.Diocese && (
                                            <span className="bg-white/90 text-blue-900 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                                {church.Diocese.name}
                                            </span>
                                        )}
                                        {church.denomination && (
                                            <span className="bg-purple-500/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                                                {church.denomination}
                                            </span>
                                        )}
                                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                                            {church.type}
                                        </span>
                                        {church.isVerified ? (
                                            <span className="flex items-center gap-1 text-emerald-300 text-sm font-medium px-3 py-1 bg-emerald-900/30 rounded-full border border-emerald-500/30">
                                                <CheckCircle2 className="w-4 h-4" /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-amber-200 text-sm font-medium px-3 py-1 bg-amber-900/30 rounded-full border border-amber-500/30">
                                                <AlertCircle className="w-4 h-4" /> Unverified
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-2 leading-tight drop-shadow-md">{church.name}</h1>
                                    <p className="text-blue-100 text-lg flex items-center gap-2 drop-shadow-sm">
                                        <MapPin className="w-5 h-5 text-blue-300" />
                                        {getLocationString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`p-4 rounded-2xl transition-all shadow-lg backdrop-blur-md ${isFavorite ? 'bg-white text-rose-500' : 'bg-black/30 text-white hover:bg-black/40 border border-white/20'}`}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-rose-500' : ''}`} />
                                </button>
                                <button className="p-4 bg-black/30 backdrop-blur-md hover:bg-black/40 rounded-2xl border border-white/20 transition-all shadow-lg text-white">
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-6 mt-8 text-white/80 border-t border-white/10 pt-6">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-300" />
                                <span className="font-medium">{church.followerCount.toLocaleString()}</span> Followers
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-blue-300" />
                                <span className="font-medium">{church.viewCount.toLocaleString()}</span> Views
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Ad */}
            <div className="container mx-auto px-4 py-4">
                <SmartAdSlot page="churches" position="top" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 pb-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        {church.description && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">About</h2>
                                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{church.description}</p>
                            </div>
                        )}

                        {/* Gallery */}
                        {church.ChurchImage && church.ChurchImage.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <ImageIcon className="w-6 h-6 text-rose-500" /> Photo Gallery
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {church.ChurchImage.map((img) => (
                                        <div key={img.id} className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative">
                                            <img src={img.url} alt={img.caption || 'Church photo'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            {img.caption && (
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                    <p className="text-white text-xs">{img.caption}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Schedules Block */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-8">
                            {/* Mass Schedule */}
                            {church.massSchedule && (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <Clock className="w-6 h-6 text-blue-500" /> Holy Mass
                                    </h2>
                                    <div className="space-y-6">
                                        {typeof church.massSchedule === 'object' && Object.entries(church.massSchedule as Record<string, any>).map(([day, times]) => (
                                            <div key={day}>
                                                <h3 className="font-semibold text-gray-900 mb-3 capitalize">{day}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {Array.isArray(times) ? times.map((time: string, i: number) => (
                                                        <span key={i} className={`px-4 py-2 rounded-xl text-sm font-medium ${day === 'sunday' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                                                            {time}
                                                        </span>
                                                    )) : (
                                                        <span className="text-gray-600">{String(times)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Separator */}
                            {(church.massSchedule && (church.confessionSchedule || church.adorationSchedule)) && <hr className="border-gray-100" />}

                            {/* Confession Schedule */}
                            {church.confessionSchedule && (
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-purple-500" /> Confession
                                    </h2>
                                    <div className="space-y-3">
                                        {typeof church.confessionSchedule === 'object' && Object.entries(church.confessionSchedule as Record<string, any>).map(([day, times]) => (
                                            <div key={day} className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                                                <span className="font-medium text-gray-900 w-24 capitalize">{day}:</span>
                                                <span className="text-gray-600">{Array.isArray(times) ? times.join(', ') : String(times)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Separator */}
                            {((church.massSchedule || church.confessionSchedule) && church.adorationSchedule) && <hr className="border-gray-100" />}

                            {/* Adoration Schedule */}
                            {church.adorationSchedule && (
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-amber-500" /> Adoration
                                    </h2>
                                    <div className="space-y-3">
                                        {typeof church.adorationSchedule === 'object' && Object.entries(church.adorationSchedule as Record<string, any>).map(([day, times]) => (
                                            <div key={day} className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                                                <span className="font-medium text-gray-900 w-24 capitalize">{day}:</span>
                                                <span className="text-gray-600">{Array.isArray(times) ? times.join(', ') : String(times)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Staff Section */}
                        {church.ChurchStaff && church.ChurchStaff.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Users className="w-6 h-6 text-indigo-500" /> Clergy & Staff
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {church.ChurchStaff.map((staff) => (
                                        <div key={staff.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                                            {staff.imageUrl ? (
                                                <img src={staff.imageUrl} alt={staff.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 border-2 border-white shadow-sm">
                                                    <User className="w-6 h-6" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-gray-900">{staff.name}</h3>
                                                <p className="text-sm text-indigo-600 font-medium">{staff.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upcoming Events */}
                        {church.ChurchEvent && church.ChurchEvent.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-green-500" /> Upcoming Events
                                </h2>
                                <div className="space-y-4">
                                    {church.ChurchEvent.map((event) => (
                                        <div key={event.id} className="flex gap-4 items-start p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="flex flex-col items-center bg-white rounded-lg p-2 border border-gray-200 shadow-sm w-16 flex-shrink-0">
                                                <span className="text-xs font-bold text-red-500 uppercase">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-xl font-bold text-gray-900">{new Date(event.startDate).getDate()}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <span>{event.eventType}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inline Claim Form Removed */}

                        {/* Inline Ad */}
                        <div className="py-4">
                            <SmartAdSlot page="churches" position="inline" />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-5 text-lg">Contact Information</h3>
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Address</p>
                                        <p className="text-gray-500 text-sm whitespace-pre-wrap">{church.address}</p>
                                    </div>
                                </div>
                                {church.phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Phone</p>
                                            <a href={`tel:${church.phone}`} className="text-blue-600 text-sm hover:underline">
                                                {church.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {church.email && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Email</p>
                                            <a href={`mailto:${church.email}`} className="text-blue-600 text-sm hover:underline">
                                                {church.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {church.website && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Globe className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Website</p>
                                            <a href={church.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline break-all">
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map */}
                        {church.latitude && church.longitude && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">Location</h3>
                                <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                                    <a
                                        href={`https://www.google.com/maps?q=${church.latitude},${church.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Open in Google Maps
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Claim Trigger Removed */}

                        {/* Sidebar Ad */}
                        <SmartAdSlot page="churches" position="sidebar" />
                    </div>
                </div>
            </div>
        </div>
    );
}
