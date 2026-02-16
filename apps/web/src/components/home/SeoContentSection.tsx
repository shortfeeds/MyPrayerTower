import { FAQSection } from '@/components/seo/FAQSection';
import Link from 'next/link';

const FAQS = [
    {
        question: "Is MyPrayerTower a free Catholic app?",
        answer: "Yes, MyPrayerTower is a free Catholic app dedicated to helping the faithful find churches, pray the Rosary, and connect with a global community of prayer. We offer premium features for those who wish to support our mission, but the core spiritual tools are accessible to everyone."
    },
    {
        question: "How do I find mass times near me?",
        answer: "You can use our 'Churches' feature to find Catholic Mass times, Confession schedules, and Adoration hours near your current location. our database covers thousands of parishes worldwide."
    },
    {
        question: "Can I pray the Rosary online?",
        answer: "Absolutely. MyPrayerTower features a comprehensive interactive Rosary guide that walks you through the Joyful, Sorrowful, Glorious, and Luminous mysteries, complete with prayers and meditations for each bead."
    },
    {
        question: "What is a Novena?",
        answer: "A Novena is a traditional Catholic devotion consisting of prayers said over nine consecutive days. MyPrayerTower offers a digital Novena tracker to help you stay faithful to these powerful intercessory prayers."
    }
];

export function SeoContentSection() {
    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* SEO Content Block */}
                <div className="prose prose-lg prose-stone mx-auto text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        The Most Complete <span className="text-gold-600">Catholic Prayer App</span> & Community
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        MyPrayerTower is more than just a website; it is a digital sanctuary for the modern Catholic.
                        In an increasingly noisy world, we provide a sacred space to find
                        <span className="font-bold text-gray-800"> peace, community, and spiritual growth</span>.
                        Whether you are looking to <Link href="/rosary">pray the Rosary</Link>, find <Link href="/churches">Mass times near you</Link>,
                        or simply light a virtual candle for a loved one, MyPrayerTower is your daily companion in faith.
                    </p>
                </div>

                {/* Keyword Columns */}
                <div className="grid md:grid-cols-3 gap-8 mb-20 text-center md:text-left">
                    <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Daily Catholic Prayers</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Access a vast library of traditional prayers, from the <Link href="/prayers/morning-offering" className="text-gold-600 hover:underline">Morning Offering</Link> to
                            the <Link href="/prayers/angelus" className="text-gold-600 hover:underline">Angelus</Link> and Night Prayers.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Novena Tracker</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Never miss a day of your novena again. Join community novenas for <Link href="/novenas" className="text-gold-600 hover:underline">St. Jude</Link>,
                            Divine Mercy, and more.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Global Prayer Wall</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Share your intentions and pray for others. Experience the power of the Communion of Saints in real-time on our <Link href="/prayer-wall" className="text-gold-600 hover:underline">Prayer Wall</Link>.
                        </p>
                    </div>
                </div>

                {/* FAQ / People Also Ask */}
                <FAQSection items={FAQS} title="Common Questions about Catholic Prayer" />

            </div>
        </section>
    );
}
