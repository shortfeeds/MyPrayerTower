'use client';

import { useState } from 'react';
import { BookOpen, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

// Morning and evening prayers for each day
const PRAYERS = {
    morning: [
        {
            title: 'Morning Offering',
            text: 'O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world.',
            attribution: 'Traditional Catholic Prayer'
        },
        {
            title: 'Prayer to the Holy Spirit',
            text: 'Come, Holy Spirit, fill the hearts of Your faithful and kindle in them the fire of Your love. Send forth Your Spirit and they shall be created, and You shall renew the face of the earth.',
            attribution: 'Traditional Catholic Prayer'
        },
        {
            title: 'Guardian Angel Prayer',
            text: 'Angel of God, my guardian dear, to whom God\'s love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.',
            attribution: 'Traditional Catholic Prayer'
        },
    ],
    evening: [
        {
            title: 'Act of Contrition',
            text: 'O my God, I am heartily sorry for having offended Thee, and I detest all my sins because I dread the loss of Heaven and the pains of hell, but most of all because they offend Thee, my God, Who art all good and deserving of all my love.',
            attribution: 'Traditional Catholic Prayer'
        },
        {
            title: 'Night Prayer',
            text: 'Visit, we beseech Thee, O Lord, this dwelling, and drive far from it all snares of the enemy. Let Thy holy angels dwell herein to preserve us in peace; and let Thy blessing be upon all who dwell here, through Jesus Christ our Lord. Amen.',
            attribution: 'From Night Prayer (Compline)'
        },
        {
            title: 'Prayer Before Sleep',
            text: 'Lord, as I lay down to sleep, I give You thanks for this day. Protect me through the night, forgive my failings, and grant me peaceful rest. Into Your hands I commend my spirit. Amen.',
            attribution: 'Evening Prayer'
        },
    ],
};

interface PrayerOfTheDayWidgetProps {
    onPrayerCompleted?: () => void;
    initialCompleted?: boolean;
}

export function PrayerOfTheDayWidget({ onPrayerCompleted, initialCompleted = false }: PrayerOfTheDayWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPrayed, setIsPrayed] = useState(initialCompleted);
    const [showCelebration, setShowCelebration] = useState(false);

    // Get prayer based on time of day and day of week
    const hour = new Date().getHours();
    const isMorning = hour < 14; // Before 2 PM
    const dayOfWeek = new Date().getDay();

    const prayers = isMorning ? PRAYERS.morning : PRAYERS.evening;
    const todaysPrayer = prayers[dayOfWeek % prayers.length];
    const prayerType = isMorning ? 'Morning' : 'Evening';

    const handlePrayNow = () => {
        if (!isPrayed) {
            setIsPrayed(true);
            setShowCelebration(true);
            onPrayerCompleted?.();

            // Hide celebration after animation
            setTimeout(() => setShowCelebration(false), 2000);
        }
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-sacred-50 via-white to-gold-50 rounded-2xl border border-sacred-100 shadow-sm hover:shadow-md transition-all">
            {/* Celebration overlay */}
            {showCelebration && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-sacred-600/90 animate-fade-in">
                    <div className="text-center text-white">
                        <div className="text-5xl mb-2 animate-bounce">🙏</div>
                        <p className="font-bold text-xl">Prayer Completed!</p>
                        <p className="text-sm opacity-80">God bless you today</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-5 pb-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${isPrayed
                                ? 'bg-gradient-to-br from-green-400 to-green-500'
                                : 'bg-gradient-to-br from-sacred-500 to-sacred-600'
                            }`}>
                            {isPrayed ? (
                                <Check className="w-6 h-6 text-white" />
                            ) : (
                                <BookOpen className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-sacred-600 uppercase tracking-wide">
                                    {prayerType} Prayer
                                </span>
                                {isPrayed && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                        ✓ Completed
                                    </span>
                                )}
                            </div>
                            <h3 className="font-display text-lg font-bold text-gray-900">
                                {todaysPrayer.title}
                            </h3>
                        </div>
                    </div>

                    {!isPrayed && (
                        <button
                            onClick={handlePrayNow}
                            className="px-4 py-2 bg-gradient-to-r from-sacred-500 to-sacred-600 hover:from-sacred-600 hover:to-sacred-700 text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-1.5"
                        >
                            <Sparkles className="w-4 h-4" />
                            Pray Now
                        </button>
                    )}
                </div>
            </div>

            {/* Prayer text (collapsible) */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-5 pb-5">
                    <div className="bg-white/70 rounded-xl p-4 border border-sacred-100">
                        <p className="text-gray-700 italic leading-relaxed">
                            "{todaysPrayer.text}"
                        </p>
                        <p className="text-xs text-gray-500 mt-3">— {todaysPrayer.attribution}</p>
                    </div>
                </div>
            </div>

            {/* Expand/collapse toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-3 border-t border-sacred-100 flex items-center justify-center gap-2 text-sm font-medium text-sacred-600 hover:bg-sacred-50 transition-colors"
            >
                {isExpanded ? (
                    <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Prayer
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4" />
                        Read Prayer
                    </>
                )}
            </button>
        </div>
    );
}
