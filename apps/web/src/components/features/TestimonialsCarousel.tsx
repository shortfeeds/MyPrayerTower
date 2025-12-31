'use client';

import { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
    text: string;
    author: string;
    role: string;
    rating: number;
    avatar?: string;
}

const testimonials: Testimonial[] = [
    {
        text: "MyPrayerTower has transformed my daily prayer life. Finding Mass times while traveling is now effortless, and the prayer wall connects me with Catholics worldwide.",
        author: "Maria G.",
        role: "Daily User, Philippines",
        rating: 5
    },
    {
        text: "As a parish administrator, this platform helps us reach our community digitally. The church management tools are exactly what we needed.",
        author: "Fr. Michael T.",
        role: "Pastor, St. Anthony Parish",
        rating: 5
    },
    {
        text: "The daily readings and saint biographies have deepened my understanding of our faith. I look forward to opening the app each morning.",
        author: "John D.",
        role: "RCIA Candidate, USA",
        rating: 5
    },
    {
        text: "My whole family uses this app! The prayer streak feature motivates my kids to pray daily. Such a blessing for Catholic families.",
        author: "Sarah M.",
        role: "Mother of 4, Ireland",
        rating: 5
    },
    {
        text: "Finally, an app that respects our Catholic traditions while being modern and easy to use. The Rosary guide is beautifully designed.",
        author: "Antonio R.",
        role: "Knight of Columbus, Mexico",
        rating: 5
    }
];

/**
 * TestimonialsCarousel - Animated testimonials section with auto-scroll
 */
export function TestimonialsCarousel() {
    const [current, setCurrent] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const goTo = (index: number) => {
        setCurrent(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length);
    const next = () => goTo((current + 1) % testimonials.length);

    return (
        <section className="py-24 bg-gradient-to-br from-primary-50 to-gold-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-gold-200 rounded-full blur-3xl opacity-30" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-4 block">
                        Testimonials
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Loved by Catholics <br />
                        <span className="text-primary-600">Around the World</span>
                    </h2>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Main Testimonial Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-10 md:p-14 relative">
                        <Quote className="absolute top-8 left-8 w-12 h-12 text-primary-100" />

                        <div className="relative z-10">
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonials[current].rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-serif italic">
                                "{testimonials[current].text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
                                    {testimonials[current].author[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-lg">
                                        {testimonials[current].author}
                                    </p>
                                    <p className="text-gray-500">
                                        {testimonials[current].role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`w-3 h-3 rounded-full transition-all ${i === current
                                            ? 'bg-primary-600 w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TestimonialsCarousel;
