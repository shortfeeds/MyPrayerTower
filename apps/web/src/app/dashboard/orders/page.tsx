'use client';

import { useState, useEffect } from 'react';
import { Church, Heart, Clock, ChevronRight, Download, Filter, RefreshCw, CreditCard, Calendar, Check, Package } from 'lucide-react';
import Link from 'next/link';

interface MassOffering {
    id: string;
    orderNumber: string;
    offeringType: string;
    amount: number;
    intentionFor: string;
    isForLiving: boolean;
    categories: string[];
    status: string;
    createdAt: string;
    celebrationDate?: string;
    certificateUrl?: string;
}

interface Donation {
    id: string;
    orderNumber: string;
    amount: number;
    tier: string;
    status: string;
    createdAt: string;
}

interface Subscription {
    id: string;
    plan: string;
    status: string;
    currentPeriodEnd: string;
    massesRemaining: number;
    price: number;
}

const OFFERING_TYPES: Record<string, string> = {
    REGULAR: 'Single Mass',
    PERPETUAL: 'Perpetual Enrollment',
    NOVENA: 'Novena (9 Masses)',
    GREGORIAN: 'Gregorian (30 Masses)',
    EXPEDITED: 'Expedited Mass',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    PENDING_PAYMENT: { bg: 'bg-gray-100', text: 'text-gray-600' },
    PAID: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    ASSIGNED: { bg: 'bg-blue-100', text: 'text-blue-700' },
    SCHEDULED: { bg: 'bg-purple-100', text: 'text-purple-700' },
    OFFERED: { bg: 'bg-green-100', text: 'text-green-700' },
    COMPLETED: { bg: 'bg-green-200', text: 'text-green-800' },
};

const TIER_LABELS: Record<string, string> = {
    CANDLE: '🕯️ Candle',
    ROSARY: '📿 Rosary',
    SUPPORTER: '⛪ Supporter',
    GUARDIAN: '👼 Guardian',
    BENEFACTOR: '🌟 Benefactor',
    PATRON: '💎 Patron',
    CUSTOM: '❤️ Custom',
};

const PLAN_LABELS: Record<string, { name: string; icon: string }> = {
    PRAYER_PARTNER: { name: 'Prayer Partner', icon: '🙏' },
    FAMILY_PLAN: { name: 'Family Plan', icon: '👨‍👩‍👧‍👦' },
    PATRON_CIRCLE: { name: 'Patron Circle', icon: '💎' },
};

