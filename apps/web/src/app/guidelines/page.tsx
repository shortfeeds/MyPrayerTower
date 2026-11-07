import { Shield, Heart, AlertCircle, CheckCircle2, Flag } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Community Guidelines | MyPrayerTower',
    description: 'Community Guidelines for MyPrayerTower - Maintaining a sacred, reverent, and safe space for prayer and spiritual growth.',
};

export default function GuidelinesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            {/* Header */}
            <div className="bg-primary-950 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
                        <Shield className="w-8 h-8 text-gold-400" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">Community Guidelines</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Maintaining a sacred, safe, and reverent space for prayer, intercession, and spiritual growth.
                    </p>
                    <p className="text-xs text-blue-300 mt-3">Last Updated: November 7, 2026</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Introduction */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                        MyPrayerTower is dedicated to authentic Catholic faith, charity, and mutual prayer.
                        We welcome believers from across 120+ countries to join in united prayer. To preserve the sacred decorum of our community,
                        we uphold the following standards for all content shared on our platform.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Prayer Requests */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Heart className="w-6 h-6 text-rose-500" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prayer Petitions</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    <strong>Genuine Intentions:</strong> Petitions should be sincere requests for grace, healing, deceased loved ones, family peace, or thanksgiving.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    <strong>Reverent Decorum:</strong> Use charitable, dignified language appropriate for an altar and community prayer wall.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    <strong>No Political Rhetoric:</strong> Prayers used as vehicles for partisan campaigning, political hostility, or divisive rhetoric will be removed.
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Prohibited Content */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Flag className="w-6 h-6 text-orange-500" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zero Tolerance</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Hate speech, profanity, harassment, or threats of any kind.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Commercial solicitation, external fundraising links, or spam.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Posting personal contact info, phone numbers, or private details of others without consent.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Content or materials contrary to Catholic moral and doctrinal teachings.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Offering Stewardship */}
                <div className="bg-sacred-900 text-white rounded-3xl p-8 md:p-12 text-center mb-16 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4 font-serif">Devotional Offering Stewardship (70/20/10)</h2>
                        <p className="max-w-2xl mx-auto text-blue-100 mb-6 leading-relaxed">
                            We treat every Mass intention and candle vigil with sacred reverence. Contributions are transparently distributed:
                            70% goes directly to partner Catholic priests for Mass stipends and sanctuary upkeep,
                            20% sustains pastoral intention coordination and certificate verification, and 10% maintains secure cloud infrastructure.
                        </p>
                        <p className="text-xs text-blue-200">
                            All services are 100% digital with no physical shipment. Remittances are classified as commercial digital platform fees and are non-tax-deductible.
                        </p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                </div>

                {/* Reporting */}
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">See content that violates these guidelines?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        If you encounter petitions or comments that violate our standards, click "Report" or reach out directly to our moderation team.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium transition-colors">
                        Contact Moderation Team
                    </Link>
                </div>
            </div>
        </div>
    );
}
