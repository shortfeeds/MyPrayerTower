'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Flag, CheckCircle, Filter } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockPrayers = [
    {
        id: '1',
        content: 'Please pray for my mother who is having surgery tomorrow. We trust in God\'s healing power and mercy.',
        category: 'Health',
        visibility: 'public',
        user: { firstName: 'Maria', lastName: 'S.' },
        prayerCount: 127,
        createdAt: '2 hours ago',
        isAnswered: false,
    },
    {
        id: '2',
        content: 'For peace in our family and reconciliation between my siblings. Lord, heal our broken relationships.',
        category: 'Family',
        visibility: 'anonymous',
        user: null,
        prayerCount: 89,
        createdAt: '4 hours ago',
        isAnswered: false,
    },
    {
        id: '3',
        content: 'For guidance in finding a new job. Lord, lead me to the right opportunity where I can serve You.',
        category: 'Work',
        visibility: 'public',
        user: { firstName: 'John', lastName: 'D.' },
        prayerCount: 56,
        createdAt: '6 hours ago',
        isAnswered: false,
    },
    {
        id: '4',
        content: 'Thank you God for answering our prayers! My father\'s cancer is in remission. All glory to You!',
        category: 'Thanksgiving',
        visibility: 'public',
        user: { firstName: 'Sarah', lastName: 'M.' },
        prayerCount: 234,
        createdAt: '1 day ago',
        isAnswered: true,
    },
];

const categories = ['All', 'Health', 'Family', 'Work', 'Finances', 'Relationships', 'Grief', 'Thanksgiving', 'Spiritual'];

export default function PrayerWallPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const handlePray = (prayerId: string) => {
        // TODO: Call API to record prayer
        console.log('Praying for:', prayerId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        🙏 Prayer Wall
                    </h1>
                    <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-6">
                        Share your prayer intentions and pray for others.
                        Experience the power of community prayer.
                    </p>
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Submit Prayer Request
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="sticky top-16 z-40 bg-white border-b border-gray-100 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                        <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Prayer Cards */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-4">
                    {mockPrayers.map((prayer) => (
                        <div
                            key={prayer.id}
                            className={`bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-md ${prayer.isAnswered ? 'border-2 border-green-200 bg-green-50/50' : ''
                                }`}
                        >
                            {/* Answered Badge */}
                            {prayer.isAnswered && (
                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-3">
                                    <CheckCircle className="w-4 h-4" />
                                    Prayer Answered!
                                </div>
                            )}

                            {/* Content */}
                            <p className="text-gray-800 text-lg leading-relaxed mb-4">
                                "{prayer.content}"
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                                <span className="font-medium text-gray-700">
                                    {prayer.user ? `${prayer.user.firstName} ${prayer.user.lastName}` : 'Anonymous'}
                                </span>
                                <span>•</span>
                                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs">
                                    {prayer.category}
                                </span>
                                <span>•</span>
                                <span>{prayer.createdAt}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => handlePray(prayer.id)}
                                    className="pray-button flex items-center gap-2 px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-white rounded-full font-medium transition-all"
                                >
                                    🙏 <span>Pray</span>
                                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                                        {prayer.prayerCount}
                                    </span>
                                </button>

                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Flag className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                    <button className="px-8 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-full transition-colors">
                        Load More Prayers
                    </button>
                </div>
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Prayer Request</h2>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Prayer Intention
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Share your prayer request..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                                    {categories.filter(c => c !== 'All').map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Visibility
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="visibility" value="public" defaultChecked className="text-primary-600" />
                                        <div>
                                            <span className="font-medium">🌍 Public</span>
                                            <p className="text-sm text-gray-500">Visible to everyone with your name</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="visibility" value="anonymous" className="text-primary-600" />
                                        <div>
                                            <span className="font-medium">👤 Anonymous</span>
                                            <p className="text-sm text-gray-500">Visible to everyone, name hidden</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="visibility" value="private" className="text-primary-600" />
                                        <div>
                                            <span className="font-medium">🔒 Private</span>
                                            <p className="text-sm text-gray-500">Only you and admins can see</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitModal(false)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            All prayer requests are reviewed by our team before publishing.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
