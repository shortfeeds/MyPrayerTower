'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FaqJsonLd } from './JsonLd';

interface FaqItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    items: FaqItem[];
    title?: string;
}

export function FAQSection({ items, title = 'Frequently Asked Questions' }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    return (
        <section className="py-10 bg-[#120E0A] rounded-2xl border border-gold-500/25 my-12">
            <FaqJsonLd data={jsonLd as any} />
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-2xl font-display font-bold text-[#FAF6EE] mb-8 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-gold-400" />
                    {title}
                </h2>
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#18120D] rounded-xl border border-gold-500/20 overflow-hidden transition-all duration-200 hover:border-gold-400/50"
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-semibold text-[#FAF6EE] text-lg">
                                    {item.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-gold-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-[#CFC5B4]" />
                                )}
                            </button>
                            <div
                                className={`transition-[max-height,opacity] duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 pb-6 text-[#CFC5B4] leading-relaxed border-t border-gold-500/10 pt-4">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
