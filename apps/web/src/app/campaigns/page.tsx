'use client';

import { useState, useEffect } from 'react';
import { Calendar, Gift, Clock, ArrowRight, Sparkles, Heart, Church, Star } from 'lucide-react';
import Link from 'next/link';

interface Campaign {
    id: string;
    name: string;
    slug: string;
    description: string;
    startDate: string;
    endDate: string;
    bannerImage?: string;
    backgroundColor: string;
    textColor: string;
    icon: string;
    specialOffer?: {
        type: 'discount' | 'bonus' | 'bundle';
        value: string;
        description: string;
    };
    featuredOfferings: string[];
    isActive: boolean;
}

// Seasonal campaigns dynamic generator
function getSeasonalCampaigns(): Campaign[] {
    const now = new Date();
    const currentYear = now.getFullYear();

    const raw = [
        {
            id: 'all-souls',
            name: 'All Souls November',
            slug: 'all-souls',
            description: 'Remember your departed loved ones with Masses throughout November. The Church especially remembers the faithful departed during this holy month.',
            startMonth: 11, startDay: 1, endMonth: 11, endDay: 30,
            backgroundColor: 'from-purple-600 to-indigo-800',
            textColor: 'white',
            icon: '🕯️',
            specialOffer: {
                type: 'bundle' as const,
                value: 'Free Virtual Candle',
                description: 'Every Mass offering includes a free virtual candle lit for 7 days',
            },
            featuredOfferings: ['PERPETUAL', 'GREGORIAN', 'NOVENA'],
        },
        {
            id: 'christmas',
            name: 'Christmas Novena',
            slug: 'christmas',
            description: 'Give the perfect spiritual gift this Christmas. Request a Mass for your loved ones or enroll them in perpetual prayers.',
            startMonth: 12, startDay: 1, endMonth: 12, endDay: 25,
            backgroundColor: 'from-red-600 to-green-700',
            textColor: 'white',
            icon: '🎄',
            specialOffer: {
                type: 'bonus' as const,
                value: 'Free Christmas Card',
                description: 'Beautiful commemorative digital Christmas Mass keepsake generated with any offering',
            },
            featuredOfferings: ['PERPETUAL', 'REGULAR'],
        },
        {
            id: 'lent',
            name: 'Lenten Masses',
            slug: 'lent',
            description: 'Deepen your Lenten journey with daily Masses offered for your intentions. Perfect for prayer, fasting, and almsgiving.',
            startMonth: 3, startDay: 5, endMonth: 4, endDay: 20,
            backgroundColor: 'from-violet-700 to-purple-900',
            textColor: 'white',
            icon: '✝️',
            specialOffer: {
                type: 'discount' as const,
                value: '15% Off',
                description: '15% off Gregorian Masses during Lent',
            },
            featuredOfferings: ['GREGORIAN', 'NOVENA'],
        },
        {
            id: 'easter',
            name: 'Easter Joy',
            slug: 'easter',
            description: 'Celebrate the Resurrection with Masses of thanksgiving and joy. Share Easter blessings with family and friends.',
            startMonth: 4, startDay: 20, endMonth: 5, endDay: 1,
            backgroundColor: 'from-yellow-400 to-orange-500',
            textColor: 'white',
            icon: '🐣',
            featuredOfferings: ['REGULAR', 'PERPETUAL'],
        },
        {
            id: 'mothers-day',
            name: "Mother's Day",
            slug: 'mothers-day',
            description: "Honor your mother with a spiritual bouquet. A Mass offered in her name is the most precious gift.",
            startMonth: 5, startDay: 1, endMonth: 5, endDay: 11,
            backgroundColor: 'from-pink-500 to-rose-600',
            textColor: 'white',
            icon: '💐',
            specialOffer: {
                type: 'bonus' as const,
                value: "Free Mother's Day Card",
                description: 'Beautiful digital card with every Mass offering',
            },
            featuredOfferings: ['REGULAR', 'PERPETUAL'],
        },
        {
            id: 'fathers-day',
            name: "Father's Day",
            slug: 'fathers-day',
            description: "Honor your father with the gift of prayer. A Mass offered in his name shows love that lasts beyond time.",
            startMonth: 6, startDay: 1, endMonth: 6, endDay: 15,
            backgroundColor: 'from-blue-600 to-indigo-700',
            textColor: 'white',
            icon: '👔',
            featuredOfferings: ['REGULAR', 'PERPETUAL'],
        },
    ];

    return raw.map(item => {
        let year = currentYear;
        let start = new Date(year, item.startMonth - 1, item.startDay, 0, 0, 0);
        let end = new Date(year, item.endMonth - 1, item.endDay, 23, 59, 59);

        if (now.getTime() > end.getTime() + 1000 * 60 * 60 * 24 * 30) {
            year += 1;
            start = new Date(year, item.startMonth - 1, item.startDay, 0, 0, 0);
            end = new Date(year, item.endMonth - 1, item.endDay, 23, 59, 59);
        }

        const isCurrentlyOngoing = now >= start && now <= end;
        const isUpcomingSoon = now < start && (start.getTime() - now.getTime()) <= 1000 * 60 * 60 * 24 * 14;

        return {
            id: `${item.id}-${year}`,
            name: item.name,
            slug: item.slug,
            description: item.description,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            backgroundColor: item.backgroundColor,
            textColor: item.textColor,
            icon: item.icon,
            specialOffer: item.specialOffer,
            featuredOfferings: item.featuredOfferings,
            isActive: isCurrentlyOngoing || isUpcomingSoon,
        };
    });
}

