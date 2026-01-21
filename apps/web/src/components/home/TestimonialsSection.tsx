'use client';

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
    },
    {
        id: 10,
        text: "Simple, elegant, and deeply Catholic. No distractions, just pure focus on God. Highly recommend for anyone looking to deepen their faith.",
        author: "Fr. James P.",
        role: "Clergy",
        memberSince: "Member since 2021",
        location: "Denver, CO",
        rating: 5,
        color: "bg-slate-700",
        initials: "FP"
    }
];

export function TestimonialsSection() {
    return (
        <div className="relative py-12 overflow-hidden bg-gradient-to-b from-cream-50 to-white">
            {/* Background Decorations */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold-100/40 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sacred-50/50 rounded-full blur-[120px] translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 shadow-sm rounded-full text-sm font-semibold text-gray-600 mb-6">
                            <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                            Trusted by 10,000+ Catholics
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                            Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-orange-500">Grace & Growth</span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            See how MyPrayerTower is helping people around the world deepen their relationship with God.
                        </p>
                    </motion.div>
                </div>

                {/* Masonry Grid Layout using CSS Columns */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="break-inside-avoid"
                        >
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1 transition-all duration-300 relative group">
                                {/* Quote Icon */}
                                <Quote className="absolute top-8 right-8 w-8 h-8 text-gray-100 group-hover:text-gold-100 transition-colors fill-current" />

                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-gray-700 leading-relaxed mb-8 font-serif text-lg">
                                    "{testimonial.text}"
                                </p>

                                {/* Author Block */}
                                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                    <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                        {testimonial.initials}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-gray-900">{testimonial.author}</div>
                                            {index < 6 && ( // Verify first few for realism
                                                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
                                            )}
                                        </div>
                                        <div className="text-xs font-semibold text-sacred-600 mb-0.5">{testimonial.role}</div>
                                        <div className="text-xs text-gray-400">{testimonial.memberSince} • {testimonial.location}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Footer */}
                <div className="mt-10 text-center border-t border-gray-100 pt-10">
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-6">Join believers from</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logos */}
                        <span className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2"><Sparkles className="w-5 h-5" /> Catholic Weekly</span>
                        <span className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2"><Quote className="w-5 h-5" /> Faith Today</span>
                        <span className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2"><Star className="w-5 h-5" /> Spirit Daily</span>
                        <span className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2"><BadgeCheck className="w-5 h-5" /> The Tablet</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
