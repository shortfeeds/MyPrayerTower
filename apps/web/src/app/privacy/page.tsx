export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <section className="bg-white py-16 border-b border-gray-100">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-500">Last updated: December 26, 2024</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="prose prose-lg prose-blue max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <p>
                        At MyPrayerTower, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website or use our mobile application.
                    </p>

                    <h3>1. Collection of Information</h3>
                    <p>
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul>
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>

                    <h3>2. Use of Your Information</h3>
                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul>
                        <li>Create and manage your account.</li>
                        <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Enable user-to-user communications.</li>
                    </ul>

                    <h3>3. Disclosure of Your Information</h3>
                    <p>
                        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                    </p>
                    <ul>
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                    </ul>

                    <h3>4. Contact Us</h3>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at:<br />
                        <a href="mailto:privacy@myprayertower.com">privacy@myprayertower.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
