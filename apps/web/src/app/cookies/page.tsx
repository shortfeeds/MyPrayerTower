import { Metadata } from 'next';
import { Cookie, Settings, BarChart3, Target, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Cookie Policy | MyPrayerTower',
    description: 'Cookie Policy for MyPrayerTower - Learn how we use cookies and similar technologies.',
};

export default function CookiePolicyPage() {
    const lastUpdated = 'December 30, 2024';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-700 to-sacred-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Cookie className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
                    <p className="text-sacred-100 max-w-2xl mx-auto">
                        This policy explains how MyPrayerTower uses cookies and similar technologies.
                    </p>
                    <p className="text-sm text-sacred-200 mt-4">Last Updated: {lastUpdated}</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

                    {/* What are Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What Are Cookies?</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience. We also use similar technologies like local storage and session storage.
                        </p>
                    </section>

                    {/* Types of Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Types of Cookies We Use</h2>

                        <div className="space-y-6">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                <h3 className="font-bold text-green-800 dark:text-green-400 flex items-center gap-2 mb-2">
                                    <Settings className="w-5 h-5" />
                                    Essential Cookies
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Required for the website to function. They enable basic features like page navigation, secure login, and remembering your preferences. Cannot be disabled.
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Examples: Session ID, Authentication tokens, CSRF tokens</p>
                            </div>

                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <h3 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Analytics Cookies
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Help us understand how visitors interact with our website by collecting anonymous information. This helps us improve our Services.
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Provider: Google Analytics (_ga, _gid, _gat)</p>
                            </div>

                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                <h3 className="font-bold text-purple-800 dark:text-purple-400 flex items-center gap-2 mb-2">
                                    <Target className="w-5 h-5" />
                                    Advertising Cookies
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Used to display relevant advertisements based on your interests. These are set by our advertising partners (Google AdMob/AdSense).
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Provider: Google AdSense/AdMob</p>
                            </div>

                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                                <h3 className="font-bold text-orange-800 dark:text-orange-400 flex items-center gap-2 mb-2">
                                    <Cookie className="w-5 h-5" />
                                    Preference Cookies
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Remember your preferences such as language, theme (dark/light mode), and accessibility settings to personalize your experience.
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Examples: theme, fontSize, locale</p>
                            </div>
                        </div>
                    </section>

                    {/* Third-Party Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We use services from the following third parties that may set cookies:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Google Analytics:</strong> Website analytics</li>
                            <li><strong>Google AdSense/AdMob:</strong> Advertising</li>
                            <li><strong>Firebase:</strong> Push notifications and authentication</li>
                            <li><strong>YouTube:</strong> Embedded videos (if any)</li>
                        </ul>
                    </section>

                    {/* Managing Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-sacred-600" />
                            Managing Cookies
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            You can manage or disable cookies through your browser settings:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                            <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                            <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400 mt-4">
                            <strong>Note:</strong> Disabling cookies may affect the functionality of our Services.
                        </p>
                    </section>

                    {/* Opt-Out Links */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Opt-Out Options</h2>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li>
                                <strong>Google Analytics:</strong>{' '}
                                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                    Install Google Analytics Opt-out Browser Add-on
                                </a>
                            </li>
                            <li>
                                <strong>Google Ads:</strong>{' '}
                                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                    Manage Google Ad Settings
                                </a>
                            </li>
                        </ul>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            If you have questions about our use of cookies, please contact us at{' '}
                            <a href="mailto:privacy@myprayertower.com" className="text-primary-600 hover:underline">
                                privacy@myprayertower.com
                            </a>
                        </p>
                    </section>

                    {/* Related Links */}
                    <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Policies</h3>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                            <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
