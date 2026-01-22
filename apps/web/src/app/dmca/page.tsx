import { Metadata } from 'next';
import { Copyright, Mail, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'DMCA & Copyright Policy | MyPrayerTower',
    description: 'DMCA and Copyright Policy for MyPrayerTower - Report copyright infringement or respond to takedown notices.',
};

export default function DMCAPage() {
    const lastUpdated = 'January 5, 2026';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-700 to-sacred-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Copyright className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">DMCA & Copyright Policy</h1>
                    <p className="text-sacred-100 max-w-2xl mx-auto">
                        We respect intellectual property rights. Learn how to report copyright infringement.
                    </p>
                    <p className="text-sm text-sacred-200 mt-4">Last Updated: {lastUpdated}</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Introduction</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            MyPrayerTower respects the intellectual property rights of others and expects our users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond promptly to claims of copyright infringement that are reported to our designated Copyright Agent.
                        </p>
                    </section>

                    {/* Public Domain Note */}
                    <section className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Note on Prayers and Religious Content
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Many traditional Catholic prayers, including the Our Father, Hail Mary, Rosary prayers, and others, are in the <strong>public domain</strong> due to their age and religious nature. This policy applies to copyrighted modern content, not to traditional prayers or Scripture texts.
                        </p>
                    </section>

                    {/* Filing a Complaint */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Filing a DMCA Takedown Notice</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            If you believe that content on MyPrayerTower infringes your copyright, please submit a written notice containing:
                        </p>
                        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-3">
                            <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                            <li>Identification of the copyrighted work claimed to have been infringed</li>
                            <li>Identification of the material that is claimed to be infringing, with enough information to locate it (e.g., URL)</li>
                            <li>Your contact information (address, telephone number, and email)</li>
                            <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner</li>
                            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner</li>
                        </ol>
                    </section>

                    {/* Where to Send */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-sacred-600" />
                            Submit DMCA Notices
                        </h2>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>DMCA Agent</strong><br />
                                MyPrayerTower<br />
                                Email: dmca@myprayertower.com<br />
                                Subject Line: "DMCA Takedown Notice"
                            </p>
                        </div>
                    </section>

                    {/* Counter-Notification */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Counter-Notification</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            If you believe your content was removed in error, you may submit a counter-notification containing:
                        </p>
                        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Your physical or electronic signature</li>
                            <li>Identification of the material that was removed and its location before removal</li>
                            <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
                            <li>Your name, address, telephone number, and consent to jurisdiction</li>
                        </ol>
                    </section>

                    {/* Warning */}
                    <section className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                        <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Warning
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Knowingly misrepresenting that material is infringing may subject you to liability for damages, including costs and attorneys' fees, under Section 512(f) of the DMCA.
                        </p>
                    </section>

                    {/* Repeat Infringer Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Repeat Infringer Policy</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            In accordance with the DMCA, we will terminate the accounts of users who are repeat infringers of copyrighted materials. We reserve the right to terminate any account at our sole discretion.
                        </p>
                    </section>

                    {/* Related Links */}
                    <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Policies</h3>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                            <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                            <Link href="/guidelines" className="text-primary-600 hover:underline">Community Guidelines</Link>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
