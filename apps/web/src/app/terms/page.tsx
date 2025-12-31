import { Metadata } from 'next';
import { FileText, Users, AlertTriangle, Ban, CreditCard, Shield, Scale, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service | MyPrayerTower',
    description: 'Terms of Service for MyPrayerTower - Rules and conditions for using our Catholic prayer and church finder app.',
};

export default function TermsOfServicePage() {
    const lastUpdated = 'December 30, 2024';
    const effectiveDate = 'December 30, 2024';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-700 to-sacred-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-sacred-100 max-w-2xl mx-auto">
                        Please read these Terms of Service carefully before using MyPrayerTower.
                    </p>
                    <p className="text-sm text-sacred-200 mt-4">
                        Effective Date: {effectiveDate} | Last Updated: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

                    {/* Acceptance */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            By accessing or using MyPrayerTower's website (myprayertower.com) and mobile applications ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services. We reserve the right to update these Terms at any time. Continued use of our Services constitutes acceptance of any changes.
                        </p>
                    </section>

                    {/* Description */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Description of Services</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            MyPrayerTower provides a Catholic spiritual platform including:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Church finder with Mass times and contact information</li>
                            <li>Prayer wall for sharing and praying for intentions</li>
                            <li>Prayer library with traditional and contemporary prayers</li>
                            <li>Daily readings and saint information</li>
                            <li>Rosary and devotional guides</li>
                            <li>Community features and prayer groups</li>
                        </ul>
                    </section>

                    {/* User Accounts */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-sacred-600" />
                            3. User Accounts
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>You must be at least 13 years old (or 16 in the EU) to create an account</li>
                            <li>You are responsible for maintaining the confidentiality of your account</li>
                            <li>You must provide accurate and complete information</li>
                            <li>You may not share your account credentials with others</li>
                            <li>You are responsible for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                        </ul>
                    </section>

                    {/* User Content */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. User Content</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            You retain ownership of content you submit ("User Content"). By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with our Services.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            <strong>You represent that:</strong> You own or have the right to post all content you submit, and your content does not violate any third-party rights or any applicable laws.
                        </p>
                    </section>

                    {/* Prohibited Conduct */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Ban className="w-6 h-6 text-sacred-600" />
                            5. Prohibited Conduct
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">You agree NOT to:</p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Post content that is hateful, threatening, harassing, or defamatory</li>
                            <li>Post spam, advertisements, or solicitations</li>
                            <li>Impersonate any person or entity</li>
                            <li>Post false or misleading information</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Interfere with or disrupt our Services</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Use automated means to access our Services without permission</li>
                            <li>Post content that violates Catholic moral teaching</li>
                            <li>Collect personal information from other users</li>
                        </ul>
                    </section>

                    {/* Church Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Church Information Disclaimer</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Church information including Mass times, addresses, and contact details is provided for informational purposes only. While we strive for accuracy, we cannot guarantee that all information is current or correct. Always verify directly with churches before visiting. We are not responsible for any errors or omissions in church data.
                        </p>
                    </section>

                    {/* Subscriptions & Payments */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-sacred-600" />
                            7. Subscriptions & Payments
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Some features may require a paid subscription</li>
                            <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
                            <li>You may cancel your subscription at any time</li>
                            <li>Refunds are handled according to the Google Play/App Store policies</li>
                            <li>Prices are subject to change with notice</li>
                        </ul>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-sacred-600" />
                            8. Intellectual Property
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            All content, features, and functionality of our Services (excluding User Content) are owned by MyPrayerTower and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our prior written consent. Traditional prayers in the public domain remain in the public domain.
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-sacred-600" />
                            9. Disclaimers
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We are not affiliated with the Vatican, any diocese, or any specific church unless explicitly stated. Content provided is for spiritual enrichment and is not intended as professional religious, legal, or medical advice.
                        </p>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Scale className="w-6 h-6 text-sacred-600" />
                            10. Limitation of Liability
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, MYPRAYERTOWER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OUR SERVICES.
                        </p>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Termination</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We may terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion. Upon termination, your right to use our Services will immediately cease. Provisions that by their nature should survive termination will survive.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Governing Law</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which MyPrayerTower operates, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of that jurisdiction.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-sacred-600" />
                            13. Contact Us
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            If you have questions about these Terms, please contact us:
                        </p>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>MyPrayerTower</strong><br />
                                Email: legal@myprayertower.com<br />
                                Website: https://myprayertower.com/contact
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
