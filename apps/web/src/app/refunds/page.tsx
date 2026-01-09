'use client';

import Link from 'next/link';
import { RefreshCcw, AlertCircle, Clock, Mail, ChevronLeft, CreditCard, HelpCircle } from 'lucide-react';

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
                            <p className="text-primary-200">Last updated: January 2026</p>
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
                            Overview
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            At MyPrayerTower, we strive to provide meaningful spiritual services. This policy outlines
                            our refund and cancellation procedures for all paid services on our platform.
                        </p>
                    </section>

                    {/* Services & Refund Eligibility */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Services & Refund Eligibility
                        </h2>

                        <div className="space-y-6">
                            {/* Virtual Candles */}
                            <div className="border-l-4 border-amber-500 pl-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Virtual Prayer Candles</h3>
                                <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                                    <li>• <strong>1 Day Candle:</strong> Free - No refund applicable</li>
                                    <li>• <strong>3 Day Candle:</strong> ₹249 / $2.99 - Non-refundable once lit</li>
                                    <li>• <strong>7 Day Candle:</strong> ₹499 / $5.99 - Non-refundable once lit</li>
                                    <li>• <strong>30 Day Featured Candle:</strong> ₹1,249 / $14.99 - Refund within 24 hours if not displayed</li>
                                    <li>• <strong>Memorial Setup:</strong> Basic ($20) / Premium ($49) - Refundable within 48h if unsatisfied</li>
                                </ul>
                            </div>

                            {/* Mass Offerings */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Mass Offerings</h3>
                                <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                                    <li>• <strong>Single Mass:</strong> ₹830 / $10.00</li>
                                    <li>• <strong>Novena of Masses:</strong> ₹6,225 / $75.00</li>
                                    <li>• <strong>Gregorian Masses:</strong> ₹16,600 / $200.00</li>
                                    <li>• <strong>Perpetual Enrollment:</strong> ₹8,300 / $100.00</li>
                                </ul>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                                    Mass offerings can be refunded before the Mass is offered. Once scheduled, refunds are not possible.
                                </p>
                            </div>

                            {/* Donations */}
                            <div className="border-l-4 border-green-500 pl-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Donations</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Donations are voluntary contributions and are generally non-refundable.
                                    If you made a donation in error, please contact us within 7 days.
                                </p>
                            </div>

                            {/* Spiritual Bouquets */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Spiritual Bouquets</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Spiritual Bouquets can be refunded within 24 hours of purchase if not yet delivered to the recipient.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Cancellation Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            Cancellation Policy
                        </h2>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-3">
                            <li className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Cancellation requests</strong> must be made within 24 hours of purchase for eligible services.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Recurring donations</strong> can be cancelled at any time. Future payments will stop, but past donations are non-refundable.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Digital services</strong> that have been delivered or activated cannot be cancelled.</span>
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
                            <li>Email us at <a href="mailto:refunds@myprayertower.com" className="text-primary-600 hover:underline">refunds@myprayertower.com</a></li>
                            <li>Include your order ID/transaction reference</li>
                            <li>Provide the reason for your refund request</li>
                            <li>Our team will review and respond within 3-5 business days</li>
                            <li>Approved refunds will be processed to the original payment method within 7-10 business days</li>
                        </ol>
                    </section>

                    {/* Exceptions */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Exceptions
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            In cases of technical errors, duplicate charges, or fraudulent transactions,
                            we will issue a full refund regardless of the above policies. Please contact us
                            immediately if you experience any payment issues.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary-500" />
                            Contact Us
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            For refund requests or questions about this policy, please contact us at{' '}
                            <a href="mailto:info@myprayertower.com" className="text-primary-600 hover:underline">
                                info@myprayertower.com
                            </a>
                            {' '}or visit our <Link href="/contact" className="text-primary-600 hover:underline">Contact Page</Link>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
