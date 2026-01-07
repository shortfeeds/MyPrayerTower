'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="font-semibold text-lg text-gray-900 group-hover:text-sacred-600 transition-colors pr-4">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-sacred-600' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'
                    }`}
            >
                <p className="text-gray-600 leading-relaxed pr-8">{answer}</p>
            </div>
        </div>
    );
}

/**
 * FAQSection - Frequently asked questions with accordion
 */
export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "Is MyPrayerTower really free?",
            answer: "Yes! MyPrayerTower is completely free to use. We believe everyone should have access to tools that help them grow in their faith. Our mission is supported by optional donations and offerings, but all core features are free forever."
        },
        {
            question: "Is this app approved by the Catholic Church?",
            answer: "MyPrayerTower is built by practicing Catholics and follows the teachings of the Catholic Church. Our prayers, readings, and content are carefully curated to align with Catholic doctrine. While we are not officially endorsed by the Vatican, our content is faithful to Church teachings."
        },
        {
            question: "How do I find my local parish?",
            answer: "Our church finder includes over 10,000 Catholic churches worldwide. Simply enter your location, and we'll show you nearby parishes with Mass times, confession schedules, and contact information. You can also save your home parish for quick access."
        },
        {
            question: "Can I pray with others in real-time?",
            answer: "Absolutely! We offer Live Prayer Sessions throughout the day including Morning Rosary, Divine Mercy Chaplet, and Evening Prayer. Join thousands of Catholics praying together at scheduled times, or post your intentions on the Prayer Wall for others to pray for."
        },
        {
            question: "What is the Prayer Wall?",
            answer: "The Prayer Wall is a community space where you can share prayer intentions and pray for others. You can post your own intentions for the community to support, or browse and pray for intentions posted by other faithful Catholics around the world."
        },
        {
            question: "How do streaks and achievements work?",
            answer: "When you pray daily, you build a prayer streak. The longer your streak, the more badges and achievements you unlock. This gamification element is designed to encourage consistent prayer habits while celebrating your spiritual growth milestones."
        },
        {
            question: "Is my data private and secure?",
            answer: "Your privacy is sacred to us. We use industry-standard encryption and never sell your personal data. Prayer intentions can be posted anonymously, and your spiritual journey data is visible only to you. We comply with all data protection regulations."
        }
    ];

    // Generate FAQ schema for SEO
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };

    return (
        <section className="py-20 bg-cream-50">
            {/* FAQ Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sacred-100 text-sacred-700 text-sm font-bold rounded-full mb-4">
                            <HelpCircle className="w-4 h-4" />
                            FREQUENTLY ASKED QUESTIONS
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Got Questions? <span className="text-sacred-600">We Have Answers</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Everything you need to know about MyPrayerTower.
                        </p>
                    </motion.div>

                    {/* FAQ Accordion */}
                    <motion.div
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </motion.div>

                    {/* Contact CTA */}
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <p className="text-gray-600 mb-4">
                            Still have questions?
                        </p>
                        <a
                            href="mailto:support@myprayertower.com"
                            className="inline-flex items-center gap-2 text-sacred-600 font-semibold hover:text-sacred-700 transition-colors"
                        >
                            Contact our support team →
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
