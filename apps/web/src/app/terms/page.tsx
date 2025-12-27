export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <section className="bg-white py-16 border-b border-gray-100">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-gray-500">Last updated: December 26, 2024</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="prose prose-lg prose-blue max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <p>
                        These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and MyPrayerTower ("we", "us", or "our"), concerning your access to and use of the MyPrayerTower website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                    </p>

                    <h3>1. Agreement to Terms</h3>
                    <p>
                        By accessing the Site, you agree that you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.
                    </p>

                    <h3>2. Intellectual Property Rights</h3>
                    <p>
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                    </p>

                    <h3>3. User Representations</h3>
                    <p>
                        By using the Site, you represent and warrant that:
                    </p>
                    <ul>
                        <li>All registration information you submit will be true, accurate, current, and complete.</li>
                        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                        <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                        <li>You are not a minor in the jurisdiction in which you reside.</li>
                    </ul>

                    <h3>4. Prohibited Activities</h3>
                    <p>
                        You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                    </p>

                    <h3>5. Contact Us</h3>
                    <p>
                        To resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:<br />
                        <a href="mailto:support@myprayertower.com">support@myprayertower.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
