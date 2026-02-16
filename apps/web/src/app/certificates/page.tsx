"use client";

import { Lock, Award, Shield, Star, Medal, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const CERTIFICATES = [
    {
        id: 'early_adopter',
        title: 'Early Adopter',
        description: 'Joined MyPrayerTower during early access.',
        icon: Star,
        color: 'text-amber-500',
        borderColor: 'border-amber-500/20',
        bgGradient: 'from-amber-500/10 to-transparent',
        condition: 'Join MyPrayerTower',
    },
    {
        id: 'pro_prayer_warrior',
        title: 'Prayer Warrior',
        description: 'Completed 100 prayers using the app.',
        icon: Shield,
        color: 'text-blue-500',
        borderColor: 'border-blue-500/20',
        bgGradient: 'from-blue-500/10 to-transparent',
        condition: 'Complete 100 Prayers',
    },
    {
        id: 'novena_devotee',
        title: 'Novena Devotee',
        description: 'Successfully completed a full 9-day novena.',
        icon: Medal,
        color: 'text-purple-500',
        borderColor: 'border-purple-500/20',
        bgGradient: 'from-purple-500/10 to-transparent',
        condition: 'Complete a Novena',
    },
    {
        id: 'rosary_master',
        title: 'Rosary Master',
        description: 'Prayed the Rosary every day for a week.',
        icon: Award,
        color: 'text-rose-500',
        borderColor: 'border-rose-500/20',
        bgGradient: 'from-rose-500/10 to-transparent',
        condition: '7-Day Rosary Streak',
    },
];

export default function CertificatesPage() {
    const [unlockedIds, setUnlockedIds] = useState<string[]>(['early_adopter']);

    useEffect(() => {
        // In a real app, we'd fetch these from the backend or localStorage
        const saved = localStorage.getItem('mpt_certificates');
        if (saved) {
            setUnlockedIds(JSON.parse(saved));
        } else {
            // Initialize with early_adopter if not present
            localStorage.setItem('mpt_certificates', JSON.stringify(['early_adopter']));
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">My Certificates</h1>
                <p className="text-lg text-slate-600">
                    Track your spiritual milestones and achievements.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                {CERTIFICATES.map((cert) => {
                    const isUnlocked = unlockedIds.includes(cert.id);
                    const Icon = cert.icon;

                    return (
                        <div
                            key={cert.id}
                            className={`relative rounded-2xl border-2 p-6 flex flex-col items-center text-center transition-all duration-300 ${isUnlocked
                                    ? `bg-white ${cert.borderColor} shadow-lg scale-100`
                                    : 'bg-slate-100 border-dashed border-slate-300 opacity-70 grayscale'
                                }`}
                        >
                            {/* Background Glow for Unlocked */}
                            {isUnlocked && (
                                <div className={`absolute inset-0 bg-gradient-to-b ${cert.bgGradient} rounded-2xl pointer-events-none`} />
                            )}

                            <div className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? 'bg-white shadow-md' : 'bg-slate-200'
                                }`}>
                                {isUnlocked ? (
                                    <Icon size={40} className={cert.color} />
                                ) : (
                                    <Lock size={32} className="text-slate-400" />
                                )}

                                {isUnlocked && (
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white">
                                        <CheckCircle2 size={12} />
                                    </div>
                                )}
                            </div>

                            <h3 className={`text-lg font-bold mb-2 font-serif ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                                {cert.title}
                            </h3>

                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                {cert.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-100 w-full">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {isUnlocked ? 'Unlocked' : `Unlock: ${cert.condition}`}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
