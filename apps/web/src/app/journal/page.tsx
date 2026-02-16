"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Book, Smile, Frown, Meh, Sun, Cloud, CloudRain } from 'lucide-react';
import { format } from 'date-fns';

type JournalEntry = {
    id: string;
    date: string; // ISO string
    content: string;
    type: 'Petition' | 'Thanksgiving' | 'Reflection' | 'Confession';
    mood: 'Happy' | 'Neutral' | 'Sad' | 'Blessed' | 'Struggling';
};

const MOODS = [
    { label: 'Happy', icon: Smile, color: 'text-green-500' },
    { label: 'Neutral', icon: Meh, color: 'text-yellow-500' },
    { label: 'Sad', icon: Frown, color: 'text-blue-500' },
    { label: 'Blessed', icon: Sun, color: 'text-amber-500' },
    { label: 'Struggling', icon: CloudRain, color: 'text-slate-500' },
];

const TYPES = ['Petition', 'Thanksgiving', 'Reflection', 'Confession'];

export default function JournalPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
        type: 'Reflection',
        mood: 'Neutral',
    });

    useEffect(() => {
        const saved = localStorage.getItem('mpt_journal_entries');
        if (saved) {
            setEntries(JSON.parse(saved).sort((a: JournalEntry, b: JournalEntry) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
        }
    }, []);

    const saveEntry = () => {
        if (!newEntry.content) return;

        const entry: JournalEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            content: newEntry.content,
            type: newEntry.type as any,
            mood: newEntry.mood as any,
        };

        const updated = [entry, ...entries];
        setEntries(updated);
        localStorage.setItem('mpt_journal_entries', JSON.stringify(updated));
        setNewEntry({ type: 'Reflection', mood: 'Neutral', content: '' });
        setIsAdding(false);
    };

    const deleteEntry = (id: string) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        localStorage.setItem('mpt_journal_entries', JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">Prayer Journal</h1>
                        <p className="text-slate-600">Record your spiritual journey.</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        {isAdding ? 'Cancel' : 'New Entry'}
                    </button>
                </div>

                {/* Add Entry Form */}
                {isAdding && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-blue-100 animate-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-bold mb-4">New Entry</h2>

                        <div className="flex flex-wrap gap-4 mb-4">
                            {/* Type Selection */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setNewEntry({ ...newEntry, type: type as any })}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${newEntry.type === type
                                                ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Mood Selection */}
                            <div className="flex gap-3 items-center">
                                {MOODS.map(mood => {
                                    const Icon = mood.icon;
                                    return (
                                        <button
                                            key={mood.label}
                                            onClick={() => setNewEntry({ ...newEntry, mood: mood.label as any })}
                                            className={`p-2 rounded-full transition-transform hover:scale-110 ${newEntry.mood === mood.label ? 'bg-slate-100 ring-2 ring-slate-300' : ''
                                                }`}
                                            title={mood.label}
                                        >
                                            <Icon size={24} className={mood.color} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <textarea
                            value={newEntry.content || ''}
                            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                            placeholder="Write your prayer or reflection here..."
                            className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEntry}
                                disabled={!newEntry.content}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Entry
                            </button>
                        </div>
                    </div>
                )}

                {/* Entries List */}
                <div className="space-y-6">
                    {entries.length === 0 && !isAdding ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                            <Book className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No journal entries yet. Start writing today!</p>
                        </div>
                    ) : (
                        entries.map((entry) => {
                            const mood = MOODS.find(m => m.label === entry.mood);
                            const MoodIcon = mood?.icon || Smile;

                            return (
                                <div key={entry.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full bg-slate-50 ${mood?.color}`}>
                                                <MoodIcon size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{entry.type}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-sm text-slate-500 flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {format(new Date(entry.date), 'MMM d, yyyy h:mm a')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteEntry(entry.id)}
                                            className="text-slate-400 hover:text-red-500 p-2"
                                            title="Delete Entry"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {entry.content}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
