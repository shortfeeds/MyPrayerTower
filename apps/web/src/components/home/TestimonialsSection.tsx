'use client';

import * as React from 'react';

import { Star, Quote, BadgeCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
    {
        id: 1,
        text: "MyPrayerTower has transformed my daily prayer life. The reminders and streak tracking keep me accountable, and I love being able to find Mass times wherever I travel.",
        author: "Maria Sanchez",
        role: "Premium Member",
        memberSince: "Member since 2023",
        location: "Dallas, TX",
        rating: 5,
        color: "bg-rose-500",
        initials: "MS"
    },
    {
        id: 2,
        text: "Finally, an app that brings together everything I need - daily readings, prayers, confession prep, and a beautiful prayer community. It's like having a spiritual companion in my pocket.",
        author: "John Doherty",
        role: "Daily Prayer Warrior",
        memberSince: "Member since 2022",
        location: "Boston, MA",
        rating: 5,
        color: "bg-blue-600",
        initials: "JD"
    },
    {
        id: 3,
        text: "The Prayer Wall feature is incredible. Knowing that believers around the world are praying for my intentions brings me so much peace and comfort.",
        author: "Sarah Mitchell",
        role: "Community Guide",
        memberSince: "Member since 2024",
        location: "Chicago, IL",
        rating: 5,
        color: "bg-emerald-500",
        initials: "SM"
    },
    {
        id: 4,
        text: "As a busy mom, this app makes it easy to incorporate prayer throughout my day. The quick prayer buttons are perfect for those small moments I can steal away.",
        author: "Jennifer Lopez",
        role: "Family Plan",
        memberSince: "Member since 2023",
        location: "Phoenix, AZ",
        rating: 5,
        color: "bg-purple-500",
        initials: "JL"
    },
    {
        id: 5,
        text: "I was struggling with my faith, but the Daily Journey helped me build a consistent habit. The 'Sacred Moments' remind me of the beauty of our traditions.",
        author: "Michael Chen",
        role: "Premium Member",
        memberSince: "Member since 2023",
        location: "San Francisco, CA",
        rating: 5,
        color: "bg-amber-500",
        initials: "MC"
    },
    {
        id: 6,
        text: "The audio rosary is beautifully produced. I listen to it on my commute every morning. It sets the tone for my entire day.",
        author: "Elizabeth Cote",
        role: "Audio Subscriber",
        memberSince: "Member since 2022",
        location: "New Orleans, LA",
        rating: 5,
        color: "bg-indigo-500",
        initials: "EC"
    },
    {
        id: 7,
        text: "The ability to request Mass offerings directly through the app is a game changer for me. It's so seamless and meaningful.",
        author: "Robert Wilson",
        role: "Patron",
        memberSince: "Member since 2021",
        location: "New York, NY",
        rating: 5,
        color: "bg-sacred-600",
        initials: "RW"
    },
    {
        id: 8,
        text: "I love the Saint of the Day feature! Learning about the lives of the saints inspires me to be a better person.",
        author: "Teresa G.",
        role: "Student",
        memberSince: "Member since 2024",
        location: "Miami, FL",
        rating: 5,
        color: "bg-teal-500",
        initials: "TG"
    },
    {
        id: 9,
        text: "Creating an Eternal Memorial for my grandmother was a beautiful way to honor her. The virtual candles and prayers from the community make me feel she is never forgotten.",
        author: "Catherine Haynes",
        role: "Family Guardian",
        memberSince: "Member since 2023",
        location: "Savannah, GA",
        rating: 5,
        color: "bg-rose-500",
        initials: "CH"
    }
];

export function TestimonialsSection() {
    const [visibleCount, setVisibleCount] = React.useState(9);
    const visibleTestimonials = TESTIMONIALS.slice(0, visibleCount);
    const hasMore = visibleCount < TESTIMONIALS.length;

    // Enhanced Testimonial Card Design
    return (
        <section className="relative py-24 overflow-hidden bg-[#fafafa] dark:bg-[#020202]">
            {/* Background Decorations - Subtle & Sacred */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
            <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-sacred-500/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[100px] translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-full text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-8">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            Trusted by 10,000+ Catholics
                        </div>
                        <h2 className="font-serif text-5xl md:text-6xl text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                            Stories of <span className="italic text-sacred-600 dark:text-sacred-400">Grace</span> & <span className="relative inline-block">
                                Growth
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold-400/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                            See how MyPrayerTower is helping people around the world deepen their relationship with God and find peace in their daily lives.
                        </p>
                    </motion.div>
                </div>

                {/* Grid Layout - Cleaner Row Alignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="h-full"
                        >
                            <div className="h-full bg-white dark:bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-3xl hover:shadow-gold-500/10 hover:-translate-y-2 transition-all duration-500 relative group overflow-hidden flex flex-col">

                                {/* Background Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Quote Icon */}
                                <Quote className="absolute top-8 right-8 w-10 h-10 text-gray-100 dark:text-white/5 group-hover:text-gold-100 dark:group-hover:text-gold-500/20 transition-colors fill-current transform group-hover:rotate-12 duration-500" />

                                {/* Stars */}
                                <div className="flex gap-1 mb-6 relative z-10">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
                                    ))}
                                </div>

                                {/* Text - Flex grow to push footer down */}
                                <div className="flex-grow mb-8 relative z-10">
                                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-serif text-lg">
                                        "{testimonial.text}"
                                    </p>
                                </div>

                                {/* Author Block */}
                                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/5 relative z-10 mt-auto">
                                    <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-4 ring-white dark:ring-white/5 flex-shrink-0`}>
                                        {testimonial.initials}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-gray-900 dark:text-white">{testimonial.author}</div>
                                            {index < 6 && (
                                                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50 dark:fill-blue-900/30" />
                                            )}
                                        </div>
                                        <div className="text-xs font-semibold text-sacred-600 dark:text-sacred-400 mb-0.5 tracking-wide uppercase">{testimonial.role}</div>
                                        <div className="text-xs text-gray-400">{testimonial.location}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Load More Button - Only show if there are more */}
                {hasMore && (
                    <div className="mt-16 text-center">
                        <button
                            onClick={() => setVisibleCount(prev => Math.min(prev + 3, TESTIMONIALS.length))}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full text-gray-900 dark:text-white font-bold tracking-wide hover:bg-gray-50 dark:hover:bg-white/20 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            Read More Stories
                        </button>
                    </div>
                )}

                {/* Trust Footer */}
                <div className="mt-24 text-center border-t border-gray-100 dark:border-white/5 pt-16">
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-[0.2em] mb-10">Join believers from</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-40 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
                        {/* Placeholder Logos with better styling */}
                        <span className="text-2xl font-serif font-bold text-gray-800 dark:text-white flex items-center gap-3"><Sparkles className="w-6 h-6 text-gold-500" /> Catholic Weekly</span>
                        <span className="text-2xl font-serif font-bold text-gray-800 dark:text-white flex items-center gap-3"><Quote className="w-6 h-6 text-sacred-500" /> Faith Today</span>
                        <span className="text-2xl font-serif font-bold text-gray-800 dark:text-white flex items-center gap-3"><Star className="w-6 h-6 text-blue-500" /> Spirit Daily</span>
                        <span className="text-2xl font-serif font-bold text-gray-800 dark:text-white flex items-center gap-3"><BadgeCheck className="w-6 h-6 text-emerald-500" /> The Tablet</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
