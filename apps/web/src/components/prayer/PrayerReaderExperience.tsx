'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Scroll, Sparkles, X, Volume2, Maximize2, Minimize2 } from 'lucide-react';
import { FloatingPrayerDock, PrayerTheme, PrayerFontSize } from './FloatingPrayerDock';

interface PrayerReaderExperienceProps {
    prayer: {
        id: string;
        title: string;
        slug: string;
        content: string;
        category?: string | null;
        category_label?: string | null;
    };
    rubrics: string[];
    bodyParagraphs: string[];
    prayerUrl: string;
}

export function PrayerReaderExperience({
    prayer,
    rubrics,
    bodyParagraphs,
    prayerUrl
}: PrayerReaderExperienceProps) {
    const [theme, setTheme] = useState<PrayerTheme>('parchment');
    const [fontSize, setFontSize] = useState<PrayerFontSize>('base');
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [hasPrayed, setHasPrayed] = useState(false);

    // Audio Speech Synthesis Reference
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Stop speech synthesis on unmount
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Toggle Audio Recitation
    const toggleAudio = () => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert('Audio recitation is not supported in this browser.');
            return;
        }

        if (isPlayingAudio) {
            window.speechSynthesis.cancel();
            setIsPlayingAudio(false);
        } else {
            window.speechSynthesis.cancel(); // Cancel any existing speech

            // Prepare text for speech (clean markdown asterisks)
            const cleanText = `${prayer.title}. ${bodyParagraphs.join('. ').replace(/[*_#]/g, '')}`;
            const utterance = new SpeechSynthesisUtterance(cleanText);

            // Contemplative devotional speech parameters
            utterance.rate = 0.88; // Calm, reverent pacing
            utterance.pitch = 0.98;

            // Pick an English voice if available
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Samantha')));
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.onend = () => {
                setIsPlayingAudio(false);
            };

            utterance.onerror = () => {
                setIsPlayingAudio(false);
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
            setIsPlayingAudio(true);
        }
    };

    // "I Prayed" / "Say Amen" Interaction
    const handlePray = () => {
        setHasPrayed(true);
    };

    // Typography Class Mapping
    const getFontSizeClass = () => {
        switch (fontSize) {
            case 'sm': return 'text-base md:text-lg leading-relaxed';
            case 'base': return 'text-lg md:text-xl leading-loose';
            case 'lg': return 'text-xl md:text-2xl leading-loose';
            case 'xl': return 'text-2xl md:text-3xl leading-loose';
        }
    };

    // Sacred Theme Card Styles
    const getThemeCardStyles = () => {
        switch (theme) {
            case 'parchment':
                return {
                    card: 'bg-[#faf8f5] text-stone-900 border border-stone-200/80 shadow-xl',
                    rubrics: 'bg-amber-50/90 text-amber-950 border-amber-200/80',
                    rubricDot: 'bg-amber-600',
                    headerText: 'text-stone-900',
                    versicle: 'border-l-2 border-amber-500 bg-amber-100/30 text-stone-900',
                    firstLetter: 'first-letter:text-amber-700'
                };
            case 'sepia':
                return {
                    card: 'bg-[#f4ede2] text-[#3a2818] border border-[#e2d5c3] shadow-xl',
                    rubrics: 'bg-[#ebe0cf] text-[#422d1a] border-[#dac9b0]',
                    rubricDot: 'bg-[#8c5825]',
                    headerText: 'text-[#3a2818]',
                    versicle: 'border-l-2 border-[#b57a3d] bg-[#ebd8be]/40 text-[#3a2818]',
                    firstLetter: 'first-letter:text-[#8c5825]'
                };
            case 'sanctuary':
                return {
                    card: 'bg-[#0e0915] text-[#f1ede6] border border-gold-500/30 shadow-2xl shadow-gold-950/20',
                    rubrics: 'bg-[#181024] text-gold-200 border-gold-500/20',
                    rubricDot: 'bg-gold-400',
                    headerText: 'text-gold-300',
                    versicle: 'border-l-2 border-gold-400 bg-gold-500/10 text-gold-100',
                    firstLetter: 'first-letter:text-gold-400'
                };
        }
    };

    const themeStyles = getThemeCardStyles();

    return (
        <>
            {/* Fullscreen Focus Mode Overlay */}
            {isFocusMode ? (
                <div className="fixed inset-0 z-[110] bg-[#07040b] text-white overflow-y-auto flex flex-col justify-between p-6 sm:p-12 animate-fade-in">
                    {/* Top Focus Bar */}
                    <div className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                            <span className="text-xs uppercase tracking-widest text-gold-400/90 font-medium">
                                Sanctuary Focus Mode
                            </span>
                        </div>
                        <button
                            onClick={() => setIsFocusMode(false)}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                        >
                            <Minimize2 className="w-4 h-4" />
                            <span>Exit Focus</span>
                        </button>
                    </div>

                    {/* Central Sacred Contemplation Area */}
                    <div className="max-w-2xl mx-auto w-full py-12">
                        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold-300 text-center mb-8 leading-tight">
                            {prayer.title}
                        </h2>

                        <div className={`font-serif ${getFontSizeClass()} text-white/90 space-y-8 text-center`}>
                            {bodyParagraphs.map((paragraph, idx) => (
                                <p key={idx} className="leading-loose">
                                    {paragraph.replace(/[*_#]/g, '')}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Devotional Action in Focus Mode */}
                    <div className="max-w-md mx-auto w-full text-center pt-8 border-t border-white/10">
                        <button
                            onClick={() => {
                                handlePray();
                                setIsFocusMode(false);
                            }}
                            className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0a0612] font-serif font-bold text-base shadow-lg transition-all"
                        >
                            Say Amen & Return
                        </button>
                    </div>
                </div>
            ) : (
                /* Standard In-Page Sacred Reader Card */
                <div className={`rounded-2xl ${themeStyles.card} p-6 sm:p-10 md:p-14 lg:p-16 relative overflow-hidden mb-16 transition-colors duration-300`}>
                    {/* Top Decorative Gold Ribbon */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300"></div>

                    {/* Watermark Cross/Sacred Emblem */}
                    <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
                        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>

                    {/* Audio Recitation Banner (Active State) */}
                    {isPlayingAudio && (
                        <div className="mb-6 p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-2.5 text-xs text-gold-400 font-medium">
                                <Volume2 className="w-4 h-4 text-gold-400 animate-bounce" />
                                <span>Reciting prayer aloud in devotional contemplation...</span>
                            </div>
                            <button
                                onClick={toggleAudio}
                                className="text-xs px-2.5 py-1 rounded-md bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 font-semibold"
                            >
                                Stop
                            </button>
                        </div>
                    )}

                    {/* Liturgical Rubrics & Roots Callout Card */}
                    {rubrics.length > 0 && (
                        <div className={`mb-10 p-5 sm:p-7 rounded-2xl ${themeStyles.rubrics} border shadow-sm`}>
                            <div className="flex items-center gap-2.5 mb-4 font-bold text-xs uppercase tracking-wider">
                                <span className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10">
                                    <Scroll className="w-4 h-4" />
                                </span>
                                <span>Liturgical Setting, Posture & Origins</span>
                            </div>
                            <div className="space-y-3 text-sm md:text-base leading-relaxed font-sans">
                                {rubrics.map((rubric, rIdx) => (
                                    <div key={rIdx} className="flex items-start gap-3">
                                        <span className={`mt-2 w-1.5 h-1.5 rounded-full ${themeStyles.rubricDot} shrink-0`}></span>
                                        <p
                                            className="flex-1"
                                            dangerouslySetInnerHTML={{
                                                __html: rubric
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                                                    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sacred Text Content with Dynamic Font Scaling */}
                    <div className={`font-serif ${getFontSizeClass()} space-y-6`}>
                        {bodyParagraphs.map((paragraph, idx) => {
                            const isHeader = paragraph.startsWith('**') && paragraph.endsWith('**');
                            const isVersicle = paragraph.startsWith('V.') || paragraph.startsWith('R.') || paragraph.startsWith('Step ');

                            if (isHeader) {
                                return (
                                    <h3 key={idx} className={`font-sans font-bold text-base md:text-lg ${themeStyles.headerText} pt-4 pb-1 tracking-wide border-b border-black/5 dark:border-white/10`}>
                                        {paragraph.replace(/\*\*/g, '')}
                                    </h3>
                                );
                            }

                            return (
                                <p
                                    key={idx}
                                    className={`${idx === 0 ? `first-letter:text-5xl first-letter:font-bold ${themeStyles.firstLetter} first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]` : ''} ${isVersicle ? `pl-4 ${themeStyles.versicle} py-1 rounded-r-lg` : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: paragraph
                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                                            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Sacred Floating Capsule Dock (Positioned above MobileBottomNav) */}
            <FloatingPrayerDock
                prayerTitle={prayer.title}
                prayerContent={bodyParagraphs.join('\n\n')}
                prayerUrl={prayerUrl}
                fontSize={fontSize}
                setFontSize={setFontSize}
                theme={theme}
                setTheme={setTheme}
                isFocusMode={isFocusMode}
                setIsFocusMode={setIsFocusMode}
                isPlayingAudio={isPlayingAudio}
                toggleAudio={toggleAudio}
                hasPrayed={hasPrayed}
                onPray={handlePray}
            />
        </>
    );
}
