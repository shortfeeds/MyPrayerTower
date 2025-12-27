'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, ChevronUp, Sparkles } from 'lucide-react';

interface Testimony {
    id: string;
    title: string;
    content: string;
    userName: string;
    upvotes: number;
    createdAt: string;
    isFeatured?: boolean;
}

export default function TestimoniesPage() {
    const [testimonies, setTestimonies] = useState<Testimony[]>([]);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    useEffect(() => {
        setTestimonies([
            {
                id: '1',
                title: 'My mother was healed from cancer',
                content: 'After months of praying and having the community pray with us on the Prayer Wall, my mother received miraculous news - her cancer was in complete remission. The doctors were amazed. We are so grateful to God and everyone who lifted us up in prayer.',
                userName: 'Maria S.',
                upvotes: 234,
                createdAt: '2 weeks ago',
                isFeatured: true,
            },
            {
                id: '2',
                title: 'Found my way back to faith',
                content: 'I had been away from the Church for 15 years. Through this app, I found a welcoming parish near me and started attending Mass again. The prayer community here helped me through my journey back.',
                userName: 'John D.',
                upvotes: 156,
                createdAt: '1 month ago',
                isFeatured: true,
            },
            {
                id: '3',
                title: 'Job after months of searching',
                content: 'I prayed the Prayer Wall for guidance in my career. Within a month of consistent prayer and the support of this community, I received a job offer that was beyond what I had asked for. God is faithful!',
                userName: 'Sarah M.',
                upvotes: 98,
                createdAt: '3 weeks ago',
            },
            {
                id: '4',
                title: 'Marriage restored',
                content: 'My husband and I were on the verge of divorce. We started praying together using prayers from this app. Six months later, we are closer than ever. Thank you for this platform that brought us back to our faith together.',
                userName: 'Anonymous',
                upvotes: 187,
                createdAt: '2 months ago',
            },
        ]);
    }, []);

    const handleUpvote = (id: string) => {
        setTestimonies(prev =>
            prev.map(t => (t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t))
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12 text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8" />
                        <h1 className="text-4xl font-bold">Testimony Wall</h1>
                    </div>
                    <p className="text-green-100 text-lg max-w-2xl mx-auto">
                        Stories of answered prayers and God's faithfulness in our community
                    </p>
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="mt-6 px-8 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-green-50 transition-all shadow-lg"
                    >
                        Share Your Testimony
                    </button>
                </div>
            </div>

            {/* Featured Testimonies */}
            <div className="container mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-amber-500">⭐</span> Featured Stories
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {testimonies.filter(t => t.isFeatured).map(testimony => (
                        <div key={testimony.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{testimony.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">{testimony.content}</p>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium text-gray-700">{testimony.userName}</span>
                                    <span className="mx-2">•</span>
                                    {testimony.createdAt}
                                </div>
                                <button
                                    onClick={() => handleUpvote(testimony.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                    <span className="font-medium">{testimony.upvotes}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* All Testimonies */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Testimonies</h2>
                <div className="space-y-4">
                    {testimonies.filter(t => !t.isFeatured).map(testimony => (
                        <div key={testimony.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{testimony.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{testimony.content}</p>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium text-gray-700">{testimony.userName}</span>
                                    <span className="mx-2">•</span>
                                    {testimony.createdAt}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleUpvote(testimony.id)}
                                        className="flex items-center gap-1 text-gray-500 hover:text-green-600"
                                    >
                                        <ChevronUp className="w-5 h-5" />
                                        <span>{testimony.upvotes}</span>
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Testimony</h2>
                        <p className="text-gray-500 mb-6">
                            Your story can inspire and encourage others in their faith journey.
                        </p>
                        <input
                            type="text"
                            placeholder="Title (e.g., 'Prayer answered after 5 years')"
                            className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:border-green-500 focus:outline-none"
                        />
                        <textarea
                            placeholder="Share your story of answered prayer..."
                            className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:border-green-500 focus:outline-none"
                            rows={6}
                        />
                        <label className="flex items-center gap-2 mb-6 text-gray-600">
                            <input type="checkbox" className="w-4 h-4 text-green-600" />
                            Submit anonymously
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                            >
                                Submit Testimony
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
