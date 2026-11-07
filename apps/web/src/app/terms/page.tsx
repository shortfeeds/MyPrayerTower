export const revalidate = 86400; // Cache for 24 hours (0 CPU on Vercel CDN)
import { Metadata } from 'next';
import { FileText, Users, AlertTriangle, Ban, CreditCard, Shield, Scale, Mail, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service | MyPrayerTower',
    description: 'Terms of Service for MyPrayerTower - Rules and conditions for using our Catholic prayer, devotional, and church finder platform.',
};

export default function TermsOfServicePage() {
    const lastUpdated = 'November 7, 2026';
    const effectiveDate = 'November 7, 2026';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-700 to-sacred-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-sacred-100 max-w-2xl mx-auto">
                        Please review these Terms of Service carefully before utilizing MyPrayerTower.
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
                            By accessing or using MyPrayerTower's website (myprayertower.com), progressive web application, and mobile applications ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please refrain from using our Services. Continued use of our Services constitutes binding acceptance of any updates.
                        </p>
                    </section>

                    {/* Nature of Our Services & Commercial Classification */}
                    <section className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Nature of Our Services & Platform Classification</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            <strong>MyPrayerTower is an independent digital media and devotional technology platform based in Mumbai, India, serving the Catholic faithful worldwide since 2018.</strong>
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                            <li><strong>Non-Ecclesiastical Entity:</strong> MyPrayerTower is not a registered 501(c)(3) tax-exempt religious charity, trust, parish, or diocese. We do not directly administer sacramental rites or govern clergy.</li>
                            <li><strong>Commercial Service Facilitation:</strong> All user remittances—including Mass intention stipends, virtual candles, digital memorials, and devotional packages—are legally classified as <strong>commercial service export fees and digital platform facilitation charges</strong> under applicable online electronic services classifications (SAC code).</li>
                            <li><strong>Non-Tax-Deductible:</strong> Remittances are processed to honor partner clergy stipends and sustain global digital infrastructure. Payments represent consideration for cross-border spiritual coordination and information services, and are not tax-deductible charitable contributions.</li>
                            <li><strong>100% Digital Delivery:</strong> All deliverables, including memorial chapels, spiritual bouquets, sleep stories, blessing certificates, and sanctuary vigils, are provided in 100% digital electronic form. No physical tangible merchandise or postal shipment is involved.</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We operate as a trusted <strong>technology intermediary</strong>, facilitating the reverent fulfillment of devotional requests by ordained partner clergy while delivering high-quality digital devotional tools to users worldwide.
                        </p>
                    </section>

                    {/* Devotional Consideration Distribution */}
                    <section className="p-6 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200/80 dark:border-amber-800/50">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            Devotional Offering & Fee Transparency (70/20/10)
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            To ensure total integrity and transparent stewardship, devotional contributions are apportioned as follows:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-900">
                                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">70%</span>
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1">Church & Clergy</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Direct stipends for celebrating priests and sanctuary altar upkeep</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-900">
                                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">20%</span>
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1">Pastoral Care</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Intention scheduling, digital certificate verification & support</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-sky-200 dark:border-sky-900">
                                <span className="text-xl font-bold text-sky-600 dark:text-sky-400">10%</span>
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1">Infrastructure</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Encrypted cloud servers, SSL, mobile app updates & maintenance</p>
                            </div>
                        </div>
                    </section>

                    {/* No Guarantee of Spiritual Outcomes */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. No Guarantee of Spiritual Outcomes</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We facilitate spiritual services with sincerity and profound reverence for Catholic tradition. However, we make <strong>no representations, promises, or warranties</strong> regarding the spiritual efficacy of any prayer, Mass intention, candle, sleep story, or blessing. Faith is deeply personal; we cannot and do not guarantee miraculous interventions, temporal prosperity, or specific spiritual outcomes.
                        </p>
                    </section>

                    {/* Description of Services */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Description of Services</h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Catholic Sleep Stories:</strong> Ambient audio narratives with cathedral chimes, soft orchestral pads, and timer controls for evening rest.</li>
                            <li><strong>Church Finder:</strong> Global directory of Catholic parishes with Mass, Confession, and Adoration schedules.</li>
                            <li><strong>Global Prayer Wall:</strong> 24/7 mutual intercession community where users post and pray for intentions.</li>
                            <li><strong>Prayer Library & Rosary:</strong> Over 3,900 prayers, litanies, interactive Rosary, and novena trackers.</li>
                            <li><strong>Daily Liturgical Readings:</strong> Official scripture readings and Catholic saints reflections.</li>
                            <li><strong>Mass Offerings:</strong> Coordination of Mass intentions with partner clergy worldwide.</li>
                            <li><strong>Virtual Candles & Sanctuary Vigils:</strong> Real-time digital votive displays and tabernacle lamps.</li>
                        </ul>
                    </section>

                    {/* Subscriptions & Payments */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-sacred-600" />
                            5. Subscriptions, Payments & Google Play Billing 8.0
                        </h2>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Billing Processors</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Android App:</strong> In-app purchases, Mass offerings, and subscriptions are processed securely through <strong>Google Play Billing (Library 8.0+)</strong> in strict compliance with Google Play monetization policies.</li>
                            <li><strong>Web Platform:</strong> Transactions are securely processed through PayPal.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Auto-Renewal & Cancellation</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Subscriptions renew automatically unless cancelled at least 24 hours prior to the close of the current billing cycle.</li>
                            <li>Android users may manage or cancel subscriptions anytime in the Google Play Subscriptions Center (Play Store &gt; Profile &gt; Payments &amp; Subscriptions &gt; Subscriptions).</li>
                            <li>Web users can manage recurring payments within their PayPal account settings or MyPrayerTower profile.</li>
                            <li>Upon cancellation, premium access remains active through the remainder of the paid period.</li>
                        </ul>
                    </section>

                    {/* User Accounts & Content */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-sacred-600" />
                            6. User Accounts & Content Moderation
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>You must be at least 13 years old (or 16 in the European Union) to register an account.</li>
                            <li>You are solely responsible for maintaining credentials confidentiality.</li>
                            <li><strong>Content Moderation:</strong> All user-submitted content (prayer wall petitions, memorial tributes, testimonies) is moderated to preserve reverent decorum and Catholic moral teaching. We reserve the absolute right to remove inappropriate, profane, defamatory, or commercial spam content without notice.</li>
                        </ul>
                    </section>

                    {/* Prohibited Conduct */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Ban className="w-6 h-6 text-sacred-600" />
                            7. Prohibited Conduct
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Do not post hateful, blasphemous, defamatory, or abusive material.</li>
                            <li>Do not harvest user email addresses or personal information.</li>
                            <li>Do not conduct unauthorized automated scraping, API extraction, or denial-of-service attacks.</li>
                            <li>Do not misrepresent identity or claim false ordination as Catholic clergy.</li>
                        </ul>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Scale className="w-6 h-6 text-sacred-600" />
                            8. Limitation of Liability
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, MYPRAYERTOWER AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM THE USE OR INABILITY TO USE OUR SERVICES, THIRD-PARTY PAYMENT NETWORKS, OR CLERGY SCHEDULING DELAYS.
                        </p>
                    </section>

                    {/* Governing Law & Dispute Resolution */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Governing Law & Jurisdiction</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the substantive laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-sacred-600" />
                            10. Contact Us
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            For legal notices or questions regarding these Terms:
                        </p>
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/60 rounded-xl">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>MyPrayerTower Legal Department</strong><br />
                                Email: <a href="mailto:legal@myprayertower.com" className="text-sacred-600 dark:text-sacred-400 underline">legal@myprayertower.com</a><br />
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