export default function SeasonalCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        setCampaigns(getSeasonalCampaigns());
    }, []);

    const activeCampaigns = campaigns.filter(c => c.isActive);
    const upcomingCampaigns = campaigns.filter(c => !c.isActive);

    const getCountdownText = (startDateStr: string, endDateStr: string) => {
        const now = new Date();
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);

        if (now < start) {
            const daysToStart = Math.max(1, Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            return `Starts in ${daysToStart} ${daysToStart === 1 ? 'day' : 'days'}`;
        } else if (now <= end) {
            const daysLeft = Math.max(1, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            return `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`;
        } else {
            return 'Concluded for season';
        }
    };

    return (
        
<div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 py-12 text-white">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-4xl mb-4 block">🗓️</span>
                    <h1 className="text-3xl font-bold">Seasonal Campaigns</h1>
                    <p className="text-white/80 mt-2">Special offerings throughout the liturgical year</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Active Campaigns */}
                {activeCampaigns.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                            Active Now
                        </h2>
                        <div className="space-y-6">
                            {activeCampaigns.map(campaign => (
                                <div
                                    key={campaign.id}
                                    className={`bg-gradient-to-r ${campaign.backgroundColor} rounded-2xl overflow-hidden shadow-lg`}
                                >
                                    <div className="p-8 text-white">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <span className="text-5xl mb-4 block">{campaign.icon}</span>
                                                <h3 className="text-2xl font-bold mb-2">{campaign.name}</h3>
                                                <p className="text-white/80 mb-4 max-w-xl">{campaign.description}</p>

                                                {campaign.specialOffer && (
                                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-4">
                                                        <Gift className="w-5 h-5" />
                                                        <span className="font-bold">{campaign.specialOffer.value}</span>
                                                        <span className="text-white/80">—</span>
                                                        <span className="text-white/80">{campaign.specialOffer.description}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 text-white/80 text-sm mb-6">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {getCountdownText(campaign.startDate, campaign.endDate)}
                                                    </span>
                                                </div>

                                                <Link
                                                    href={`/mass-offerings?campaign=${campaign.slug}`}
                                                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                                                >
                                                    Request Mass <ArrowRight className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Campaigns */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-gray-500" />
                        Upcoming Campaigns
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingCampaigns.map(campaign => (
                            <div
                                key={campaign.id}
                                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{campaign.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{campaign.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <p className="text-gray-600 text-sm">{campaign.description.substring(0, 100)}...</p>

                                        {campaign.specialOffer && (
                                            <div className="mt-3 text-sm">
                                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                                    <Star className="w-3 h-3" />
                                                    {campaign.specialOffer.value}
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-xs text-gray-400 mt-3">
                                            Starts in {getCountdownText(campaign.startDate, campaign.endDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Year-Round Options */}
                <section className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Available Year-Round</h2>
                    <p className="text-gray-600 mb-6">
                        You don't have to wait for a special campaign. Request a Mass for any intention at any time.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/mass-offerings" data-open-offering="mass"
                            className="flex items-center gap-3 bg-white p-4 rounded-xl hover:shadow-md transition-shadow"
                        >
                            <Church className="w-8 h-8 text-amber-600" />
                            <div>
                                <p className="font-medium">Mass Offerings</p>
                                <p className="text-sm text-gray-500">From $15</p>
                            </div>
                        </Link>
                        <Link
                            href="/donate"
                            className="flex items-center gap-3 bg-white p-4 rounded-xl hover:shadow-md transition-shadow"
                        >
                            <Heart className="w-8 h-8 text-rose-600" />
                            <div>
                                <p className="font-medium">Donate</p>
                                <p className="text-sm text-gray-500">Any amount</p>
                            </div>
                        </Link>
                        <Link
                            href="/donate"
                            className="flex items-center gap-3 bg-white p-4 rounded-xl hover:shadow-md transition-shadow"
                        >
                            <Sparkles className="w-8 h-8 text-purple-600" />
                            <div>
                                <p className="font-medium">Subscribe</p>
                                <p className="text-sm text-gray-500">From $9.99/mo</p>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
