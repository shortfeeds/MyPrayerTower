'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, X } from 'lucide-react';
import { SACRED_COPY } from '@/lib/sacred-copy';

interface Intention {
    id: string;
    text: string;
    date: string;
    isAnswered: boolean;
}

export function PrayerJournal() {
    const [intentions, setIntentions] = useState<Intention[]>([
        { id: '1', text: 'For patience in my current situation', date: '2 days ago', isAnswered: false },
        { id: '2', text: 'That my family finds peace', date: '1 week ago', isAnswered: true },
    ]);
    const [newIntention, setNewIntention] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const addIntention = () => {
        if (!newIntention.trim()) return;
        setIntentions([
            { id: Date.now().toString(), text: newIntention, date: 'Just now', isAnswered: false },
            ...intentions
        ]);
        setNewIntention('');
        setIsAdding(false);
    };

    const toggleAnswered = (id: string) => {
        setIntentions(intentions.map(i =>
            i.id === id ? { ...i, isAnswered: !i.isAnswered } : i
        ));
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Prayer Journal</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-4"
                    >
                        <textarea
                            value={newIntention}
                            onChange={(e) => setNewIntention(e.target.value)}
                            placeholder="Write your intention..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                            rows={2}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addIntention}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                            >
                                Add to Journal
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {intentions.map((intention) => (
                    <div
                        key={intention.id}
                        className={`p-4 rounded-2xl border transition-all ${intention.isAnswered
                                ? 'bg-green-50 border-green-100 opacity-75'
                                : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-sm'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <button
                                onClick={() => toggleAnswered(intention.id)}
                                className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${intention.isAnswered
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-slate-300 hover:border-indigo-400'
                                    }`}
                            >
                                {intention.isAnswered && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </button>
                            <div className="flex-1">
                                <p className={`text-sm ${intention.isAnswered ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                    {intention.text}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">{intention.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
