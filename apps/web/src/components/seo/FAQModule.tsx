'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { JsonLd } from './JsonLd';
import { FAQPage } from 'schema-dts';

export interface FAQItem {
    question: string;
    answer: string;
}

interface FAQModuleProps {
    items: FAQItem[];
    title?: string;
    description?: string;
}

export function FAQModule({ items, title = "Frequently Asked Questions", description }: FAQModuleProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Schema Data
    const faqSchema: FAQPage = {
        '@type': 'FAQPage',
        mainEntity: items.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <section className="py-12 bg-gray-50 rounded-3xl border border-gray-100 my-16">
            <JsonLd<FAQPage> data={faqSchema} />

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <HelpCircle className="w-4 h-4" />
                        <span>FAQ</span>
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                    {description && <p className="text-gray-600">{description}</p>}
                </div>

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                aria-expanded={openIndex === index}
                            >
                                <span className="font-serif font-bold text-lg text-gray-900 pr-8">
                                    {item.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                                            <div className="pt-4" dangerouslySetInnerHTML={{ __html: item.answer }} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
