'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TESTIMONIALS = [
    {
        id: 1,
        text: "MyPrayerTower has transformed my daily prayer life. The reminders and streak tracking keep me accountable, and I love being able to find Mass times wherever I travel.",
        author: "Maria S.",
        location: "Dallas, TX",
        rating: 5,
    },
    {
        id: 2,
        text: "Finally, an app that brings together everything I need - daily readings, prayers, confession prep, and a beautiful prayer community. It's like having a spiritual companion in my pocket.",
        author: "John D.",
        location: "Boston, MA",
        rating: 5,
    },
    {
        id: 3,
        text: "The Prayer Wall feature is incredible. Knowing that believers around the world are praying for my intentions brings me so much peace and comfort.",
        author: "Sarah M.",
        location: "Chicago, IL",
        rating: 5,
    },
    {
        id: 4,
        text: "As a busy mom, this app makes it easy to incorporate prayer throughout my day. The quick prayer buttons are perfect for those small moments I can steal away.",
        author: "Jennifer L.",
        location: "Phoenix, AZ",
        rating: 5,
    },
];

export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const goToPrev = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const testimonial = TESTIMONIALS[currentIndex];

    return (
        <div className="relative py-20 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-gold-100/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-sacred-50/50 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-gold-100 text-gold-700 text-sm font-bold rounded-full mb-4">
                        TRUSTED BY FAITHFUL USERS
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        What Our Community Says
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands of Catholics who have found peace, community, and spiritual growth.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Big Quote Icon */}
                    <div className="absolute -top-10 -left-10 text-gold-100 hidden md:block">
                        <Quote className="w-32 h-32 fill-current" />
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/10">
                        {/* Decorative gradient line */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-300 via-sacred-500 to-gold-300"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Stars */}
                            <div className="flex gap-1.5 mb-8">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 text-gold-400 fill-gold-400 drop-shadow-sm" />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-xl md:text-3xl text-gray-800 leading-relaxed mb-10 font-medium font-serif italic">
                                "{testimonial.text}"
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sacred-500 to-sacred-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-sacred-50">
                                    {testimonial.author.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 text-lg">{testimonial.author}</div>
                                    <div className="text-gray-500">{testimonial.location}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-6 mt-12">
                        <button
                            onClick={goToPrev}
                            className="p-4 rounded-full bg-white border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-all shadow-sm hover:shadow-md group"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-gold-600" />
                        </button>

                        <div className="flex gap-3">
                            {TESTIMONIALS.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => { setIsAutoPlaying(false); setCurrentIndex(index); }}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'w-8 bg-gold-500'
                                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={goToNext}
                            className="p-4 rounded-full bg-white border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-all shadow-sm hover:shadow-md group"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gold-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
