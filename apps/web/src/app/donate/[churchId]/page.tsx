'use client';

import { useState } from 'react';
import { ChevronLeft, Heart, DollarSign, CreditCard, Check, Gift } from 'lucide-react';
import Link from 'next/link';

// Mock church data
const church = {
    id: '1',
    name: "St. Patrick's Cathedral",
    isVerified: true,
    hasStripe: true,
};

const DONATION_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function DonatePage({ params }: { params: { churchId: string } }) {
    const [amount, setAmount] = useState<number | null>(50);
    const [customAmount, setCustomAmount] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const selectedAmount = customAmount ? parseFloat(customAmount) : amount;

    const handleSubmit = async () => {
        // TODO: Create Stripe checkout session
        console.log({
            churchId: params.churchId,
            amount: selectedAmount! * 100, // cents
            isRecurring,
            message,
            isAnonymous,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12 text-white">
                <div className="container mx-auto px-4">
                    <Link href={`/churches/${params.churchId}`} className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Church
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Gift className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-green-200">Support</p>
                            <h1 className="text-3xl font-bold">{church.name}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    {/* Amount Selection */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Select Amount</h2>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {DONATION_AMOUNTS.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => {
                                        setAmount(amt);
                                        setCustomAmount('');
                                    }}
                                    className={`py-4 rounded-xl font-semibold text-lg transition-all ${amount === amt && !customAmount
                                            ? 'bg-green-600 text-white ring-2 ring-green-300'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    ${amt}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="number"
                                placeholder="Custom amount"
                                value={customAmount}
                                onChange={(e) => {
                                    setCustomAmount(e.target.value);
                                    setAmount(null);
                                }}
                                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            />
                        </div>
                    </div>

                    {/* Recurring Toggle */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-gray-900">Make this a monthly donation</p>
                                <p className="text-sm text-gray-500">Support this church every month</p>
                            </div>
                            <button
                                onClick={() => setIsRecurring(!isRecurring)}
                                className={`relative w-14 h-8 rounded-full transition-colors ${isRecurring ? 'bg-green-600' : 'bg-gray-200'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow ${isRecurring ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Add a Message (Optional)</h2>
                        <textarea
                            placeholder="Leave an encouraging message for the church..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            rows={3}
                        />
                    </div>

                    {/* Anonymous */}
                    <label className="flex items-center gap-3 mb-8 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="w-5 h-5 text-green-600 rounded"
                        />
                        <span className="text-gray-700">Make my donation anonymous</span>
                    </label>

                    {/* Summary */}
                    {selectedAmount && selectedAmount > 0 && (
                        <div className="bg-green-50 rounded-xl p-6 mb-8">
                            <h3 className="font-bold text-green-800 mb-2">Donation Summary</h3>
                            <div className="flex justify-between text-green-900">
                                <span>{isRecurring ? 'Monthly' : 'One-time'} donation</span>
                                <span className="font-bold text-xl">${selectedAmount.toFixed(2)}</span>
                            </div>
                            <p className="text-green-700 text-sm mt-2">
                                Your donation supports {church.name} and their mission.
                            </p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAmount || selectedAmount <= 0}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <CreditCard className="w-5 h-5" />
                        Donate ${selectedAmount?.toFixed(2) || '0.00'}
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-4">
                        🔒 Secure payment powered by Stripe
                    </p>
                </div>
            </div>
        </div>
    );
}
