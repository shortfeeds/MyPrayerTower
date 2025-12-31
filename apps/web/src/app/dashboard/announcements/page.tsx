'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Pin, MoreHorizontal, Calendar, Send } from 'lucide-react';
import Link from 'next/link';

interface Announcement {
    id: string;
    title: string;
    content: string;
    isPinned: boolean;
    viewCount: number;
    publishedAt: string;
    pushSent: boolean;
}

const demoAnnouncements: Announcement[] = [
    {
        id: '1',
        title: 'Christmas Mass Schedule',
        content: 'Join us for our special Christmas Eve and Christmas Day Masses. See full schedule...',
        isPinned: true,
        viewCount: 342,
        publishedAt: '2024-12-20',
        pushSent: true,
    },
    {
        id: '2',
        title: 'Parish Food Drive This Weekend',
        content: 'Help us support local families in need. Drop off non-perishable items...',
        isPinned: false,
        viewCount: 156,
        publishedAt: '2024-12-18',
        pushSent: true,
    },
    {
        id: '3',
        title: 'New Bible Study Group Starting',
        content: 'Starting January 8th, join our new weekly Bible study group...',
        isPinned: false,
        viewCount: 89,
        publishedAt: '2024-12-15',
        pushSent: false,
    },
];

export default function AnnouncementsPage() {
    const [announcements] = useState<Announcement[]>(demoAnnouncements);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
                    <p className="text-gray-500">Share news and updates with your followers</p>
                </div>

                <Link
                    href="/dashboard/announcements/new"
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Announcement
                </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
                    <p className="text-sm text-gray-500">Total Announcements</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">
                        {announcements.reduce((sum, a) => sum + a.viewCount, 0)}
                    </p>
                    <p className="text-sm text-gray-500">Total Views</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">
                        {announcements.filter(a => a.pushSent).length}
                    </p>
                    <p className="text-sm text-gray-500">Push Notifications Sent</p>
                </div>
            </div>

            {/* Announcements List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Announcement</th>
                            <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Date</th>
                            <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Views</th>
                            <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Status</th>
                            <th className="text-right py-4 px-6 font-medium text-gray-500 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {announcements.map((announcement) => (
                            <tr key={announcement.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-start gap-3">
                                        {announcement.isPinned && (
                                            <Pin className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">{announcement.title}</p>
                                            <p className="text-sm text-gray-500 line-clamp-1">{announcement.content}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(announcement.publishedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Eye className="w-4 h-4" />
                                        {announcement.viewCount}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    {announcement.pushSent ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            <Send className="w-3 h-3" /> Sent
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                            Draft
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {announcements.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No announcements yet</p>
                        <Link
                            href="/dashboard/announcements/new"
                            className="inline-flex items-center gap-2 text-primary-600 font-medium"
                        >
                            <Plus className="w-4 h-4" /> Create your first announcement
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
