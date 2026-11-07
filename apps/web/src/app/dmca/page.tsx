import { Metadata } from 'next';
import { Copyright, Mail, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'DMCA & Copyright Policy | MyPrayerTower',
    description: 'DMCA and Copyright Policy for MyPrayerTower - Report copyright infringement or submit intellectual property notifications.',
};

export default function DMCAPage() {
    const lastUpdated = 'November 7, 2026';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-sacred-700 to-sacred-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Copyright className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">DMCA &amp; Copyright Policy</h1>
                    <p className="text-sacred-100 max-w-2xl mx-auto">
                        MyPrayerTower respects the intellectual property rights of creators and upholds lawful digital copyright practices.
                    </p>
                    <p className="text-sm text-sacred-200 mt-4">Last Updated: {lastUpdated}</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notice and Takedown Procedure</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            MyPrayerTower respects the intellectual property rights of authors, artists, and content owners and expects our community members to do the same. In compliance with the Digital Millennium Copyright Act of 1998 ("DMCA") and international copyright treaties, we will expeditiously respond to notices of alleged copyright infringement submitted to our designated Copyright Agent.
                        </p>
                    </section>

                    {/* Public Domain Note */}
                    <section className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Public Domain Traditional Prayers &amp; Sacred Art Notice
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Please note that centuries-old Catholic prayers (including the Pater Noster, Ave Maria, Gloria Patri, Litany of Loreto, and Rosary meditations), liturgical texts, and classical sacred art (e.g., works by Michelangelo, Raphael, Fra Angelico, and Caravaggio) are established works in the <strong>public domain</strong> worldwide. This DMCA policy applies strictly to proprietary modern translations, proprietary commentary, original audio productions, or copyrighted photography.
                        </p>
                    </section>

                    {/* How to Submit a DMCA Notice */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Requirements for an Infringement Notice</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            To submit a formal copyright infringement notification, please deliver written correspondence containing the following statutory elements:
                        </p>
                        <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2 text-sm leading-relaxed">
                            <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner.</li>
                            <li>Identification of the copyrighted work claimed to have been infringed.</li>
                            <li>Identification of the material claimed to be infringing, including the specific URL or location on MyPrayerTower.</li>
                            <li>Your contact details: name, postal address, telephone number, and email address.</li>
                            <li>A statement that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                            <li>A statement made under penalty of perjury that the information in the notification is accurate and that you are authorized to act on behalf of the copyright owner.</li>
                        </ol>
                    </section>

                    {/* Counter-Notification */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Counter-Notification Procedure</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            If you believe in good faith that your content was removed or disabled by mistake or misidentification, you may send a counter-notification to our Copyright Agent containing your contact information, the material's prior location, and your consent to legal jurisdiction.
                        </p>
                    </section>

                    {/* Designated Agent */}
                    <section className="bg-primary-50 dark:bg-primary-950/40 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary-600" />
                            Designated Copyright Agent
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                            Direct all DMCA notices and intellectual property inquiries to:
                        </p>
                        <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                            <strong>MyPrayerTower Legal &amp; Copyright Compliance</strong><br />
                            Email: <a href="mailto:legal@myprayertower.com" className="text-primary-600 dark:text-primary-400 underline">legal@myprayertower.com</a><br />
                            Location: Mumbai, Maharashtra, India<br />
                            Web: <a href="https://www.myprayertower.com" className="text-primary-600 dark:text-primary-400 underline">https://www.myprayertower.com</a>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
