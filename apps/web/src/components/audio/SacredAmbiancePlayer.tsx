'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Bell, Music, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SoundMode = 'chimes' | 'gregorian' | 'off';

export function SacredAmbiancePlayer() {
    const [soundMode, setSoundMode] = useState<SoundMode>('off');
    const [volume, setVolume] = useState<number>(0.3);
    const [isOpen, setIsOpen] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<any>(null);
    const droneGainRef = useRef<GainNode | null>(null);

    // Initialize Web Audio Context lazily on user gesture
    const getAudioContext = () => {
        if (!audioCtxRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AudioContextClass();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    // Synthesize Authentic Roman Cathedral Bell Strike
    const playCathedralBell = (ctx: AudioContext, baseFreq = 220) => {
        const now = ctx.currentTime;
        // Harmonic bell partials (Hum, Prime, Tierce, Quint, Nominal, Super-quint)
        const partials = [
            { freq: baseFreq * 0.5, gain: 0.45, decay: 6.0 },   // Hum note
            { freq: baseFreq * 1.0, gain: 0.6, decay: 4.5 },    // Fundamental Prime
            { freq: baseFreq * 1.189, gain: 0.35, decay: 3.8 }, // Minor Tierce
            { freq: baseFreq * 1.5, gain: 0.25, decay: 3.2 },   // Quint
            { freq: baseFreq * 2.0, gain: 0.3, decay: 2.8 },    // Nominal octave
            { freq: baseFreq * 2.75, gain: 0.15, decay: 1.8 },  // High partial
        ];

        partials.forEach(p => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(p.freq, now);

            // Slight detune for authentic acoustic bronze resonance
            osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(p.gain * volume, now + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + p.decay + 0.1);
        });
    };

    // Contemplative Monastic Gregorian Formant Drone
    const startMonasticDrone = (ctx: AudioContext) => {
        stopAudio();
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(volume * 0.25, now + 3);
        masterGain.connect(ctx.destination);
        droneGainRef.current = masterGain;

        // Vowel formant frequencies for contemplative sacred chanting
        const notes = [110, 164.81, 220]; // A2, E3, A3 perfect fifths
        notes.forEach(freq => {
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(450, now); // Warm vocal formants
            filter.Q.setValueAtTime(3.5, now);

            osc.connect(filter);
            filter.connect(masterGain);
            osc.start(now);
        });
    };

    const stopAudio = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (droneGainRef.current && audioCtxRef.current) {
            try {
                droneGainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1);
            } catch {}
            droneGainRef.current = null;
        }
    };

    const handleSelectMode = (mode: SoundMode) => {
        stopAudio();
        setSoundMode(mode);

        if (mode === 'off') return;

        const ctx = getAudioContext();

        if (mode === 'chimes') {
            // Strike bell immediately, then periodically every 14 seconds
            playCathedralBell(ctx, 220);
            intervalRef.current = setInterval(() => {
                const bells = [220, 247, 196, 164.81];
                const chosen = bells[Math.floor(Math.random() * bells.length)];
                playCathedralBell(ctx, chosen);
            }, 14000);
        } else if (mode === 'gregorian') {
            startMonasticDrone(ctx);
        }
    };

    useEffect(() => {
        return () => stopAudio();
    }, []);

    return (
        <div
            style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 45 }}
            className="fixed bottom-6 left-6 z-45"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        style={{ backgroundColor: '#0f091c' }}
                        className="mb-3 p-4 rounded-2xl bg-[#0f091c] border border-amber-500/30 backdrop-blur-md shadow-2xl text-white w-64 text-xs flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="font-serif font-bold text-amber-200 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                Sacred Ambiance
                            </span>
                            <span className="text-[10px] text-gray-400">Prayer Music</span>
                        </div>

                        {/* Sound Selectors */}
                        <div className="flex flex-col gap-1.5">
                            <button
                                onClick={() => handleSelectMode('chimes')}
                                className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                                    soundMode === 'chimes'
                                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                <Bell className="w-4 h-4 text-amber-400" />
                                <div>
                                    <div className="font-medium">Cathedral Chimes</div>
                                    <div className="text-[10px] text-gray-400">Authentic Roman bells</div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleSelectMode('gregorian')}
                                className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                                    soundMode === 'gregorian'
                                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                <Music className="w-4 h-4 text-amber-400" />
                                <div>
                                    <div className="font-medium">Monastic Chants</div>
                                    <div className="text-[10px] text-gray-400">Contemplative choir drone</div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleSelectMode('off')}
                                className={`px-3 py-1.5 rounded-xl border text-center transition-all ${
                                    soundMode === 'off'
                                        ? 'bg-white/10 border-white/20 text-gray-300'
                                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                Silence Audio
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3.5 rounded-full shadow-2xl transition-all duration-300 active:scale-90 flex items-center justify-center border ${
                    soundMode !== 'off'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-300 shadow-amber-500/30'
                        : 'bg-[#120a24]/90 text-amber-400 border-amber-500/30 hover:bg-[#1a0f33]'
                }`}
                aria-label="Sacred Ambiance Player"
                title="Sacred Ambiance (Cathedral Chimes & Monastic Chants)"
            >
                {soundMode !== 'off' ? (
                    <Volume2 className="w-5 h-5 animate-pulse" />
                ) : (
                    <VolumeX className="w-5 h-5 opacity-70" />
                )}
            </button>
        </div>
    );
}
