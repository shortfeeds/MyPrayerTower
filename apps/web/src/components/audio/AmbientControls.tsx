
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, Pause, Play, X, Headphones, VolumeX } from 'lucide-react';
import { useAudio, TRACKS } from './AudioContext';

export function AmbientControls() {
    const { isPlaying, activeTrack, volume, togglePlay, setTrack, setVolume, stop } = useAudio();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-24 right-6 z-40">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 p-6 bg-[#0A0A0A]/95 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-72 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Headphones className="w-4 h-4 text-liturgy" />
                                <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Sacred Audio</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {TRACKS.map((track) => (
                                <button
                                    key={track.id}
                                    onClick={() => setTrack(track)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${activeTrack?.id === track.id
                                            ? 'bg-liturgy text-white shadow-lg'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl ${activeTrack?.id === track.id ? 'bg-white/20' : 'bg-white/5'}`}>
                                        <Music className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-bold leading-none">{track.name}</div>
                                        <div className="text-[10px] opacity-60 mt-1 uppercase tracking-tighter">{track.category}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <button onClick={() => setVolume(volume === 0 ? 0.3 : 0)}>
                                    {volume === 0 ? <VolumeX className="w-4 h-4 text-gray-500" /> : <Volume2 className="w-4 h-4 text-gray-300" />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="flex-1 accent-liturgy h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                                />
                            </div>

                            <button
                                onClick={togglePlay}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                            >
                                {isPlaying ? (
                                    <>
                                        <Pause className="w-4 h-4 fill-current" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current" />
                                        Play
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 group ${isPlaying ? 'bg-liturgy text-white glow-liturgy' : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
                    }`}
            >
                <AnimatePresence mode="wait">
                    {isPlaying ? (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 45 }}
                            className="relative"
                        >
                            <Music className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="paused"
                            initial={{ opacity: 0, rotate: 45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -45 }}
                        >
                            <Headphones className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
}
