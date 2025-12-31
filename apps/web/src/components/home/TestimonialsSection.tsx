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
        <div className="relative">
            <div className="text-center mb-10">
                <span className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-4 block">
                    Trusted by Faithful Users
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
                    What Our Community Says
                </h2>
            </div>

            <div className="relative max-w-3xl mx-auto">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8 text-gold-200">
                    <Quote className="w-16 h-16 fill-current" />
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gold-50 to-transparent rounded-bl-full opacity-50"></div>

                    <div className="relative z-10">
                        {/* Stars */}
                        <div className="flex gap-1 mb-6">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
                            ))}
                        </div>

                        {/* Quote */}
                        <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                            "{testimonial.text}"
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sacred-500 to-sacred-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {testimonial.author.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{testimonial.author}</div>
                                <div className="text-sm text-gray-500">{testimonial.location}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={goToPrev}
                        className="p-2 rounded-full bg-white border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors shadow-sm"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="flex gap-2">
                        {TESTIMONIALS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => { setIsAutoPlaying(false); setCurrentIndex(index); }}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? 'w-6 bg-gold-500'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={goToNext}
                        className="p-2 rounded-full bg-white border border-gray-200 hover:border-gold-300 hover:bg-gold-50 transition-colors shadow-sm"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
