'use client';

import { Star, Users, Globe, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * TrustBar - Social proof bar showing trust signals
 * Displays user count, rating, and trust badges
 */
export function TrustBar() {
    const items = [
        {
            icon: Users,
            value: "1M+ Users",
            label: "Catholics Worldwide",
            iconBg: "bg-sacred-100",
            iconColor: "text-sacred-600"
        },
        {
            isRating: true,
            value: "4.9/5",
            label: "12,000+ Reviews"
        },
        {
            icon: Building2,
            value: "10,000+",
            label: "Churches Listed",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600"
        },
        {
            icon: Globe,
            value: "100+",
            label: "Countries",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        }
    ];

    return (
        <motion.section
            className="py-6 bg-gradient-to-r from-cream-50 to-white border-y border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            {'isRating' in item && item.isRating ? (
                                <>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="w-5 h-5 text-gold-500 fill-gold-500"
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{item.value}</div>
                                        <div className="text-xs text-gray-500">{item.label}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center`}>
                                        {item.icon && <item.icon className={`w-5 h-5 ${item.iconColor}`} />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{item.value}</div>
                                        <div className="text-xs text-gray-500">{item.label}</div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
