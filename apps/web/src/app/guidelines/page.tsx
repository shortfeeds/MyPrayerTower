import { Metadata } from 'next';
import { Heart, MessageCircle, Users, AlertTriangle, Shield, ThumbsUp, ThumbsDown, Ban } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Community Guidelines | MyPrayerTower',
    description: 'Community Guidelines for MyPrayerTower - Rules for respectful and faith-filled interaction in our Catholic community.',
};

export default function CommunityGuidelinesPage() {
    const lastUpdated = 'December 30, 2024';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-700 to-sacred-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Guidelines</h1>
                    <p className="text-sacred-100 max-w-2xl mx-auto">
                        Our community is built on faith, respect, and love. These guidelines help us create a welcoming space for all Catholics and those interested in the faith.
                    </p>
                    <p className="text-sm text-sacred-200 mt-4">Last Updated: {lastUpdated}</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

                    {/* Our Mission */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-rose-500" />
                            Our Mission
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            MyPrayerTower is a community of Catholics united in prayer. We aim to support each other's spiritual journey, share prayer intentions, and grow closer to God together. Our community is grounded in the teachings of the Catholic Church and the love of Christ.
                        </p>
                    </section>

                    {/* Core Values */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Core Values</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-sacred-50 dark:bg-sacred-900/20 rounded-xl">
                                <h3 className="font-bold text-sacred-700 dark:text-sacred-400 mb-2">🙏 Faith</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Rooted in Catholic tradition and open to all seeking God</p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">💙 Charity</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Treating all with love, compassion, and understanding</p>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-2">🤝 Respect</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Honoring the dignity of every person as a child of God</p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">🌟 Hope</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Encouraging and uplifting one another in times of struggle</p>
                            </div>
                        </div>
                    </section>

                    {/* Do's */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ThumbsUp className="w-6 h-6 text-green-500" />
                            We Encourage
                        </h2>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Sharing prayer intentions and praying for others</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Offering words of encouragement and support</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Sharing testimonies of faith (with appropriate discretion)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Asking questions about the faith respectfully</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Reporting content that violates these guidelines</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Being patient and understanding with newcomers</span>
                            </li>
                        </ul>
                    </section>

                    {/* Don'ts */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ThumbsDown className="w-6 h-6 text-red-500" />
                            We Prohibit
                        </h2>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✗</span>
                                <span>Hate speech, discrimination, or harassment of any kind</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✗</span>
                                <span>Content that contradicts Catholic moral teaching</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✗</span>
                                <span>Spam, self-promotion, or commercial solicitation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✗</span>
                                <span>Sharing personal information of others without consent</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✗</span>
                                <span>Political propaganda or divisive content</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✗</span>
                                <span>False claims about churches, clergy, or other members</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✗</span>
                                <span>Graphic, violent, or sexually explicit content</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✗</span>
                                <span>Impersonating priests, religious, or Church officials</span>
                            </li>
                        </ul>
                    </section>

                    {/* Prayer Wall Guidelines */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 text-sacred-600" />
                            Prayer Wall Guidelines
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Keep prayer requests appropriate for a public, faith-based forum</li>
                            <li>Do not share identifying details of others without permission</li>
                            <li>Focus on the prayer intention, not detailed personal grievances</li>
                            <li>Responses should be prayerful and supportive, not advice-giving</li>
                            <li>Remember that prayer requests may be visible to all users</li>
                        </ul>
                    </section>

                    {/* Enforcement */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Ban className="w-6 h-6 text-orange-500" />
                            Enforcement
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Violations of these guidelines may result in:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Warning:</strong> First-time minor violations</li>
                            <li><strong>Content Removal:</strong> Inappropriate content will be removed</li>
                            <li><strong>Temporary Suspension:</strong> Repeated or serious violations</li>
                            <li><strong>Permanent Ban:</strong> Severe or continued violations</li>
                        </ul>
                    </section>

                    {/* Reporting */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-yellow-500" />
                            Reporting Violations
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            If you see content that violates these guidelines, please report it:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Use the "Report" button on any post or comment</li>
                            <li>Email us at: <a href="mailto:moderation@myprayertower.com" className="text-primary-600 hover:underline">moderation@myprayertower.com</a></li>
                            <li>Include details about the violation and a link if possible</li>
                        </ul>
                    </section>

                    {/* Quote */}
                    <section className="text-center p-6 bg-sacred-50 dark:bg-sacred-900/20 rounded-2xl">
                        <p className="text-xl italic text-sacred-700 dark:text-sacred-300">
                            "A new command I give you: Love one another. As I have loved you, so you must love one another."
                        </p>
                        <p className="text-sm text-sacred-600 dark:text-sacred-400 mt-2">— John 13:34</p>
                    </section>

                    {/* Related Links */}
                    <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Policies</h3>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                            <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
