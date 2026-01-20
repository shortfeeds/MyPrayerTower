'use client';

import { useState } from 'react';
import { Megaphone, Target, Eye, Users, CheckCircle, ArrowRight } from 'lucide-react';

const adPlacements = [
    {
        name: 'Homepage Banner',
        size: '728×90',
        price: 50,
        period: 'week',
        description: 'Top of homepage, maximum visibility',
        impressions: '~10,000/week'
    },
    {
        name: 'Church Finder Sidebar',
        size: '300×250',
        price: 30,
        period: 'week',
        description: 'Sidebar on church search results',
        impressions: '~5,000/week'
    },
    {
        name: 'Prayer Wall Native',
        size: 'Native Ad',
        price: 20,
        period: 'week',
        description: 'Blends with prayer wall content',
        impressions: '~3,000/week'
    },
    {
        name: 'Events Page Banner',
        size: '970×250',
        price: 40,
        period: 'week',
        description: 'Hero banner on events page',
        impressions: '~7,000/week'
    },
    {
        name: 'Newsletter Sponsor',
        size: 'Text + Image',
        price: 100,
        period: 'send',
        description: 'Featured in weekly newsletter',
        impressions: '~15,000 subscribers'
    },
];

export default function AdvertisePage() {
    const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-500 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Megaphone className="w-8 h-8 text-gold-400" />
                        <span className="text-gold-400 font-medium uppercase tracking-widest text-sm">Advertising</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Reach the Catholic <span className="text-gold-400">Community</span>
                    </h1>

                    <p className="text-xl text-primary-100 max-w-2xl mb-8">
                        Connect with engaged Catholics worldwide. Promote your events, products,
                        or services to a faith-focused audience.
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-gold-400" />
                            <span>10,000+ Monthly Visitors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gold-400" />
                            <span>15,000+ Newsletter Subscribers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-gold-400" />
                            <span>Faith-Focused Audience</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ad Placements */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                    Advertising Options
                </h2>
                <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
                    Choose from various placements to reach your target audience.
                    All ads are reviewed for appropriateness.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {adPlacements.map((placement) => (
                        <div
                            key={placement.name}
                            onClick={() => setSelectedPlacement(placement.name)}
                            className={`bg-white rounded-2xl p-6 shadow-sm border-2 cursor-pointer transition-all ${selectedPlacement === placement.name
                                ? 'border-primary-500 ring-4 ring-primary-100'
                                : 'border-gray-100 hover:border-primary-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-gray-900">{placement.name}</h3>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                    {placement.size}
                                </span>
                            </div>

                            <p className="text-gray-500 text-sm mb-4">{placement.description}</p>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-bold text-gray-900">${placement.price}</span>
                                <span className="text-gray-500">/{placement.period}</span>
                            </div>

                            <p className="text-sm text-primary-600">{placement.impressions}</p>

                            {selectedPlacement === placement.name && (
                                <div className="mt-4 flex items-center gap-2 text-primary-600 font-medium">
                                    <CheckCircle className="w-5 h-5" />
                                    Selected
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-primary-50 rounded-2xl p-8 text-center border border-primary-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready to Advertise?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                        Contact us to discuss your advertising goals and get started with a campaign.
                    </p>
                    <a
                        href="mailto:advertising@myprayertower.com"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors"
                    >
                        Contact Sales <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white py-16 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Advertising Guidelines
                    </h2>

                    <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                            <h3 className="font-bold text-green-800 mb-3">✅ Accepted</h3>
                            <ul className="text-green-700 text-sm space-y-2">
                                <li>• Catholic events & retreats</li>
                                <li>• Religious books & media</li>
                                <li>• Church supplies & vestments</li>
                                <li>• Catholic education</li>
                                <li>• Faith-based nonprofits</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                            <h3 className="font-bold text-red-800 mb-3">❌ Not Accepted</h3>
                            <ul className="text-red-700 text-sm space-y-2">
                                <li>• Content contrary to Church teaching</li>
                                <li>• Political campaigns</li>
                                <li>• Gambling or lottery</li>
                                <li>• Alcohol or tobacco</li>
                                <li>• Misleading claims</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
