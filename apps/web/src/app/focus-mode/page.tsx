"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Check, Music, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import Link from 'next/link';

export default function FocusModePage() {
    const [timeLeft, setTimeLeft] = useState(15 * 60); // Default 15 mins
    const [isActive, setIsActive] = useState(false);
    const [initialTime, setInitialTime] = useState(15 * 60);
    const [showCompletion, setShowCompletion] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const presets = [5, 10, 15, 20, 30, 60];

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            setShowCompletion(true);
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
        setShowCompletion(false);
    };

    const setDuration = (minutes: number) => {
        const seconds = minutes * 60;
        setInitialTime(seconds);
        setTimeLeft(seconds);
        setIsActive(false);
        setShowCompletion(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden transition-colors duration-1000">
            {/* Background Ambience (Visual) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 z-0 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 p-6 flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Exit Focus</span>
                </Link>
                <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">

                {/* Timer Display */}
                <div className="mb-12 text-center">
                    <div className="text-[12rem] md:text-[16rem] leading-none font-light tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 select-none">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="text-slate-400 text-lg uppercase tracking-[0.2em] mt-4">Prayer Timer</div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8 mb-16">
                    <button
                        onClick={resetTimer}
                        className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-all hover:scale-105"
                        aria-label="Reset Timer"
                    >
                        <RotateCcw size={24} />
                    </button>

                    <button
                        onClick={toggleTimer}
                        className={`p-8 rounded-full ${isActive ? 'bg-amber-500/10 text-amber-500 border-2 border-amber-500/50' : 'bg-white text-slate-900'} transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]`}
                        aria-label={isActive ? 'Pause Timer' : 'Start Timer'}
                    >
                        {isActive ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
                    </button>

                    {/* Placeholder for Sound Controls - Future Enhancement */}

                </div>

                {/* Duration Presets */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 w-full max-w-2xl">
                    {presets.map((min) => (
                        <button
                            key={min}
                            onClick={() => setDuration(min)}
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${initialTime === min * 60
                                ? 'bg-white text-slate-900 shadow-lg'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {min} min
                        </button>
                    ))}
                </div>
            </main>

            {/* Completion Dialog */}
            {showCompletion && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={32} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Prayer Completed</h2>
                        <p className="text-slate-400 mb-8">You spent {Math.floor(initialTime / 60)} minutes in prayer. Well done.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={resetTimer}
                                className="flex-1 py-3 bg-white text-slate-900 rounded-xl font-medium hover:bg-slate-100 transition-colors"
                            >
                                Done
                            </button>
                            <button
                                onClick={() => {
                                    setDuration(initialTime / 60);
                                    toggleTimer();
                                }}
                                className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
                            >
                                Restart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
