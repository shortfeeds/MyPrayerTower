export const revalidate = 86400; // Cache for 24 hours (0 CPU on Vercel CDN)
import { Metadata } from 'next';
import { Shield, Lock, Eye, Database, Mail, Globe, UserCheck, AlertTriangle, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | MyPrayerTower',
    description: 'Privacy Policy for MyPrayerTower - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
    const lastUpdated = 'November 7, 2026';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-700 to-sacred-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-sacred-100 max-w-2xl mx-auto">
                        Your privacy is a sacred trust. This policy explains how MyPrayerTower collects, uses, and protects your information across our website and mobile applications.
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
                            MyPrayerTower ("we," "us," or "our") is an independent Catholic digital media and devotional technology platform based in Mumbai, India, dedicated to serving the global Catholic community since 2018. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (myprayertower.com) and use our mobile applications (collectively, the "Services"). By accessing or using our Services, you consent to the practices described in this Privacy Policy.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Database className="w-6 h-6 text-sacred-600" />
                            Information We Collect
                        </h2>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">Personal Information You Provide</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Account Credentials:</strong> Full name, email address, password hash (encrypted via Supabase Auth), profile avatar.</li>
                            <li><strong>Prayer Intentions:</strong> Petitions and prayers submitted to our public or anonymous Global Prayer Wall.</li>
                            <li><strong>Devotional Requests:</strong> Names and intention notes submitted for Mass offerings, candle vigils, or personalized spiritual bouquet certificates.</li>
                            <li><strong>Parish Preferences:</strong> Favorited Catholic parishes, home church selection, and diocesan bookmarks.</li>
                            <li><strong>Customer Communications:</strong> Messages sent through our direct contact forms or customer support channels.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">Device & Automatically Collected Data</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Geographic Location:</strong> Approximate IP-derived location or device-level GPS coordinates (only when explicitly permitted) used solely to locate nearby Catholic churches and Mass schedules.</li>
                            <li><strong>Device Attributes:</strong> Hardware model, operating system version, browser type, and screen resolution.</li>
                            <li><strong>Usage Metrics:</strong> Liturgical pages accessed, scripture reading streaks, and devotional tool interaction logs.</li>
                            <li><strong>Cookies & Local Storage:</strong> Secure session cookies, prayer bookmarks, and dark/light mode preference storage.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">Biometrics & Audio Media (Mobile App)</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Biometric Security:</strong> Biometric authentication (fingerprint/Face ID) operates strictly on-device using Android/iOS hardware security modules. We never transmit, store, or have access to your biometric identifiers.</li>
                            <li><strong>Audio Playback:</strong> Catholic Sleep Stories and sacred chants stream or cache audio locally for offline meditation. The app requires no microphone access and records no audio.</li>
                        </ul>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Eye className="w-6 h-6 text-sacred-600" />
                            How We Use Your Information
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>To provide, personalize, and maintain liturgical tools, daily readings, and church directories.</li>
                            <li>To coordinate Holy Mass intentions with verified Catholic partner priests and shrines worldwide.</li>
                            <li>To generate and issue personalized digital certificates for occasion blessings and perpetual vigils.</li>
                            <li>To maintain user prayer streaks and community prayer wall intercessions.</li>
                            <li>To deliver optional daily prayer and liturgical feast day notifications (with explicit consent).</li>
                            <li>To monitor and combat fraud, abuse, or unauthorized access to our platforms.</li>
                            <li>To fulfill legal and accounting compliance obligations under applicable Indian and international law.</li>
                        </ul>
                    </section>

                    {/* Third-Party Service Providers */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-sacred-600" />
                            Third-Party Service Providers & Payment Processing
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            We partner with trusted, industry-leading third-party technology providers to power secure authentication, cloud databases, notifications, and transactions:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Google Play Billing (Library 8.0+):</strong> Secure processing of Android in-app purchases and subscriptions under Google Play monetization policies.</li>
                            <li><strong>PayPal:</strong> Secure PCI-compliant web payment processing for Mass offerings and devotional gifts.</li>
                            <li><strong>Supabase:</strong> Encrypted cloud database and identity management.</li>
                            <li><strong>Firebase Cloud Messaging:</strong> Push notification delivery for daily prayers and feast reminders.</li>
                            <li><strong>Google Maps & OpenStreetMap:</strong> Geospatial rendering for Catholic church and parish locator.</li>
                            <li><strong>Google AdMob:</strong> Privacy-compliant banner and native advertisements for free-tier users.</li>
                        </ul>
                        <div className="mt-4 p-4 bg-sacred-50 dark:bg-sacred-950/40 rounded-xl border border-sacred-200 dark:border-sacred-800">
                            <p className="text-sm text-sacred-800 dark:text-sacred-200">
                                <strong>Payment Security Guarantee:</strong> We never capture, store, or process raw credit/debit card numbers or bank credentials on MyPrayerTower servers. All transactions are tokenized and processed directly by Google Play or PayPal.
                            </p>
                        </div>
                    </section>

                    {/* Devotional Offering & Fee Transparency */}
                    <section className="p-6 bg-slate-50/90 dark:bg-gray-800/60 rounded-xl border border-slate-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-sacred-600" />
                            Devotional Offering & Fee Transparency
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            When you request Mass offerings, candle vigils, or sacred memorials, your contributions are carefully distributed to honor clergy intentions, maintain altar traditions, and sustain platform reliability:
                        </p>
                        
                        {/* Compact Visual Distribution Bar */}
                        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-gray-200 dark:bg-gray-700 mb-4">
                            <div style={{ width: '70%' }} className="bg-amber-500" title="70% Church & Clergy Stipends" />
                            <div style={{ width: '20%' }} className="bg-emerald-600" title="20% Pastoral Coordination & Operations" />
                            <div style={{ width: '10%' }} className="bg-sky-600" title="10% Secure Digital Infrastructure" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                            <div className="p-3.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-bold text-amber-600 dark:text-amber-400">70%</span>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-200">Church & Clergy</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Direct Mass stipends for ordained partner priests and altar sanctuary maintenance</p>
                            </div>
                            <div className="p-3.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">20%</span>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-200">Pastoral Care</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Intention scheduling, digital certificate verification, and user pastoral support</p>
                            </div>
                            <div className="p-3.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-bold text-sky-600 dark:text-sky-400">10%</span>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-200">Infrastructure</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Encrypted cloud servers, SSL security, database storage, and app updates</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal border-t border-gray-200/60 dark:border-gray-700/50 pt-3">
                            <strong>Legal Classification:</strong> MyPrayerTower facilitates devotional services and forwards sacred stipends to ordained Catholic clergy and partner shrines. Remittances are legally classified as commercial service export fees and digital platform facilitation charges, and are not tax-deductible charitable contributions. All services are 100% digital with no physical shipment.
                        </p>
                    </section>

                    {/* Data Retention & Deletion */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Retention & Deletion</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We retain personal data only for as long as necessary to provide our Services and comply with accounting and statutory obligations. You may request permanent deletion of your account, prayer wall entries, and profile data at any time by contacting us at <a href="mailto:privacy@myprayertower.com" className="text-sacred-600 dark:text-sacred-400 underline">privacy@myprayertower.com</a> or via Account Settings in the mobile app. Requests are honored within 30 days.
                        </p>
                    </section>

                    {/* GDPR and Global Privacy Rights */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-sacred-600" />
                            Your Privacy Rights (GDPR, CCPA & Global Protections)
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Regardless of where you reside, MyPrayerTower respects your rights over your data:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Right of Access:</strong> Request a copy of all personal data held about you.</li>
                            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete profile information.</li>
                            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Permanently erase your user profile and history.</li>
                            <li><strong>Right to Restrict Processing:</strong> Request limits on how your personal data is utilized.</li>
                            <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable JSON format.</li>
                            <li><strong>Right to Object:</strong> Opt-out of any non-essential analytics or notifications at any time.</li>
                        </ul>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-sacred-600" />
                            Children's Privacy Protection
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Our Services are intended for individuals aged 13 and older (or 16 in the European Union). We do not knowingly collect personal identifiable information from children under these ages. If you believe a minor has submitted personal information without parental consent, please contact us immediately to facilitate prompt deletion.
                        </p>
                    </section>

                    {/* Security Safeguards */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Security Safeguards</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We implement robust enterprise security protocols, including TLS 1.3 encryption in transit, AES-256 encryption at rest, secure password hashing, strict least-privilege administrative access, and regular vulnerability audits to ensure your prayer life remains private and secure.
                        </p>
                    </section>

                    {/* Contact Privacy Officer */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-sacred-600" />
                            Contact Our Data Privacy Officer
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            For inquiries, data requests, or privacy concerns, please contact our Data Protection Office:
                        </p>
                        <div className="mt-4 p-5 bg-gray-50 dark:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-600">
                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                                <strong>MyPrayerTower Data Privacy Office</strong><br />
                                Email: <a href="mailto:privacy@myprayertower.com" className="text-sacred-600 dark:text-sacred-400 underline">privacy@myprayertower.com</a><br />
                                Location: Mumbai, Maharashtra, India<br />
                                Web Portal: <a href="https://www.myprayertower.com/contact" className="text-sacred-600 dark:text-sacred-400 underline">https://www.myprayertower.com/contact</a>
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
