'use client';

import Link from 'next/link';
import { ChevronLeft, Building, Church, Heart, CreditCard, Shield, Users, Globe } from 'lucide-react';

export default function HowWeWorkPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-900 via-primary-950 to-slate-900 text-white py-20">
                <div className="container mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center">
                            <Building className="w-8 h-8 text-primary-300" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-bold">How We Work</h1>
                            <p className="text-primary-200">Transparency in Our Services</p>
                        </div>
                    </div>
                    <p className="text-xl text-blue-100 max-w-3xl leading-relaxed">
                        Understanding how MyPrayerTower connects the faithful with Catholic churches and spiritual services worldwide.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 space-y-10">

                    {/* Who We Are */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Building className="w-6 h-6 text-primary-500" />
                            Who We Are
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            <strong>MyPrayerTower</strong> is a Catholic-owned private technology company based in Mumbai, Maharashtra, India.
                            We have been serving the global Catholic community since <strong>2018</strong>.
                        </p>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                <strong>Important:</strong> MyPrayerTower is a <em>service provider</em>, not a registered charity, parish, diocese,
                                or canonical entity of the Roman Catholic Church. We do not ordain clergy, administer sacraments, or operate
                                under the canonical authority of any bishop or diocese.
                            </p>
                        </div>
                    </section>

                    {/* What We Do */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Globe className="w-6 h-6 text-primary-500" />
                            What We Do
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We serve as a <strong>digital bridge</strong> connecting Catholic faithful around the world with:
                        </p>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                            <li className="flex items-start gap-3">
                                <Church className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Partner Catholic Churches:</strong> We coordinate Mass offerings and spiritual services with verified Catholic parishes and religious communities.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Heart className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Prayer Community:</strong> We provide a platform for users to share prayer intentions and support one another spiritually.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Spiritual Resources:</strong> We curate prayers, readings, devotionals, and Catholic educational content.</span>
                            </li>
                        </ul>
                    </section>

                    {/* How Mass Offerings Work */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Church className="w-6 h-6 text-primary-500" />
                            How Mass Offerings Work
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            When you request a Mass offering through MyPrayerTower:
                        </p>
                        <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
                            <li>We collect your intention and the associated <strong>stipend (service fee)</strong>.</li>
                            <li>We forward your request to one of our <strong>partner Catholic churches</strong> or religious communities.</li>
                            <li>A priest at the partner church celebrates the Mass for your intention according to their schedule.</li>
                            <li>Scheduling and celebration are at the <strong>sole discretion of the receiving clergy</strong>.</li>
                        </ol>
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                <strong>Fulfillment Commitment:</strong> We strive to ensure all Mass requests are honored within 90 days.
                                If we are unable to arrange for a Mass to be celebrated, we will contact you to offer a full refund or alternative arrangement.
                            </p>
                        </div>
                    </section>

                    {/* Virtual Candles & Bouquets */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Heart className="w-6 h-6 text-primary-500" />
                            Virtual Candles & Spiritual Bouquets
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            Our virtual candles and spiritual bouquets are <strong>digital representations</strong> of prayer intentions displayed on our platform. They serve as:
                        </p>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                            <li>• A visible reminder for the community to pray for your intention</li>
                            <li>• A meaningful way to send spiritual gifts to loved ones</li>
                            <li>• A contribution to support our platform and partner church network</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                            <strong>Physical Candles:</strong> As part of our regular spiritual offering program, we periodically light physical
                            candles and offer prayers at partner churches for all intentions received. However, we do not guarantee individual
                            physical candle lighting for each virtual candle purchased.
                        </p>
                    </section>

                    {/* Financial Transparency */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-primary-500" />
                            How Your Contributions Are Used
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            When you pay for services on MyPrayerTower, your funds are allocated approximately as follows:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
                                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">50%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Platform Development & Maintenance</div>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">30%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Partner Church Stipends</div>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">20%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Operations & Support</div>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                <strong>Tax Notice:</strong> MyPrayerTower is NOT a tax-exempt charitable organization in any jurisdiction.
                                Payments made to MyPrayerTower are <strong>not tax-deductible</strong> as charitable contributions.
                            </p>
                        </div>
                    </section>

                    {/* No Guarantees */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-primary-500" />
                            Spiritual Services Disclaimer
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            We facilitate spiritual services with sincerity and reverence for the Catholic faith. However, we make
                            <strong> no representations or warranties</strong> regarding the spiritual efficacy of any prayer, Mass,
                            candle, or bouquet. Faith is deeply personal, and we cannot and do not guarantee answers to prayers,
                            miraculous interventions, or specific spiritual outcomes.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Questions?</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            If you have any questions about how we operate, please contact us at{' '}
                            <a href="mailto:info@myprayertower.com" className="text-primary-600 hover:underline">
                                info@myprayertower.com
                            </a>
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                            <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                            <Link href="/refunds" className="text-primary-600 hover:underline">Refund Policy</Link>
                            <Link href="/contact" className="text-primary-600 hover:underline">Contact Us</Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
