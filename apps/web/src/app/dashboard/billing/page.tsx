'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle, ArrowUpRight, Zap, Crown, Building2 } from 'lucide-react';
import Link from 'next/link';



export default function BillingPage() {
    const [currentTier] = useState('BASIC'); // In production, fetch from API

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
                <p className="text-gray-500">Manage your church portal subscription</p>
            </div>

            {/* Current Plan */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-primary-100 text-sm mb-1">Current Plan</p>
                        <h2 className="text-2xl font-bold mb-2">Basic Parish</h2>
                        <p className="text-primary-100">
                            Active Account
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Active</span>
                    </div>
                </div>
            </div>



            {/* Payment History */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Payment History</h2>

                <table className="w-full">
                    <thead className="border-b border-gray-100">
                        <tr>
                            <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                            <th className="text-left py-3 text-sm font-medium text-gray-500">Description</th>
                            <th className="text-left py-3 text-sm font-medium text-gray-500">Amount</th>
                            <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-right py-3 text-sm font-medium text-gray-500">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="py-4 text-gray-900">Dec 20, 2024</td>
                            <td className="py-4 text-gray-600">Basic Parish Plan</td>
                            <td className="py-4 text-gray-900 font-medium">$99.00</td>
                            <td className="py-4">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Paid
                                </span>
                            </td>
                            <td className="py-4 text-right">
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                    Download
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Need Help */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <p className="text-gray-600 mb-4">
                    Need help with billing? Contact our support team.
                </p>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline"
                >
                    Contact Support <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
