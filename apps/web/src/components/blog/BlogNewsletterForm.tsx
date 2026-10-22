'use client';

import React, { useState } from 'react';
import { Mail, Check, Loader2, Sparkles } from 'lucide-react';

export function BlogNewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'blog_sidebar' }),
            });

            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'You are subscribed in prayer.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to subscribe. Please try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="bg-white border-2 border-gold-500/10 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gold-600 mb-4">
                <Mail className="w-3.5 h-3.5" />
                Daily Grace
            </div>
            <h4 className="font-serif font-bold text-lg mb-3 text-gray-900">Spiritual Nourishment</h4>
            <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                Join 5,000+ faithful receiving daily liturgical reflections, feast day reminders, and prayer alerts.
            </p>

            {status === 'success' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center animate-fade-in">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-emerald-800">Welcome to Our Community</p>
                    <p className="text-[11px] text-emerald-600 mt-1">{message || 'May peace remain with you.'}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-sacred-950 text-white font-black text-[10px] py-3.5 rounded-xl hover:bg-gold-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    >
                        {status === 'loading' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Subscribe Free</span>
                            </>
                        )}
                    </button>
                    {status === 'error' && (
                        <p className="text-[11px] text-red-500 text-center mt-2">{message}</p>
                    )}
                </form>
            )}
        </div>
    );
}
