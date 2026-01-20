'use client';

import { useState } from 'react';
import { BookOpen, Calendar, RefreshCw, ExternalLink } from 'lucide-react';

export default function AdminReadingsPage() {
    const [loading, setLoading] = useState(false);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Daily Readings</h1>
                    <p className="text-gray-500 mt-1">{today}</p>
                </div>
                <button
                    onClick={() => setLoading(true)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Sync Readings
                </button>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Daily Readings Source</h2>
                        <p className="text-gray-600 mt-1">
                            Daily readings are automatically fetched from the USCCB website.
                            The readings are cached and updated daily at midnight UTC.
                        </p>
                        <a
                            href="https://bible.usccb.org/daily-bible-reading"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 mt-2"
                        >
                            View USCCB Source
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Readings Display */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-500" />
                        First Reading
                    </h3>
                    <p className="text-gray-500 mt-2">
                        Fetched automatically from USCCB. Check the /readings page on the main site to view today's readings.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-500" />
                        Responsorial Psalm
                    </h3>
                    <p className="text-gray-500 mt-2">
                        Fetched automatically from USCCB. Check the /readings page on the main site to view today's readings.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-500" />
                        Second Reading
                    </h3>
                    <p className="text-gray-500 mt-2">
                        (Available on Sundays and Solemnities)
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-500" />
                        Gospel
                    </h3>
                    <p className="text-gray-500 mt-2">
                        Fetched automatically from USCCB. Check the /readings page on the main site to view today's readings.
                    </p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="/readings"
                        target="_blank"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                        View Today's Readings
                    </a>
                    <a
                        href="/bible"
                        target="_blank"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                        Bible Reader
                    </a>
                </div>
            </div>
        </div>
    );
}
