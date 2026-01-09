import { Metadata } from 'next';
import { Shield, Lock, Eye, Database, Mail, Globe, UserCheck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | MyPrayerTower',
    description: 'Privacy Policy for MyPrayerTower - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
    const lastUpdated = 'January 5, 2026';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-700 to-sacred-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-sacred-100 max-w-2xl mx-auto">
                        Your privacy is important to us. This policy explains how MyPrayerTower collects, uses, and protects your information.
                    </p>
                    <p className="text-sm text-sacred-200 mt-4">Last Updated: {lastUpdated}</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Globe className="w-6 h-6 text-sacred-600" />
                            Introduction
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            MyPrayerTower ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website (myprayertower.com) and mobile applications (collectively, the "Services"). Please read this policy carefully. By using our Services, you consent to the practices described in this Privacy Policy.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Database className="w-6 h-6 text-sacred-600" />
                            Information We Collect
                        </h2>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">Personal Information</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, password (encrypted), profile picture</li>
                            <li><strong>Prayer Requests:</strong> Content you submit to the prayer wall (may be public)</li>
                            <li><strong>Church Preferences:</strong> Saved churches, home parish selection</li>
                            <li><strong>Communications:</strong> Messages you send to us or other users</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">Automatically Collected Information</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
                            <li><strong>Location Data:</strong> IP address, approximate location (for nearby churches)</li>
                            <li><strong>Usage Data:</strong> Pages visited, features used, time spent</li>
                            <li><strong>Cookies:</strong> Session cookies, preferences, analytics</li>
                        </ul>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Eye className="w-6 h-6 text-sacred-600" />
                            How We Use Your Information
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>To provide and maintain our Services</li>
                            <li>To personalize your experience and recommendations</li>
                            <li>To process prayer requests and community features</li>
                            <li>To send you notifications (with your consent)</li>
                            <li>To respond to your inquiries and provide support</li>
                            <li>To improve our Services through analytics</li>
                            <li>To display relevant advertisements (Google AdMob)</li>
                            <li>To comply with legal obligations</li>
                            <li>To send reminders about abandoned transactions or incomplete offerings</li>
                        </ul>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-sacred-600" />
                            Third-Party Services
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We use the following third-party services that may collect information:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Google Play Billing:</strong> In-app purchases and subscriptions on Android (see Google's Privacy Policy)</li>
                            <li><strong>Cashfree Payments:</strong> Web payment processing (see Cashfree's Privacy Policy)</li>
                            <li><strong>Google AdMob:</strong> Advertising services (see Google's Privacy Policy)</li>
                            <li><strong>Google Analytics:</strong> Usage analytics and insights</li>
                            <li><strong>Firebase:</strong> Push notifications and authentication</li>
                            <li><strong>Supabase:</strong> Database and authentication services</li>
                            <li><strong>Google Maps:</strong> Church location and directions</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">Payment Information</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            When you make purchases (subscriptions, donations, Mass offerings, virtual candles), payment is processed through Google Play Billing (Android app) or Cashfree (web). We do not store your full credit card details. We receive confirmation of payment and limited billing information to fulfill your order.
                        </p>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Retention</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We retain your personal information for as long as your account is active or as needed to provide you with our Services. You may request deletion of your account and associated data at any time by contacting us at privacy@myprayertower.com.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-sacred-600" />
                            Your Rights
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Depending on your location, you may have the following rights:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate data</li>
                            <li><strong>Deletion:</strong> Request deletion of your data</li>
                            <li><strong>Portability:</strong> Export your data in a portable format</li>
                            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                            <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
                        </ul>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-sacred-600" />
                            Children's Privacy
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Our Services are not directed to children under 13 (or 16 in the EU). We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                        </p>
                    </section>

                    {/* Security */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Security</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We implement industry-standard security measures including encryption (SSL/TLS), secure password hashing, and regular security audits. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    {/* International Transfers */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">International Data Transfers</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-sacred-600" />
                            Contact Us
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            If you have questions about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>MyPrayerTower</strong><br />
                                Email: privacy@myprayertower.com<br />
                                Website: https://myprayertower.com/contact
                            </p>
                        </div>
                    </section>

                    {/* Changes */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our Services after any changes constitutes your acceptance of the new Privacy Policy.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
