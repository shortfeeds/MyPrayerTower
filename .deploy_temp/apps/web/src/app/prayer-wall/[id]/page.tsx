'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Heart, MessageCircle, Share2, Flag, Clock, User } from 'lucide-react';
import Link from 'next/link';

// Mock prayer data
const prayer = {
    id: '1',
    content: 'Please pray for my mother who is undergoing cancer treatment. She has been fighting bravely for the past 6 months, and we are hoping for good news from the doctors next week. Your prayers mean so much to our family during this difficult time. God bless you all.',
    category: 'Health',
    visibility: 'public',
    isAnonymous: false,
    userName: 'Maria S.',
    createdAt: '2 hours ago',
    prayerCount: 156,
    comments: [
        { id: '1', userName: 'John D.', content: 'Praying for your mother and your family. Stay strong! 🙏', createdAt: '1 hour ago' },
        { id: '2', userName: 'Sarah M.', content: 'God is with you. I will include her in my daily rosary.', createdAt: '45 min ago' },
        { id: '3', userName: 'Anonymous', content: 'Lifting her up in prayer. May God grant her healing.', createdAt: '30 min ago' },
    ],
};

export default function PrayerWallDetailPage({ params }: { params: { id: string } }) {
    const [hasPrayed, setHasPrayed] = useState(false);
    const [prayerCount, setPrayerCount] = useState(prayer.prayerCount);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(prayer.comments);

    const handlePray = () => {
        if (!hasPrayed) {
            setHasPrayed(true);
            setPrayerCount(prev => prev + 1);
        }
    };

    const handleComment = () => {
        if (newComment.trim()) {
            setComments(prev => [
                ...prev,
                { id: Date.now().toString(), userName: 'You', content: newComment, createdAt: 'Just now' },
            ]);
            setNewComment('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 py-8 text-white">
                <div className="container mx-auto px-4">
                    <Link href="/prayer-wall" className="inline-flex items-center gap-2 text-rose-200 hover:text-white mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Prayer Wall
                    </Link>
                    <h1 className="text-2xl font-bold">Prayer Request</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Main Prayer Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-rose-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">{prayer.userName}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>{prayer.createdAt}</span>
                                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-xs">{prayer.category}</span>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Flag className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-700 text-lg leading-relaxed mb-6">{prayer.content}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={handlePray}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${hasPrayed
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${hasPrayed ? 'fill-white' : ''}`} />
                            {hasPrayed ? 'Praying' : 'Pray'} ({prayerCount})
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium">
                            <Share2 className="w-5 h-5" />
                            Share
                        </button>
                    </div>
                </div>

                {/* Comments */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-rose-500" />
                        Prayer Support ({comments.length})
                    </h2>

                    {/* Add Comment */}
                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Leave an encouraging message..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500"
                        />
                        <button
                            onClick={handleComment}
                            className="px-6 py-3 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700"
                        >
                            Send
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium text-gray-900">{comment.userName}</p>
                                        <p className="text-xs text-gray-500">{comment.createdAt}</p>
                                    </div>
                                    <p className="text-gray-600">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
