'use client';

import Link from 'next/link';
import { RefreshCcw, AlertCircle, Clock, Mail, ChevronLeft, CreditCard, HelpCircle, ShieldCheck } from 'lucide-react';

export default function RefundsPage() {
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
                            <RefreshCcw className="w-8 h-8 text-primary-300" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-bold">Refund & Cancellation Policy</h1>
                            <p className="text-primary-200">Last updated: November 7, 2026</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 space-y-10">

                    {/* Overview */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-primary-500" />
                            Overview & Digital Delivery
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            At MyPrayerTower, we are committed to reverent, transparent stewardship. All services offered through our website and mobile application—including Mass intention coordination, virtual candles, digital memorials, sleep stories, and blessings—are <strong>100% digital electronic services</strong>. This policy details our refund criteria, cancellation windows, and resolution mechanisms.
                        </p>
                    </section>

                    {/* Services & Refund Eligibility */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Services & Refund Criteria
                        </h2>

                        <div className="space-y-6">
                            {/* Virtual Candles */}
                            <div className="border-l-4 border-amber-500 pl-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Virtual Prayer Candles & Sanctuary Lamps</h3>
                                <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                                    <li>• <strong>1 Day Candle:</strong> Free devotional offering - No refund applicable.</li>
                                    <li>• <strong>3 Day &amp; 7 Day Candles:</strong> Non-refundable once ignited and displayed in the virtual sanctuary.</li>
                                    <li>• <strong>30 Day Featured Candles &amp; Perpetual Sanctuary Lamps:</strong> Eligible for refund within 24 hours of purchase if display technical failure occurs.</li>
                                </ul>
                            </div>

                            {/* Mass Offerings */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Mass Offering Stipends</h3>
                                <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                                    <li>• <strong>Single Mass ($10), Novena ($75), Gregorian Masses ($200):</strong> Mass offering stipends forwarded to partner Catholic priests cannot be cancelled once scheduled.</li>
                                    <li>• <strong>90-Day Fulfillment Guarantee:</strong> If our pastoral team is unable to coordinate the celebration of your requested Mass intention within 90 days, we will proactively notify you to issue an immediate 100% full refund or alternative arrangement.</li>
                                </ul>
                            </div>

                            {/* Subscriptions & In-App Purchases */}
                            <div className="border-l-4 border-emerald-500 pl-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Subscriptions &amp; App In-App Purchases (Google Play / Web)</h3>
                                <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                                    <li>• <strong>Android In-App Purchases:</strong> Processed through Google Play Billing (Library 8.0+). You can cancel subscriptions at any time via the Google Play Subscriptions Center. Refund requests submitted within 48 hours of billing may be requested directly through Google Play Support or our team.</li>
                                    <li>• <strong>Web Subscriptions:</strong> Can be cancelled at any time; future billing stops immediately while access continues until the end of the paid period.</li>
                                </ul>
                            </div>

                            {/* Spiritual Bouquets & Occasion Blessings */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Spiritual Bouquets &amp; Occasion Blessings</h3>
                                <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                                    <li>• <strong>Spiritual Bouquets:</strong> Non-refundable once generated, personalized, and dispatched electronically to the recipient.</li>
                                    <li>• <strong>Occasion Blessings &amp; Consecrations:</strong> Non-refundable once the digital certificate has been issued and stored in the verification registry.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Cancellation Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            Cancellation Guidelines
                        </h2>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-3">
                            <li className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Pending Orders:</strong> Orders that have not yet been activated or transmitted to partner clergy may be cancelled within 24 hours of payment.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Recurring Subscriptions:</strong> May be cancelled anytime prior to the renewal date. Previous billing cycles are non-refundable.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span><strong>100% Digital Fulfillment:</strong> Because all deliverables are electronic, physical product returns do not apply.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Refund Process */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <HelpCircle className="w-6 h-6 text-primary-500" />
                            How to Request a Refund
                        </h2>
                        <ol className="text-gray-600 dark:text-gray-300 space-y-3 list-decimal list-inside">
                            <li>Email our support desk at <a href="mailto:refunds@myprayertower.com" className="text-primary-600 dark:text-primary-400 underline font-medium">refunds@myprayertower.com</a>.</li>
                            <li>Include your transaction reference, order ID, and account email address.</li>
                            <li>State the reason for your request.</li>
                            <li>Our support team will review and reply within 2–3 business days.</li>
                            <li>Approved refunds are credited back to the original payment method (PayPal or Google Play) within 5–7 business days.</li>
                        </ol>
                    </section>

                    {/* Exceptional Circumstances */}
                    <section className="p-5 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl border border-amber-200/80 dark:border-amber-800/50">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-amber-600" />
                            Technical Errors &amp; Duplicate Billing
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            In the rare event of a payment gateway glitch, duplicate charge, or system error, we issue an immediate, no-questions-asked 100% full refund. Please reach out to us right away so we can resolve it promptly.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary-500" />
                            Contact Us
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            For refund inquiries or assistance, email us directly at{' '}
                            <a href="mailto:refunds@myprayertower.com" className="text-primary-600 dark:text-primary-400 font-semibold underline">
                                refunds@myprayertower.com
                            </a>
                            {' '}or visit our <Link href="/contact" className="text-primary-600 dark:text-primary-400 font-semibold underline">Contact Support Portal</Link>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
