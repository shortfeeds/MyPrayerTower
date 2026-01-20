'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calendar, Church as ChurchIcon, Plus, Check, AlertCircle } from 'lucide-react';
import { logConfession } from '@/app/actions/spiritual';

export default function ConfessionTrackerPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [churchName, setChurchName] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [lastConfession, setLastConfession] = useState<Date | null>(null);

    // Calculate days since last confession
    const daysSinceConfession = lastConfession
        ? Math.floor((Date.now() - new Date(lastConfession).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const getReminderStatus = () => {
        if (!daysSinceConfession) return null;
        if (daysSinceConfession > 60) return { color: 'red', message: 'It has been over 60 days since your last confession.' };
        if (daysSinceConfession > 30) return { color: 'amber', message: 'Consider going to confession soon.' };
        return { color: 'green', message: 'You are on track with regular confession.' };
    };

    const reminderStatus = getReminderStatus();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await logConfession({
                date: new Date(date),
                notes: notes || undefined
            });
            setSuccess(true);
            setLastConfession(new Date(date));
            setNotes('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-xl mx-auto">
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                        Confession Tracker
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Privately track your confession dates to maintain a regular practice.
                    </p>

                    {/* Status Card */}
                    {reminderStatus && (
                        <div className={`p-4 rounded-xl mb-8 border ${reminderStatus.color === 'green' ? 'bg-emerald-50 border-emerald-200' :
                                reminderStatus.color === 'amber' ? 'bg-amber-50 border-amber-200' :
                                    'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-start gap-3">
                                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${reminderStatus.color === 'green' ? 'text-emerald-500' :
                                        reminderStatus.color === 'amber' ? 'text-amber-500' :
                                            'text-red-500'
                                    }`} />
                                <div>
                                    <p className={`font-medium ${reminderStatus.color === 'green' ? 'text-emerald-800' :
                                            reminderStatus.color === 'amber' ? 'text-amber-800' :
                                                'text-red-800'
                                        }`}>
                                        {daysSinceConfession} days since last confession
                                    </p>
                                    <p className={`text-sm mt-1 ${reminderStatus.color === 'green' ? 'text-emerald-600' :
                                            reminderStatus.color === 'amber' ? 'text-amber-600' :
                                                'text-red-600'
                                        }`}>
                                        {reminderStatus.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="p-4 rounded-xl mb-6 bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <p className="text-emerald-700">Confession logged successfully.</p>
                        </div>
                    )}

                    {/* Log Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-semibold text-lg text-gray-900 mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary-600" />
                            Log a Confession
                        </h2>

                        <div className="space-y-6">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Confession
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Church (Optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Church (Optional)
                                </label>
                                <div className="relative">
                                    <ChurchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={churchName}
                                        onChange={(e) => setChurchName(e.target.value)}
                                        placeholder="e.g., St. Mary's Cathedral"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Private Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any personal reflections..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    These notes are completely private and only visible to you.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Log Confession'}
                            </button>
                        </div>
                    </form>

                    {/* Prepare Link */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/confession"
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Need to prepare? Use our Examination of Conscience →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
