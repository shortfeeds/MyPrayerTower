export default function GuidelinesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <section className="bg-white py-16 border-b border-gray-100">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Community Guidelines</h1>
                    <p className="text-gray-500">Last updated: December 26, 2024</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="prose prose-lg prose-blue max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <p>
                        MyPrayerTower is a place for prayer, support, and spiritual growth. To maintain a safe and welcoming environment for all our users, we require everyone to follow these Community Guidelines.
                    </p>

                    <h3>1. Respect and Charity</h3>
                    <p>
                        Be kind and respectful to others. We are a diverse community of believers from around the world. Harassment, hate speech, bullying, and abusive language are strictly prohibited. Treat others with the charity that Christ calls us to.
                    </p>

                    <h3>2. Prayer Intentions</h3>
                    <p>
                        When posting prayer intentions:
                    </p>
                    <ul>
                        <li>Be sincere and appropriate. Intention should be genuine requests for prayer.</li>
                        <li>Respect privacy. Do not share sensitive personal information about yourself or others (e.g., full names, addresses, phone numbers) without consent. Use first names or initials if needed.</li>
                        <li>Do not use the prayer wall for solicitation, advertising, or spam.</li>
                    </ul>

                    <h3>3. Content Standards</h3>
                    <p>
                        All content posted to MyPrayerTower must be appropriate for a general audience. We do not allow content that is:
                    </p>
                    <ul>
                        <li>Sexually explicit or pornographic.</li>
                        <li>Violent or graphic.</li>
                        <li>Illegal or promotes illegal acts.</li>
                        <li>Contrary to the teachings of the Catholic Church (while open to all, the platform is Catholic-centric).</li>
                    </ul>

                    <h3>4. Reporting Violations</h3>
                    <p>
                        If you see content or behavior that violates these guidelines, please report it immediately using the specialized reporting tools in the app or by contacting support.
                    </p>

                    <h3>5. Consequences</h3>
                    <p>
                        We reserve the right to remove any content that violates these guidelines and to suspend or ban users who repeatedly or severely violate them.
                    </p>
                </div>
            </div>
        </div>
    );
}
