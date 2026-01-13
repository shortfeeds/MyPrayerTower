import { Shield, Heart, AlertCircle, CheckCircle2, Flag } from 'lucide-react';
import Link from 'next/link';

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
                        Maintaining a sacred, safe, and reverent space for prayer and spiritual growth.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Introduction */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                        MyPrayerTower is a Catholic ministry committed to authentic faith and charity.
                        We welcome believers from all walks of life to join us in prayer. To preserve the spiritual integrity of our community,
                        we uphold the following principles for all content shared on our platform.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Prayer Requests */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Heart className="w-6 h-6 text-rose-500" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prayer Requests</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    <strong>Genuine Intentions:</strong> Prayers should be sincere requests for grace, healing, guidance, or thanksgiving.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    <strong>Respectful Language:</strong> Use reverent and charitable language suitable for a prayer wall.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    <strong>No Political Statements:</strong> Prayers used as vehicles for political campaigning or divisive rhetoric will be removed.
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
                                    Hate speech, harassment, or threats of any kind.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Commercial solicitation, spam, or fundraising links.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Private information about others without their consent.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Content contrary to the teachings of the Catholic Church.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Mass Offerings & Donations */}
                <div className="bg-sacred-900 text-white rounded-3xl p-8 md:p-12 text-center mb-16 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4 font-serif">A Note on Offering Integrity</h2>
                        <p className="max-w-2xl mx-auto text-blue-100 mb-8 leading-relaxed">
                            We take the responsibility of handling Mass intentions and offerings with utmost seriousness.
                            100% of the stipend for Mass offerings is transferred directly to the celebrating priest or parish.
                            Donations support the maintenance of this platform and our charitable partners.
                        </p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                </div>

                {/* Reporting */}
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">See something incorrect?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        If you encounter content that violates these guidelines, please use the "Report" flag on the item or contact us directly.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium transition-colors">
                        Contact Moderation Team
                    </Link>
                </div>
            </div>
        </div>
    );
}
