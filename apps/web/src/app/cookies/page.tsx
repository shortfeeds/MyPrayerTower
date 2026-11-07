import { Metadata } from 'next';
import { Cookie, Settings, BarChart3, Target, Shield, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Cookie Policy | MyPrayerTower',
    description: 'Cookie Policy for MyPrayerTower - Learn how we use cookies, local storage, and similar technologies to enhance your devotional experience.',
};

export default function CookiePolicyPage() {
    const lastUpdated = 'November 7, 2026';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-700 to-sacred-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Cookie className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
                    <p className="text-sacred-100 max-w-2xl mx-auto">
                        This policy explains how MyPrayerTower uses cookies, session identifiers, and local device storage to deliver a seamless devotional experience.
                    </p>
                    <p className="text-sm text-sacred-200 mt-4">Last Updated: {lastUpdated}</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

                    {/* What are Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What Are Cookies &amp; Local Storage?</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Cookies are compact text files stored on your browser or device when you navigate digital platforms. They enable the website to recognize your authentication state, retain liturgical preferences (such as dark mode and font size), and preserve your scripture reading progress. We also utilize modern browser web storage (localStorage and sessionStorage) for responsive offline reading.
                        </p>
                    </section>

                    {/* Types of Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Categories of Cookies We Utilize</h2>

                        <div className="space-y-6">
                            <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                <h3 className="font-bold text-green-800 dark:text-green-400 flex items-center gap-2 mb-2">
                                    <Settings className="w-5 h-5" />
                                    1. Strictly Essential Cookies (Always Active)
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Crucial for platform stability and user security. They enable authenticated sessions, CSRF token validation, and account protection. These cannot be switched off in our systems.
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2"><strong>Keys:</strong> sb-auth-token, csrf-token, mpt-session, user-preferences</p>
                            </div>

                            <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <h3 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-2">
                                    <BarChart3 className="w-5 h-5" />
                                    2. Analytics &amp; Performance Cookies
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Provide anonymous aggregated metrics regarding feature engagement, page load latency, and navigation pathways to help us optimize server infrastructure and devotional tools.
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2"><strong>Provider:</strong> Google Analytics (_ga, _gid, _gat) with IP anonymization enabled.</p>
                            </div>

                            <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                <h3 className="font-bold text-purple-800 dark:text-purple-400 flex items-center gap-2 mb-2">
                                    <Target className="w-5 h-5" />
                                    3. Functional &amp; Preference Cookies
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Remember your theme choice (Sacred Navy vs. Light Altar), preferred Catholic Bible translation, audio volume, and saved parishes for automatic geolocation display.
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2"><strong>Keys:</strong> theme-mode, audio-volume, saved-parishes-cache</p>
                            </div>
                        </div>
                    </section>

                    {/* Managing Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-sacred-600" />
                            How You Can Control and Manage Cookies
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            You possess full control over cookie permissions through your web browser settings. Most browsers permit you to reject cookies, prompt you before accepting cookies, or delete cookies that have already been set:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 text-sm">
                            <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Third-party cookies</li>
                            <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
                            <li><strong>Mozilla Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
                            <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and Site Permissions</li>
                        </ul>
                    </section>

                    {/* Contact */}
                    <section className="bg-gray-50 dark:bg-gray-800/80 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Questions Regarding Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            For technical inquiries concerning our cookie implementation or data practices, contact us at{' '}
                            <a href="mailto:privacy@myprayertower.com" className="text-sacred-600 dark:text-sacred-400 underline font-medium">
                                privacy@myprayertower.com
                            </a>
                            {' '}or review our full <Link href="/privacy" className="text-sacred-600 dark:text-sacred-400 underline font-medium">Privacy Policy</Link>.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
