
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Scroll, Heart, Cross, Trash2, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface ExamenCategory {
    title: string;
    items: string[];
}

const CATEGORIES: ExamenCategory[] = [
    {
        title: "Relationship with God",
        items: [
            "Have I loved God above all things, or made 'idols' of money, fame, or pleasure?",
            "Have I used God's name in vain or inappropriately?",
            "Have I missed Mass on Sundays or Holy Days of Obligation without serious reason?",
            "Have I neglected my daily prayer life?",
            "Have I doubted God's mercy or presumed upon His grace?"
        ]
    },
    {
        title: "Relationship with Others",
        items: [
            "Have I been impatient, angry, or resentful toward others?",
            "Have I failed to respect my parents or those in authority?",
            "Have I spoken ill of others (gossip) or damaged their reputation?",
            "Have I stolen or failed to return borrowed items?",
            "Have I been honest in my work and dealings with others?"
        ]
    },
    {
        title: "Purity and Self",
        items: [
            "Have I indulged in impure thoughts or looked at inappropriate content?",
            "Have I failed to practice moderation in food, drink, or entertainment?",
            "Have I been proud, vain, or self-centered?",
            "Have I harbored envy or jealousy toward others' success?",
            "Have I been lazy or neglected my duties at home or work?"
        ]
    }
];

