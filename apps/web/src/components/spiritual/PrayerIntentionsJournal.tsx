'use client';

import { useState, useEffect } from 'react';
import { Heart, Plus, Edit3, Trash2, Check, X, Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface Intention {
    id: string;
    content: string;
    category: 'personal' | 'family' | 'friends' | 'world' | 'thanksgiving' | 'other';
    createdAt: Date;
    isAnswered: boolean;
    answeredAt?: Date;
    testimonyNote?: string;
    prayerCount: number;
}

const CATEGORIES = [
    { id: 'personal', label: 'Personal', emoji: '🙏' },
    { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { id: 'friends', label: 'Friends', emoji: '👥' },
    { id: 'world', label: 'World', emoji: '🌍' },
    { id: 'thanksgiving', label: 'Thanksgiving', emoji: '🙌' },
    { id: 'other', label: 'Other', emoji: '💭' },
];

/**
 * Prayer intentions journal
 */
export function PrayerIntentionsJournal() {
    const [intentions, setIntentions] = useState<Intention[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newIntention, setNewIntention] = useState('');
    const [newCategory, setNewCategory] = useState<Intention['category']>('personal');
    const [filter, setFilter] = useState<'all' | 'active' | 'answered'>('active');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('mpt-intentions');
        if (stored) {
            const parsed = JSON.parse(stored);
            setIntentions(parsed.map((i: any) => ({
                ...i,
                createdAt: new Date(i.createdAt),
                answeredAt: i.answeredAt ? new Date(i.answeredAt) : undefined,
            })));
        }
    }, []);

    // Save to localStorage
    const saveIntentions = (updated: Intention[]) => {
        setIntentions(updated);
        localStorage.setItem('mpt-intentions', JSON.stringify(updated));
    };

    const addIntention = () => {
        if (!newIntention.trim()) return;

        const intention: Intention = {
            id: Date.now().toString(),
            content: newIntention.trim(),
            category: newCategory,
            createdAt: new Date(),
            isAnswered: false,
            prayerCount: 0,
        };

        saveIntentions([intention, ...intentions]);
        setNewIntention('');
        setNewCategory('personal');
        setShowForm(false);
    };

    const deleteIntention = (id: string) => {
        saveIntentions(intentions.filter(i => i.id !== id));
    };

    const markAnswered = (id: string, testimonyNote?: string) => {
        saveIntentions(intentions.map(i =>
            i.id === id
                ? { ...i, isAnswered: true, answeredAt: new Date(), testimonyNote }
                : i
        ));
    };

    const incrementPrayerCount = (id: string) => {
        saveIntentions(intentions.map(i =>
            i.id === id
                ? { ...i, prayerCount: i.prayerCount + 1 }
                : i
        ));
    };

    const filteredIntentions = intentions.filter(i => {
        if (filter === 'active') return !i.isAnswered;
        if (filter === 'answered') return i.isAnswered;
        return true;
    });

    const stats = {
        total: intentions.length,
        active: intentions.filter(i => !i.isAnswered).length,
        answered: intentions.filter(i => i.isAnswered).length,
        totalPrayers: intentions.reduce((sum, i) => sum + i.prayerCount, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prayer Journal</h2>
                    <p className="text-gray-500 dark:text-gray-400">Track your intentions and answered prayers</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-sacred-600 text-white rounded-lg font-medium hover:bg-sacred-700 transition-colors"
                >
                    <Plus size={18} />
                    Entrust Intention
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="bg-sacred-50 dark:bg-sacred-900/20 rounded-xl border border-sacred-100 dark:border-sacred-800 p-4 text-center">
                    <p className="text-2xl font-bold text-sacred-600 dark:text-sacred-400">{stats.active}</p>
                    <p className="text-sm text-gray-500">Active</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.answered}</p>
                    <p className="text-sm text-gray-500">Answered</p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800 p-4 text-center">
                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.totalPrayers}</p>
                    <p className="text-sm text-gray-500">Prayers</p>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">New Intention</h3>

                    <textarea
                        value={newIntention}
                        onChange={(e) => setNewIntention(e.target.value)}
                        placeholder="What is on your heart?"
                        className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-sacred-500 focus:border-sacred-500"
                        rows={3}
                    />

                    <div className="flex flex-wrap gap-2 mt-4">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setNewCategory(cat.id as Intention['category'])}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                                    ${newCategory === cat.id
                                        ? 'bg-sacred-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                {cat.emoji} {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={addIntention}
                            disabled={!newIntention.trim()}
                            className="px-4 py-2 bg-sacred-600 text-white rounded-lg font-medium hover:bg-sacred-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Intention
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(['active', 'answered', 'all'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`
                            px-4 py-2 rounded-lg font-medium transition-colors
                            ${filter === f
                                ? 'bg-sacred-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }
                        `}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Intentions List */}
            <div className="space-y-3">
                {filteredIntentions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Heart size={48} className="mx-auto mb-4 opacity-30" />
                        <p>Your prayer journal is waiting.</p>
                        {filter === 'active' && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 text-sacred-600 hover:text-sacred-700 font-medium"
                            >
                                Write your first intention
                            </button>
                        )}
                    </div>
                ) : (
                    filteredIntentions.map(intention => (
                        <IntentionCard
                            key={intention.id}
                            intention={intention}
                            expanded={expandedId === intention.id}
                            onToggleExpand={() => setExpandedId(expandedId === intention.id ? null : intention.id)}
                            onDelete={() => deleteIntention(intention.id)}
                            onMarkAnswered={(note) => markAnswered(intention.id, note)}
                            onPray={() => incrementPrayerCount(intention.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

/**
 * Individual intention card
 */
function IntentionCard({
    intention,
    expanded,
    onToggleExpand,
    onDelete,
    onMarkAnswered,
    onPray,
}: {
    intention: Intention;
    expanded: boolean;
    onToggleExpand: () => void;
    onDelete: () => void;
    onMarkAnswered: (note?: string) => void;
    onPray: () => void;
}) {
    const [showTestimony, setShowTestimony] = useState(false);
    const [testimonyNote, setTestimonyNote] = useState('');

    const category = CATEGORIES.find(c => c.id === intention.category);
    const daysAgo = Math.floor((Date.now() - intention.createdAt.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div
            className={`
                bg-white dark:bg-gray-900 rounded-xl border transition-all
                ${intention.isAnswered
                    ? 'border-emerald-200 dark:border-emerald-800'
                    : 'border-gray-100 dark:border-gray-800'
                }
            `}
        >
            <div className="p-4">
                <div className="flex items-start gap-4">
                    {/* Category emoji */}
                    <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-xl
                        ${intention.isAnswered
                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }
                    `}>
                        {intention.isAnswered ? '✅' : category?.emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <p className={`${intention.isAnswered ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                            {intention.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                            </span>
                            <span className="flex items-center gap-1">
                                <Heart size={12} />
                                {intention.prayerCount} prayers
                            </span>
                            <span className="flex items-center gap-1">
                                <Tag size={12} />
                                {category?.label}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {!intention.isAnswered && (
                            <>
                                <button
                                    onClick={onPray}
                                    className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                                    title="I prayed for this"
                                >
                                    <Heart size={18} />
                                </button>
                                <button
                                    onClick={() => setShowTestimony(true)}
                                    className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                                    title="Mark as answered"
                                >
                                    <Check size={18} />
                                </button>
                            </>
                        )}
                        <button
                            onClick={onToggleExpand}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                </div>

                {/* Expanded content */}
                {expanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        {intention.isAnswered && intention.testimonyNote && (
                            <div className="mb-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    <strong>Testimony:</strong> {intention.testimonyNote}
                                </p>
                                {intention.answeredAt && (
                                    <p className="text-xs text-emerald-600 mt-1">
                                        Answered on {intention.answeredAt.toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={onDelete}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    </div>
                )}

                {/* Testimony form */}
                {showTestimony && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                            How was this prayer answered?
                        </p>
                        <textarea
                            value={testimonyNote}
                            onChange={(e) => setTestimonyNote(e.target.value)}
                            placeholder="Share your testimony (optional)"
                            className="w-full p-3 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm bg-white dark:bg-gray-800"
                            rows={2}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setShowTestimony(false)}
                                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onMarkAnswered(testimonyNote || undefined);
                                    setShowTestimony(false);
                                }}
                                className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
                            >
                                Mark Answered
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Compact intentions widget for sidebar
 */
export function IntentionsWidget() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('mpt-intentions');
        if (stored) {
            const intentions = JSON.parse(stored);
            setCount(intentions.filter((i: any) => !i.isAnswered).length);
        }
    }, []);

    return (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Heart size={14} />
            <span>{count} active intentions</span>
        </div>
    );
}
