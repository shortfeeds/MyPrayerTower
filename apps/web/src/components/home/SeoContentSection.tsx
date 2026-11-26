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
        <section className="py-20 bg-[#18120D] text-[#FAF6EE] border-t border-gold-500/20">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* SEO Content Block */}
                <div className="mx-auto text-center mb-14 max-w-3xl">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-[#FAF6EE] mb-5">
                        A Global <span className="text-gold-300">Catholic Prayer Sanctuary</span> &amp; Devotional Community
                    </h2>
                    <p className="text-[#CFC5B4] text-base sm:text-lg leading-relaxed">
                        MyPrayerTower is a digital Catholic sanctuary for prayer, scripture, and remembrance.
                        In a busy world, we offer a quiet sacred space to find
                        <span className="font-semibold text-[#FAF6EE]"> peace, intercession, and spiritual growth</span>.
                        Whether you wish to <Link href="/candles" className="text-gold-300 hover:underline">light a virtual candle</Link>,{' '}
                        <Link href="/rosary" className="text-gold-300 hover:underline">pray the Holy Rosary</Link>,{' '}
                        <Link href="/mass-offerings" className="text-gold-300 hover:underline">request a Holy Mass</Link>,{' '}
                        or <Link href="/churches" className="text-gold-300 hover:underline">find Catholic Mass times near you</Link>, MyPrayerTower is your daily companion in faith.
                    </p>
                </div>

                {/* Keyword Columns */}
                <div className="grid md:grid-cols-3 gap-6 mb-16 text-center md:text-left">
                    <div className="p-6 bg-[#120E0A] border border-gold-500/20 rounded-2xl">
                        <h3 className="font-display text-lg font-bold text-[#FAF6EE] mb-2">Daily Catholic Prayers</h3>
                        <p className="text-sm text-[#CFC5B4]">
                            Access 3,900+ traditional prayers, from the <Link href="/prayers/morning-offering" className="text-gold-300 hover:underline">Morning Offering</Link> to
                            the <Link href="/prayers/angelus" className="text-gold-300 hover:underline">Angelus</Link> and Daily Readings.
                        </p>
                    </div>
                    <div className="p-6 bg-[#120E0A] border border-gold-500/20 rounded-2xl">
                        <h3 className="font-display text-lg font-bold text-[#FAF6EE] mb-2">Novenas &amp; Sponsored Vigils</h3>
                        <p className="text-sm text-[#CFC5B4]">
                            Track 9-day <Link href="/novenas" className="text-gold-300 hover:underline">Novenas</Link> or{' '}
                            <Link href="/events" className="text-gold-300 hover:underline">sponsor a Rosary Marathon</Link> in honor of your family and loved ones.
                        </p>
                    </div>
                    <div className="p-6 bg-[#120E0A] border border-gold-500/20 rounded-2xl">
                        <h3 className="font-display text-lg font-bold text-[#FAF6EE] mb-2">Global Prayer Wall</h3>
                        <p className="text-sm text-[#CFC5B4]">
                            Share your intentions and pray for others in the Communion of Saints on our <Link href="/prayer-wall" className="text-gold-300 hover:underline">Prayer Wall</Link>.
                        </p>
                    </div>
                </div>

                {/* FAQ / People Also Ask */}
                <FAQSection items={FAQS} title="Common Questions about Catholic Prayer & Offerings" />

            </div>
        </section>
    );
}
