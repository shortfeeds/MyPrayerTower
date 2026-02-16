"use client";

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Plus, Trash2, ArrowRight } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';

type Novena = {
    id: string;
    title: string;
    description: string;
};

type ActiveNovena = {
    id: string;
    novenaId: string;
    title: string;
    startDate: string;
    completedDays: number[];
    isCompleted: boolean;
};

const NOVENAS: Novena[] = [
    { id: 'divine_mercy', title: 'Divine Mercy Novena', description: 'Revealed to St. Faustina for God\'s mercy.' },
    { id: 'st_jude', title: 'Novena to St. Jude', description: 'For desperate cases and lost causes.' },
    { id: 'sacred_heart', title: 'Sacred Heart Novena', description: 'Devotion to the heart of Jesus.' },
    { id: 'mary_undoer', title: 'Mary, Undoer of Knots', description: 'For solving complex problems in life.' },
    { id: 'st_joseph', title: 'Novena to St. Joseph', description: 'For work, family, and protection.' },
];

export default function NovenaTrackerPage() {
    const [activeNovenas, setActiveNovenas] = useState<ActiveNovena[]>([]);
    const [showSelector, setShowSelector] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('mpt_active_novenas');
        if (saved) {
            setActiveNovenas(JSON.parse(saved));
        }
    }, []);

    const saveNovenas = (updated: ActiveNovena[]) => {
        setActiveNovenas(updated);
        localStorage.setItem('mpt_active_novenas', JSON.stringify(updated));
    };

    const startNovena = (novena: Novena) => {
        const newNovena: ActiveNovena = {
            id: crypto.randomUUID(),
            novenaId: novena.id,
            title: novena.title,
            startDate: new Date().toISOString(),
            completedDays: [],
            isCompleted: false,
        };
        saveNovenas([newNovena, ...activeNovenas]);
        setShowSelector(false);
    };

    const toggleDay = (trackerId: string, day: number) => {
        const updated = activeNovenas.map(n => {
            if (n.id !== trackerId) return n;

            const isDayCompleted = n.completedDays.includes(day);
            let newCompletedDays = isDayCompleted
                ? n.completedDays.filter(d => d !== day)
                : [...n.completedDays, day];

            return {
                ...n,
                completedDays: newCompletedDays,
                isCompleted: newCompletedDays.length === 9
            };
        });
        saveNovenas(updated);
    };

    const deleteTracker = (trackerId: string) => {
        saveNovenas(activeNovenas.filter(n => n.id !== trackerId));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">Novena Tracker</h1>
                        <p className="text-slate-600">Track your 9-day prayer commitments.</p>
                    </div>
                    <button
                        onClick={() => setShowSelector(!showSelector)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={20} /> New Novena
                    </button>
                </div>

                {/* Novena Selector */}
                {showSelector && (
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100 mb-8 animate-in slide-in-from-top-4">
                        <h2 className="text-xl font-bold mb-4">Select a Novena</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {NOVENAS.map(novena => (
                                <button
                                    key={novena.id}
                                    onClick={() => startNovena(novena)}
                                    className="text-left p-4 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                                >
                                    <div className="font-bold text-slate-900 group-hover:text-blue-600">{novena.title}</div>
                                    <div className="text-sm text-slate-500">{novena.description}</div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowSelector(false)}
                            className="mt-6 text-sm text-slate-500 hover:text-slate-900"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Active Novenas */}
                <div className="space-y-6">
                    {activeNovenas.length === 0 && !showSelector ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 mb-4">You don't have any active novenas.</p>
                            <button
                                onClick={() => setShowSelector(true)}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Start your first novena
                            </button>
                        </div>
                    ) : (
                        activeNovenas.map(tracker => {
                            const startDate = new Date(tracker.startDate);
                            const progress = Math.round((tracker.completedDays.length / 9) * 100);

                            return (
                                <div key={tracker.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-1">{tracker.title}</h3>
                                            <p className="text-sm text-slate-500">
                                                Started on {format(startDate, 'MMMM d, yyyy')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">{progress}%</div>
                                                <div className="text-xs text-slate-400">Complete</div>
                                            </div>
                                            <button
                                                onClick={() => deleteTracker(tracker.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                title="Delete Tracker"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Days Linear Grid */}
                                    <div className="grid grid-cols-9 gap-2">
                                        {Array.from({ length: 9 }).map((_, i) => {
                                            const dayNum = i + 1;
                                            const isCompleted = tracker.completedDays.includes(dayNum);
                                            const targetDate = addDays(startDate, i);
                                            const isToday = isSameDay(targetDate, new Date());

                                            return (
                                                <button
                                                    key={dayNum}
                                                    onClick={() => toggleDay(tracker.id, dayNum)}
                                                    className={`relative aspect-[3/4] rounded-lg flex flex-col items-center justify-center border transition-all ${isCompleted
                                                            ? 'bg-blue-600 border-blue-600 text-white'
                                                            : isToday
                                                                ? 'bg-white border-blue-400 ring-2 ring-blue-100 text-blue-600'
                                                                : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200'
                                                        }`}
                                                    title={format(targetDate, 'MMM d')}
                                                >
                                                    <span className="text-[10px] font-bold uppercase mb-1">Day</span>
                                                    <span className="text-lg font-bold">{dayNum}</span>
                                                    {isCompleted && (
                                                        <div className="absolute inset-0 bg-white/10 rounded-lg animate-pulse" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {tracker.isCompleted && (
                                        <div className="mt-6 py-3 px-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in">
                                            <CheckCircle2 size={18} />
                                            Novena Completed!
                                        </div>
                                    )}

                                    <div className="mt-6 flex justify-end">
                                        <a href={`/novenas`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                            View Prayers <ArrowRight size={14} className="ml-1" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
