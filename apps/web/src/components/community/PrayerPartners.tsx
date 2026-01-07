'use client';

import { useState, useEffect } from 'react';
import { Heart, Users, Send, MessageCircle, Search, Filter, UserPlus, Check, X } from 'lucide-react';
import Link from 'next/link';

interface PrayerPartner {
    id: string;
    name: string;
    avatar?: string;
    location?: string;
    prayerInterests: string[];
    streak?: number;
    matchScore?: number;
    status: 'available' | 'matched' | 'pending';
}

interface PartnerRequest {
    id: string;
    fromUser: {
        id: string;
        name: string;
        avatar?: string;
    };
    message?: string;
    createdAt: Date;
}

// Sample data
const SAMPLE_PARTNERS: PrayerPartner[] = [
    {
        id: '1',
        name: 'Maria G.',
        location: 'Rome, Italy',
        prayerInterests: ['Rosary', 'Divine Mercy', 'Saints'],
        streak: 45,
        matchScore: 95,
        status: 'available',
    },
    {
        id: '2',
        name: 'Joseph M.',
        location: 'Manila, Philippines',
        prayerInterests: ['Novenas', 'Adoration', 'Rosary'],
        streak: 120,
        matchScore: 88,
        status: 'available',
    },
    {
        id: '3',
        name: 'Sarah K.',
        location: 'Dublin, Ireland',
        prayerInterests: ['Lectio Divina', 'Daily Mass', 'Saints'],
        streak: 30,
        matchScore: 82,
        status: 'available',
    },
];

/**
 * Prayer partners discovery and matching interface
 */
export function PrayerPartnerFinder() {
    const [partners, setPartners] = useState<PrayerPartner[]>(SAMPLE_PARTNERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const interests = ['Rosary', 'Divine Mercy', 'Novenas', 'Saints', 'Adoration', 'Lectio Divina', 'Daily Mass'];

    const filteredPartners = partners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesInterests = selectedInterests.length === 0 ||
            selectedInterests.some(i => partner.prayerInterests.includes(i));
        return matchesSearch && matchesInterests;
    });

    const handleSendRequest = (partnerId: string) => {
        setPartners(prev => prev.map(p =>
            p.id === partnerId ? { ...p, status: 'pending' } : p
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Find Prayer Partners</h2>
                    <p className="text-gray-500 dark:text-gray-400">Connect with others who share your prayer journey</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or location..."
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-sacred-500 focus:border-sacred-500"
                    />
                </div>
            </div>

            {/* Interest filters */}
            <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                    <button
                        key={interest}
                        onClick={() => setSelectedInterests(prev =>
                            prev.includes(interest)
                                ? prev.filter(i => i !== interest)
                                : [...prev, interest]
                        )}
                        className={`
                            px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                            ${selectedInterests.includes(interest)
                                ? 'bg-sacred-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }
                        `}
                    >
                        {interest}
                    </button>
                ))}
            </div>

            {/* Partner Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPartners.map(partner => (
                    <PartnerCard
                        key={partner.id}
                        partner={partner}
                        onSendRequest={handleSendRequest}
                    />
                ))}
            </div>

            {filteredPartners.length === 0 && (
                <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No partners found</h3>
                    <p className="text-gray-500 dark:text-gray-500">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
}

/**
 * Individual partner card
 */
function PartnerCard({
    partner,
    onSendRequest
}: {
    partner: PrayerPartner;
    onSendRequest: (id: string) => void;
}) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sacred-500 to-sacred-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
                    {partner.avatar ? (
                        <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        partner.name.charAt(0)
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{partner.name}</h3>
                        {partner.matchScore && partner.matchScore >= 90 && (
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
                                {partner.matchScore}% match
                            </span>
                        )}
                    </div>

                    {partner.location && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{partner.location}</p>
                    )}

                    {/* Interests */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {partner.prayerInterests.slice(0, 3).map(interest => (
                            <span key={interest} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                                {interest}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    {partner.streak && partner.streak > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            🔥 {partner.streak} day streak
                        </p>
                    )}

                    {/* Action */}
                    {partner.status === 'available' ? (
                        <button
                            onClick={() => onSendRequest(partner.id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sacred-600 text-white text-sm font-medium rounded-lg hover:bg-sacred-700 transition-colors"
                        >
                            <UserPlus size={16} />
                            Send Request
                        </button>
                    ) : partner.status === 'pending' ? (
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm font-medium rounded-lg cursor-not-allowed"
                        >
                            Request Sent
                        </button>
                    ) : (
                        <button
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-lg"
                        >
                            <Check size={16} />
                            Matched!
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Partner requests inbox
 */
export function PartnerRequestsInbox({ requests }: { requests: PartnerRequest[] }) {
    const handleAccept = (requestId: string) => {
        // In production, call API
        console.log('Accept request:', requestId);
    };

    const handleDecline = (requestId: string) => {
        // In production, call API
        console.log('Decline request:', requestId);
    };

    if (requests.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p>No pending requests</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {requests.map(request => (
                <div key={request.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold">
                        {request.fromUser.avatar ? (
                            <img src={request.fromUser.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            request.fromUser.name.charAt(0)
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                            {request.fromUser.name}
                        </p>
                        {request.message && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{request.message}</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAccept(request.id)}
                            className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                            <Check size={18} />
                        </button>
                        <button
                            onClick={() => handleDecline(request.id)}
                            className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Current partner card (for matched partners)
 */
export function CurrentPartnerCard({ partner }: { partner: PrayerPartner }) {
    return (
        <div className="bg-gradient-to-r from-sacred-50 to-gold-50 dark:from-sacred-900/20 dark:to-gold-900/20 rounded-2xl border border-sacred-100 dark:border-sacred-800 p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sacred-500 to-sacred-600 flex items-center justify-center text-white text-xl font-bold">
                    {partner.name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{partner.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your Prayer Partner</p>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                {partner.streak && (
                    <span>🔥 {partner.streak} day streak</span>
                )}
                {partner.location && (
                    <span>📍 {partner.location}</span>
                )}
            </div>

            <div className="flex gap-2">
                <Link
                    href={`/messages/${partner.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sacred-600 text-white text-sm font-medium rounded-lg hover:bg-sacred-700 transition-colors"
                >
                    <MessageCircle size={16} />
                    Message
                </Link>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-sm font-medium rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors">
                    <Heart size={16} />
                    Pray Together
                </button>
            </div>
        </div>
    );
}
