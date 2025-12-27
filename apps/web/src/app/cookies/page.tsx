export default function CookiesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <section className="bg-white py-16 border-b border-gray-100">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Cookie Policy</h1>
                    <p className="text-gray-500">Last updated: December 26, 2024</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="prose prose-lg prose-blue max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <p>
                        This Cookie Policy explains how MyPrayerTower ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                    </p>

                    <h3>What are cookies?</h3>
                    <p>
                        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                    </p>

                    <h3>Why do we use cookies?</h3>
                    <p>
                        We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
                    </p>

                    <h3>Types of Cookies We Use</h3>
                    <ul>
                        <li><strong>Essential website cookies:</strong> These cookies are strictly necessary to provide you with services available through our Website and to use some of its features.</li>
                        <li><strong>Performance and functionality cookies:</strong> These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use.</li>
                        <li><strong>Analytics and customization cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are.</li>
                    </ul>

                    <h3>How can I control cookies?</h3>
                    <p>
                        You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                    </p>
                </div>
            </div>
        </div>
    );
}
