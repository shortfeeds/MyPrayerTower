
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SacredPauseProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SacredPause({ isOpen, onClose }: SacredPauseProps) {
    const [phase, setPhase] = useState<'inhale' | 'hold-in' | 'exhale' | 'hold-out'>('inhale');
    const [cycleCount, setCycleCount] = useState(0);

    useEffect(() => {
        if (!isOpen) return;

        // Reset state on open
        setPhase('inhale');
        setCycleCount(0);

        // Breathing Cycle: 4-4-4-4 Box Breathing or 4-7-8
        // Let's do a simple 4-4-4 calming rhythm
        // Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (2s)

        const runCycle = async () => {
            while (isOpen) {
                setPhase('inhale');
                await new Promise(r => setTimeout(r, 4000));

                setPhase('hold-in');
                await new Promise(r => setTimeout(r, 4000));

                setPhase('exhale');
                await new Promise(r => setTimeout(r, 4000));

                setPhase('hold-out');
                await new Promise(r => setTimeout(r, 2000));

                setCycleCount(c => c + 1);
            }
        };

        // runCycle(); 
        // Logic issue: while loop blocks updates in some React setups or causes issues. 
        // Better to use setTimeout mapping.

        let timer: NodeJS.Timeout;

        const nextPhase = () => {
            setPhase(p => {
                if (p === 'inhale') return 'hold-in';
                if (p === 'hold-in') return 'exhale';
                if (p === 'exhale') return 'hold-out';
                return 'inhale';
            });
        };

        const scheduler = () => {
            setPhase(current => {
                let nextDuration = 4000;
                let nextP: typeof phase = 'inhale';

                if (current === 'inhale') { nextP = 'hold-in'; nextDuration = 4000; }
                else if (current === 'hold-in') { nextP = 'exhale'; nextDuration = 4000; }
                else if (current === 'exhale') { nextP = 'hold-out'; nextDuration = 2000; }
                else { nextP = 'inhale'; nextDuration = 4000; setCycleCount(c => c + 1); }

                timer = setTimeout(scheduler, nextDuration);
                return nextP;
            });
        };

        // Start first cycle
        timer = setTimeout(scheduler, 4000); // Wait for first inhale to finish

        return () => clearTimeout(timer);
    }, [isOpen]);

    const getText = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In';
            case 'hold-in': return 'Hold';
            case 'exhale': return 'Breathe Out';
            case 'hold-out': return 'Rest';
        }
    };

    const getScale = () => {
        switch (phase) {
            case 'inhale': return 1.5;
            case 'hold-in': return 1.5;
            case 'exhale': return 1.0;
            case 'hold-out': return 1.0;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/90 backdrop-blur-md"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="relative flex items-center justify-center w-64 h-64">
                            {/* Outer Glow Ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-gold-500/30"
                                animate={{
                                    scale: getScale(),
                                    opacity: phase === 'hold-out' ? 0.3 : 0.6
                                }}
                                transition={{ duration: phase === 'inhale' || phase === 'exhale' ? 4 : 0.5, ease: "easeInOut" }}
                            />

                            {/* Inner Circle */}
                            <motion.div
                                className="w-32 h-32 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center z-10"
                                animate={{
                                    scale: getScale(),
                                }}
                                transition={{ duration: phase === 'inhale' || phase === 'exhale' ? 4 : 0.5, ease: "easeInOut" }}
                            >
                            </motion.div>

                            {/* Text Overlay */}
                            <motion.p
                                key={phase}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute pointer-events-none text-white font-serif text-2xl tracking-widest uppercase z-20 mix-blend-overlay font-bold"
                            >
                                {getText()}
                            </motion.p>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-12 text-white/60 font-serif italic text-center max-w-sm"
                        >
                            "Be still, and know that I am God."
                            <span className="block text-sm not-italic mt-2 text-white/30">— Psalm 46:10</span>
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