export default function ConfessionTool() {
    const [selectedSins, setSelectedSins] = useState<string[]>([]);
    const [step, setStep] = useState<'intro' | 'examen' | 'guide'>('intro');
    const [currentCat, setCurrentCat] = useState(0);

    const toggleSin = (sin: string) => {
        setSelectedSins(prev =>
            prev.includes(sin) ? prev.filter(s => s !== sin) : [...prev, sin]
        );
    };

    const clearSins = () => {
        if (confirm("Are you sure? This list is private and temporary. Clearing it will permanently remove these notes.")) {
            setSelectedSins([]);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-sacred-500/30">
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
                    >
                        <div className="w-24 h-24 bg-sacred-500/20 rounded-[2rem] flex items-center justify-center mb-8 border border-sacred-500/30">
                            <Cross className="w-12 h-12 text-sacred-400" />
                        </div>
                        <h1 className="text-5xl font-serif font-bold mb-6">Sacrament of <br /><span className="text-sacred-400">Reconciliation</span></h1>
                        <p className="text-blue-100/60 max-w-lg mx-auto text-lg font-light leading-relaxed mb-12">
                            "Come to me, all you who are weary and burdened, and I will give you rest."
                            Prepare your heart with a thorough examination of conscience.
                        </p>
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <button
                                onClick={() => setStep('examen')}
                                className="py-4 bg-sacred-600 hover:bg-sacred-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-sacred-900/40"
                            >
                                Begin Examination
                            </button>
                            <Link
                                href="/mass-times"
                                className="py-4 bg-white/5 hover:bg-white/10 text-white/70 font-bold rounded-2xl transition-all border border-white/5"
                            >
                                Find Confession Times
                            </Link>
                        </div>
                    </motion.div>
                )}

                {step === 'examen' && (
                    <motion.div
                        key="examen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="container mx-auto px-4 py-32 max-w-2xl"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <button onClick={() => setStep('intro')} className="text-white/40 hover:text-white flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4" /> Cancel
                            </button>
                            <div className="flex gap-1">
                                {CATEGORIES.map((_, i) => (
                                    <div key={i} className={`h-1 w-8 rounded-full transition-all ${i === currentCat ? 'bg-sacred-400' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-xs uppercase tracking-[0.3em] text-sacred-400 font-black mb-4">{CATEGORIES[currentCat].title}</h2>
                            <p className="text-3xl font-serif font-bold text-blue-100">Reflect on your actions...</p>
                        </div>

                        <div className="space-y-4 mb-20">
                            {CATEGORIES[currentCat].items.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => toggleSin(item)}
                                    className={`w-full text-left p-6 rounded-3xl border transition-all flex items-start gap-4 ${selectedSins.includes(item)
                                            ? 'bg-sacred-950/40 border-sacred-500/50 text-white'
                                            : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedSins.includes(item) ? 'bg-sacred-500 border-sacred-400' : 'border-white/10'
                                        }`}>
                                        {selectedSins.includes(item) && <ShieldCheck className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className="text-lg font-light leading-relaxed">{item}</span>
                                </button>
                            ))}
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent">
                            <div className="max-w-2xl mx-auto flex gap-4">
                                {currentCat > 0 && (
                                    <button
                                        onClick={() => setCurrentCat(prev => prev - 1)}
                                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/5"
                                    >
                                        Previous
                                    </button>
                                )}
                                {currentCat < CATEGORIES.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentCat(prev => prev + 1)}
                                        className="flex-[2] py-4 bg-sacred-600 hover:bg-sacred-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-sacred-900/20"
                                    >
                                        Next Category
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setStep('guide')}
                                        className="flex-[2] py-4 bg-gold-600 hover:bg-gold-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-gold-900/20"
                                    >
                                        Finish & View Guide
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'guide' && (
                    <motion.div
                        key="guide"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="container mx-auto px-4 py-32 max-w-2xl"
                    >
                        <div className="mb-12 flex items-center justify-between">
                            <h2 className="text-4xl font-serif font-bold text-sacred-300">Confession Guide</h2>
                            <button onClick={clearSins} className="p-3 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-12">
                            <section className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <Scroll className="w-6 h-6 text-sacred-400" />
                                    <h3 className="text-xl font-bold">Your Private Notes</h3>
                                </div>
                                <div className="space-y-4">
                                    {selectedSins.length === 0 ? (
                                        <p className="text-white/20 italic">No notes recorded.</p>
                                    ) : (
                                        selectedSins.map((sin, i) => (
                                            <div key={i} className="flex items-start gap-3 text-blue-100/70 py-2 border-b border-white/5 last:border-0">
                                                <div className="w-1.5 h-1.5 bg-sacred-500 rounded-full mt-2 shrink-0" />
                                                <p className="text-sm font-light italic leading-relaxed">{sin}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-6 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-relaxed">
                                        Note: These items are stored in your device's memory only. They will be destroyed when you clear them or close the tool.
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-8">
                                <div className="bg-sacred-950/20 border border-sacred-500/20 p-8 rounded-[2.5rem]">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-sacred-500 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                                        Arrival
                                    </h3>
                                    <p className="text-blue-100/60 leading-relaxed font-light">
                                        Enter the confessional or seated area. The priest will greet you. Make the Sign of the Cross and say:
                                        <br /><br />
                                        <span className="text-white bg-white/5 px-2 py-1 rounded italic">"Forgive me, Father, for I have sinned. It has been [time] since my last confession."</span>
                                    </p>
                                </div>

                                <div className="bg-sacred-950/20 border border-sacred-500/20 p-8 rounded-[2.5rem]">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-sacred-500 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
                                        The Confession
                                    </h3>
                                    <p className="text-blue-100/60 leading-relaxed font-light">
                                        Confess your sins simply and honestly. You can use your notes above as a guide. When finished, say:
                                        <br /><br />
                                        <span className="text-white bg-white/5 px-2 py-1 rounded italic">"I am sorry for these and all the sins of my past life."</span>
                                    </p>
                                </div>

                                <div className="bg-amber-950/20 border border-amber-500/20 p-8 rounded-[2.5rem]">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-[10px]">3</span>
                                        Act of Contrition
                                    </h3>
                                    <p className="text-blue-100/60 leading-relaxed font-light italic mb-4">
                                        The priest will give you penance and ask you to pray the Act of Contrition:
                                    </p>
                                    <p className="text-white text-lg font-serif leading-relaxed italic bg-white/5 p-6 rounded-2xl">
                                        "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love..."
                                    </p>
                                </div>
                            </section>

                            <button
                                onClick={() => setStep('intro')}
                                className="w-full py-6 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-[0.5em] rounded-[2.5rem] border border-white/5"
                            >
                                Close Guide
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
