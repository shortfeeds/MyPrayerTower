'use client';

import { useState } from 'react';
import { Heart, Sparkles, Send, ShieldCheck, BookOpen, CheckCircle, Cross } from 'lucide-react';
import Link from 'next/link';

interface SubmittedTestimony {
    id: string;
    title: string;
    content: string;
    userName: string;
    category: string;
    submittedAt: string;
}

export default function TestimoniesPage() {
    const [testimonies, setTestimonies] = useState<SubmittedTestimony[]>([]);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    // Form fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [name, setName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [category, setCategory] = useState('Answered Prayer');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        const newEntry: SubmittedTestimony = {
            id: Date.now().toString(),
            title: title.trim(),
            content: content.trim(),
            userName: isAnonymous ? 'Anonymous' : (name.trim() || 'Faithful Member'),
            category,
            submittedAt: 'Just now (Pending Review)'
        };

        setTestimonies(prev => [newEntry, ...prev]);
        setSubmittedSuccess(true);
        setTitle('');
        setContent('');
        setName('');
        setIsAnonymous(false);

        setTimeout(() => {
            setShowSubmitModal(false);
            setSubmittedSuccess(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-sacred-900 via-sacred-800 to-slate-900 text-white py-16 px-4 overflow-hidden border-b border-gold-500/20">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gold-400 via-transparent to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-gold-300 uppercase tracking-widest mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Sacred Witness &amp; Thanksgiving
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
                        Stories of <span className="text-gold-300 italic">Grace</span> &amp; Faith
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-8">
                        "Come and hear, all you who fear God; let me tell you what he has done for me."
                        <span className="block text-xs text-gold-300/80 mt-1 uppercase tracking-wider font-medium">— Psalm 66:16</span>
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-sacred-950 font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
                        >
                            <Send className="w-4 h-4" />
                            Share Your Testimony
                        </button>
                        <Link
                            href="/prayer-wall"
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded-full transition-all border border-white/15 text-sm"
                        >
                            <BookOpen className="w-4 h-4" />
                            Visit Prayer Wall
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-4xl px-4 py-12">
                {/* Moderation & Pastoral Guidance Banner */}
                <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 rounded-2xl p-6 mb-10 flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide mb-1">
                            Pastoral Moderation &amp; Reverence
                        </h2>
                        <p className="text-xs md:text-sm text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                            To preserve sacred dignity, prevent sensationalism, and respect individual medical privacy, all community testimonies undergo pastoral review. We never publish unverified medical claims or full personal identities without consent.
                        </p>
                    </div>
                </div>

                {/* Newly submitted testimonies (current session) */}
                {testimonies.length > 0 && (
                    <div className="mb-12">
                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span>Your Submissions</span>
                        </h2>
                        <div className="space-y-4">
                            {testimonies.map(t => (
                                <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gold-300 dark:border-gold-800/50 shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-50 dark:bg-gold-950/40 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-800/40">
                                            {t.category}
                                        </span>
                                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{t.submittedAt}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t.title}</h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed mb-4">{t.content}</p>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Submitted by: <strong className="text-gray-700 dark:text-gray-300">{t.userName}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Biblical & Catholic Foundations of Testimony */}
                <div className="mb-12">
                    <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Sacred Scripture on Thanksgiving
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                            <p className="font-serif italic text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-4">
                                "Give thanks to the Lord, for he is good; his love endures forever. Let the redeemed of the Lord tell their story."
                            </p>
                            <span className="text-xs font-bold text-sacred-600 dark:text-sacred-400 uppercase tracking-wider">
                                Psalm 107:1–2
                            </span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                            <p className="font-serif italic text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-4">
                                "Rejoice always, pray continually, give thanks in all circumstances; for this is God’s will for you in Christ Jesus."
                            </p>
                            <span className="text-xs font-bold text-sacred-600 dark:text-sacred-400 uppercase tracking-wider">
                                1 Thessalonians 5:16–18
                            </span>
                        </div>
                    </div>
                </div>

                {/* Community Invitation Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-white/10 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-sacred-50 dark:bg-sacred-950/40 text-sacred-600 dark:text-sacred-400 flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Has Prayer Touched Your Life?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed mb-6 font-light">
                        Whether through a novena, a quiet moment in adoration, or community intercession on our Prayer Wall, every experience of God's peace strengthens the Body of Christ.
                    </p>
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-sacred-600 hover:bg-sacred-700 text-white font-semibold rounded-full transition-all text-sm shadow-md"
                    >
                        <Send className="w-4 h-4" />
                        Share Your Story of Faith
                    </button>
                </div>
            </div>

            {/* Submission Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-gray-200 dark:border-white/10 shadow-2xl relative">
                        {submittedSuccess ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Testimony Received
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Thank you for bearing witness to God's love. Your story has been received and will be reviewed in accord with our pastoral moderation guidelines.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                        Share Your Testimony
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitModal(false)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                                    Share how God has answered prayer or brought peace in your journey of faith.
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                            Category
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sacred-500"
                                        >
                                            <option value="Answered Prayer">Answered Prayer</option>
                                            <option value="Spiritual Consolation">Spiritual Consolation &amp; Peace</option>
                                            <option value="Return to the Faith">Return to the Church / Faith</option>
                                            <option value="Novena Thanksgiving">Novena Thanksgiving</option>
                                            <option value="General Gratitude">General Gratitude</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Peace during a time of trial"
                                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sacred-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                            Your Story *
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Write your reflection or story of answered prayer..."
                                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sacred-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                            Your Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            disabled={isAnonymous}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="First name or initials"
                                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sacred-500 disabled:opacity-50"
                                        />
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                            className="rounded text-sacred-600 focus:ring-sacred-500"
                                        />
                                        <span>Submit anonymously (identity will not be shown)</span>
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-sacred-600 hover:bg-sacred-700 text-white font-semibold text-sm shadow-md"
                                    >
                                        Submit for Review
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