export default function UserOrdersPage() {
    const [activeTab, setActiveTab] = useState<'offerings' | 'donations' | 'subscription'>('offerings');
    const [offerings, setOfferings] = useState<MassOffering[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Mass offerings
            const offeringsRes = await fetch('/api/mass-offerings/my-offerings');
            const offeringsData = await offeringsRes.json();
            setOfferings(offeringsData.offerings || []);

            // Fetch donations
            const donationsRes = await fetch('/api/donations/my-donations');
            const donationsData = await donationsRes.json();
            setDonations(donationsData.donations || []);

            // Fetch subscription
            const subRes = await fetch('/api/donations/my-subscription');
            const subData = await subRes.json();
            setSubscription(subData.subscription || null);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalSpent = [...offerings, ...donations].reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 py-8 text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold">My Orders & Donations</h1>
                    <p className="text-white/80 mt-1">View your Mass offerings, donations, and subscription</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
                        <p className="text-2xl font-bold text-amber-600">{offerings.length}</p>
                        <p className="text-sm text-gray-500">Mass Offerings</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
                        <p className="text-2xl font-bold text-rose-600">{donations.length}</p>
                        <p className="text-sm text-gray-500">Donations</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
                        <p className="text-2xl font-bold text-green-600">${(totalSpent / 100).toFixed(0)}</p>
                        <p className="text-sm text-gray-500">Total Given</p>
                    </div>
                </div>

                {/* Active Subscription Banner */}
                {subscription && subscription.status === 'ACTIVE' && (
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 mb-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{PLAN_LABELS[subscription.plan]?.icon || '✨'}</span>
                                <div>
                                    <p className="font-bold">{PLAN_LABELS[subscription.plan]?.name || subscription.plan}</p>
                                    <p className="text-sm text-white/80">
                                        Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">${Math.round(subscription.price / 100)}/mo</p>
                                <p className="text-sm text-white/80">{subscription.massesRemaining} Masses remaining</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex bg-white rounded-xl p-1 mb-6 shadow-sm border">
                    <button
                        onClick={() => setActiveTab('offerings')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'offerings'
                            ? 'bg-amber-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        ⛪ Mass Offerings
                    </button>
                    <button
                        onClick={() => setActiveTab('donations')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'donations'
                            ? 'bg-rose-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        ❤️ Donations
                    </button>
                    <button
                        onClick={() => setActiveTab('subscription')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'subscription'
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        ✨ Subscription
                    </button>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Mass Offerings Tab */}
                        {activeTab === 'offerings' && (
                            <div className="space-y-3">
                                {offerings.length === 0 ? (
                                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                                        <Church className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 mb-4">No Mass offerings yet</p>
                                        <Link
                                            href="/mass-offerings"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                                        >
                                            Request a Mass <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    offerings.map(offering => (
                                        <div key={offering.id} className="bg-white rounded-xl p-4 shadow-sm border">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[offering.status]?.bg} ${STATUS_COLORS[offering.status]?.text}`}>
                                                            {offering.status === 'OFFERED' ? '✓ Celebrated' : offering.status.replace('_', ' ')}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{offering.orderNumber}</span>
                                                    </div>
                                                    <p className="font-medium text-gray-900">{offering.intentionFor}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {OFFERING_TYPES[offering.offeringType]} • {offering.isForLiving ? 'Living' : 'Deceased'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(offering.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-amber-600">${Math.round(offering.amount / 100)}</p>
                                                    {offering.certificateUrl && (
                                                        <a
                                                            href={offering.certificateUrl}
                                                            className="text-xs text-blue-600 hover:underline flex items-center justify-end gap-1 mt-1"
                                                        >
                                                            <Download className="w-3 h-3" /> Card
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            {offering.celebrationDate && (
                                                <div className="mt-2 pt-2 border-t text-sm text-green-600 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Mass celebrated on {new Date(offering.celebrationDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Donations Tab */}
                        {activeTab === 'donations' && (
                            <div className="space-y-3">
                                {donations.length === 0 ? (
                                    <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                                        <Heart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 mb-4">No donations yet</p>
                                        <Link
                                            href="/donate"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                                        >
                                            Make a Donation <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    donations.map(donation => (
                                        <div key={donation.id} className="bg-white rounded-xl p-4 shadow-sm border">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {TIER_LABELS[donation.tier] || donation.tier}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(donation.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{donation.orderNumber}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        ✓ {donation.status}
                                                    </span>
                                                    <p className="font-bold text-rose-600">${Math.round(donation.amount / 100)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Subscription Tab */}
                        {activeTab === 'subscription' && (
                            <div>
                                {subscription ? (
                                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="text-4xl">{PLAN_LABELS[subscription.plan]?.icon || '✨'}</span>
                                                <div>
                                                    <h2 className="text-xl font-bold">{PLAN_LABELS[subscription.plan]?.name || subscription.plan}</h2>
                                                    <p className="text-gray-500">${Math.round(subscription.price / 100)}/month</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-500">Status</p>
                                                    <p className={`font-bold ${subscription.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {subscription.status === 'ACTIVE' ? '✓ Active' : subscription.status}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-500">Next Billing</p>
                                                    <p className="font-bold">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="bg-purple-50 rounded-lg p-4 mb-6">
                                                <p className="text-sm text-purple-700 font-medium mb-1">Monthly Masses Remaining</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-3 bg-purple-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-purple-500 rounded-full"
                                                            style={{ width: `${(subscription.massesRemaining / 3) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-purple-700">{subscription.massesRemaining}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Link
                                                    href="/mass-offerings"
                                                    className="flex-1 py-3 bg-purple-500 text-white rounded-lg font-medium text-center hover:bg-purple-600"
                                                >
                                                    Use Monthly Mass
                                                </Link>
                                                <button className="px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                                                    Manage
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
                                        <span className="text-4xl">✨</span>
                                        <h3 className="text-lg font-bold mt-3 mb-2">No Active Subscription</h3>
                                        <p className="text-gray-500 mb-4">
                                            Become a Prayer Partner for monthly Masses and special benefits
                                        </p>
                                        <Link
                                            href="/donate"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                        >
                                            View Plans <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <Link
                        href="/mass-offerings"
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border hover:border-amber-300"
                    >
                        <span className="text-2xl">⛪</span>
                        <div>
                            <p className="font-medium">Request a Mass</p>
                            <p className="text-sm text-gray-500">For your intentions</p>
                        </div>
                    </Link>
                    <Link
                        href="/donate"
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border hover:border-rose-300"
                    >
                        <span className="text-2xl">❤️</span>
                        <div>
                            <p className="font-medium">Make a Donation</p>
                            <p className="text-sm text-gray-500">Support our mission</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
