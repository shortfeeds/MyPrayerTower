'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';

export function WelcomeGreeting() {
    const [greeting, setGreeting] = useState({
        text: "Peace be with you",
        subtext: "Welcome to your sanctuary.",
        icon: Sun
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            setGreeting({
                text: "Good Morning",
                subtext: "Begin your day with grace.",
                icon: Sunrise
            });
        } else if (hour >= 12 && hour < 17) {
            setGreeting({
                text: "Good Afternoon",
                subtext: "Pause and renew your strength.",
                icon: Sun
            });
        } else if (hour >= 17 && hour < 21) {
            setGreeting({
                text: "Good Evening",
                subtext: "Rest in His presence.",
                icon: Sunset
            });
        } else {
            setGreeting({
                text: "Peaceful Night",
                subtext: "The Lord watches over you.",
                icon: Moon
            });
        }
    }, []);

    // Remove early return to prevent CLS
    // if (!mounted) return null; 

    return (
        <div className="flex flex-col items-center animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                <greeting.icon className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-medium tracking-widest uppercase text-gold-200/80">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 text-center tracking-tight font-light">
                {greeting.text}
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-light text-center max-w-lg mx-auto leading-relaxed">
                {greeting.subtext}
            </p>
        </div>
    );
}
