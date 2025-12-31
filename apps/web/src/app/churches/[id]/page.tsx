'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    ChevronLeft, MapPin, Phone, Globe, Clock, Calendar, Building2,
    CheckCircle2, AlertCircle, Loader2, Share2, Heart, Sparkles, Mail, Send, Shield, Users, Eye
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Church {
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
    latitude?: number;
    longitude?: number;
    followerCount: number;
    viewCount: number;
    primaryImageUrl?: string;
    dioceseId?: string;
}

// Ad Component
function AdBanner() {
    return (
        <div className="aspect-[4/5] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-blue-200/50 relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-center relative z-10">
                <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500 font-medium">Sponsored</p>
                <Link href="/advertise" className="text-[10px] text-blue-500 hover:underline">Advertise here</Link>
            </div>
        </div>
    );
}

// Inline Claim Form Component
function ClaimForm({ churchId, churchName }: { churchId: string; churchName: string }) {
    const [step, setStep] = useState<'form' | 'verify' | 'success'>('form');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setStep('verify');
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setStep('success');
    };

    if (step === 'success') {
        return (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 text-center border border-emerald-200">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">Claim Submitted!</h3>
                <p className="text-emerald-700 mb-4">
                    Your claim for {churchName} has been submitted. Our team will review and verify your claim within 2-3 business days.
                </p>
                <p className="text-sm text-emerald-600">You'll receive an email notification once approved.</p>
            </div>
        );
    }

    if (step === 'verify') {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Verify Your Email</h3>
                        <p className="text-sm text-gray-500">We sent a code to {formData.email}</p>
                    </div>
                </div>
                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                            maxLength={6}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || verificationCode.length < 6}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Submit Claim'}
                    </button>
                    <button type="button" onClick={() => setStep('form')} className="w-full text-sm text-gray-500 hover:text-gray-700">
                        ← Go back
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Claim This Church</h3>
                    <p className="text-sm text-gray-500">Verify your affiliation to manage this listing</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Fr. John Smith"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="pastor@church.org"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select your role</option>
                        <option value="pastor">Pastor/Priest</option>
                        <option value="deacon">Deacon</option>
                        <option value="secretary">Parish Secretary</option>
                        <option value="administrator">Administrator</option>
                        <option value="other">Other Staff</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Submit Claim</>}
                </button>
            </form>
        </div>
    );
}

export default function ChurchDetailPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const showClaim = searchParams.get('claim') === 'true';

    const [church, setChurch] = useState<Church | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showClaimForm, setShowClaimForm] = useState(showClaim);

    useEffect(() => {
        async function fetchChurch() {
            setLoading(true);
            try {
                const response = await fetch(`/api/churches/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setChurch(data);
                } else {
                    setError('Church not found');
                }
            } catch (err) {
                setError('Failed to load church');
            } finally {
                setLoading(false);
            }
        }
        fetchChurch();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error || !church) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white flex items-center justify-center">
                <div className="text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-10 h-10 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">Church Not Found</h1>
                    <p className="text-gray-500 mb-8">The church you're looking for doesn't exist.</p>
                    <Link href="/churches" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                        ← Back to Churches
                    </Link>
                </div>
            </div>
        );
    }

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
                        <img src={church.primaryImageUrl} alt={church.name} className="w-full h-full object-cover mix-blend-overlay opacity-50" />
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

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
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

                        {/* Mass Schedule */}
                        {church.massSchedule && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-blue-500" /> Mass Schedule
                                </h2>
                                <div className="space-y-6">
                                    {church.massSchedule.sunday && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Sunday</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {church.massSchedule.sunday.map((time: string, i: number) => (
                                                    <span key={i} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-xl text-sm font-medium">
                                                        {time}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {church.massSchedule.saturday && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Saturday</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {church.massSchedule.saturday.map((time: string, i: number) => (
                                                    <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                                                        {time}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {church.massSchedule.weekday && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Weekdays</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {church.massSchedule.weekday.map((time: string, i: number) => (
                                                    <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
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
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-purple-500" /> Confession Schedule
                                </h2>
                                <ul className="space-y-3">
                                    {church.confessionSchedule.times.map((time: string, i: number) => (
                                        <li key={i} className="text-gray-600 flex items-start gap-2">
                                            <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                                            {time}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Inline Claim Form - Only for unverified churches */}
                        {!church.isVerified && showClaimForm && (
                            <ClaimForm churchId={church.id} churchName={church.name} />
                        )}
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

                        {/* Claim Trigger - Only for unverified */}
                        {!church.isVerified && !showClaimForm && (
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6">
                                <h3 className="font-bold text-amber-900 mb-2">Claim This Church</h3>
                                <p className="text-amber-700 text-sm mb-4">
                                    Are you affiliated with this church? Claim it to manage the listing.
                                </p>
                                <button
                                    onClick={() => setShowClaimForm(true)}
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
                                >
                                    Start Claim Process
                                </button>
                            </div>
                        )}

                        {/* Sidebar Ad */}
                        <AdBanner />
                    </div>
                </div>
            </div>
        </div>
    );
}
