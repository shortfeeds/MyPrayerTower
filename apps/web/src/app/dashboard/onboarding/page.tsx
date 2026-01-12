'use client';

import { useState } from 'react';
import { Check, ChevronRight, Upload, Building2, MapPin, Loader2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 'welcome' | 'verification' | 'essentials' | 'team';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('welcome');
    const [loading, setLoading] = useState(false);
    const [churchName, setChurchName] = useState('St. Mary\'s Parish'); // Mocked from context/query

    const handleNext = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (step === 'welcome') setStep('verification');
            else if (step === 'verification') setStep('essentials');
            else if (step === 'essentials') setStep('team');
            else if (step === 'team') router.push('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Sidebar / Progress */}
                <div className="bg-slate-900 text-white p-8 md:w-64 flex-shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/pattern.svg')] bg-repeat" />

                    <div className="relative z-10">
                        <div className="mb-8">
                            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center mb-4">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="font-bold text-lg">Setup Guide</h2>
                            <p className="text-slate-400 text-xs mt-1">For {churchName}</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { id: 'welcome', label: 'Welcome' },
                                { id: 'verification', label: 'Verification' },
                                { id: 'essentials', label: 'Essentials' },
                                { id: 'team', label: 'Team Invite' }
                            ].map((s, i) => {
                                const isActive = step === s.id;
                                const isCompleted = ['welcome', 'verification', 'essentials', 'team'].indexOf(step) > i;

                                return (
                                    <div key={s.id} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2
                                            ${isActive ? 'bg-gold-500 border-gold-500 text-white' :
                                                isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                    'border-slate-700 text-slate-500'}`}>
                                            {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                                        </div>
                                        <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 md:p-12 relative">
                    {step === 'welcome' && (
                        <div className="animate-fade-in space-y-6">
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to MyPrayerTower! 👋</h1>
                                <p className="text-gray-600">
                                    We're honored to help <strong>{churchName}</strong> grow digitally. Let's get your portal set up in just a few minutes.
                                </p>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">
                                <div className="p-2 bg-blue-100 rounded-lg h-fit">
                                    <Check className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm">What you'll need:</h4>
                                    <ul className="text-sm text-blue-700 mt-1 space-y-1 list-disc list-inside">
                                        <li>Letter of authorization (for verified status)</li>
                                        <li>Current mass schedule</li>
                                        <li>Parish contact details</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'verification' && (
                        <div className="animate-fade-in space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Authority 🛡️</h1>
                                <p className="text-gray-600 text-sm">
                                    To protect the integrity of our directory, we require proof that you are authorized to manage this parish.
                                </p>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
                                </div>
                                <h3 className="font-bold text-gray-900">Upload Letter Head or Bulletin</h3>
                                <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
                                    Please upload a recent parish bulletin or a letter on official letterhead naming you as administrator.
                                </p>
                                <button className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                                    Select File
                                </button>
                            </div>
                            <p className="text-xs text-center text-gray-400">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                        </div>
                    )}

                    {step === 'essentials' && (
                        <div className="animate-fade-in space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirm Essentials 📍</h1>
                                <p className="text-gray-600 text-sm">
                                    Review the core details we have on file.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Church Name</label>
                                    <input type="text" value={churchName} onChange={(e) => setChurchName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-gold-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                        <input type="text" defaultValue="123 Faith Street, Cityname, ST 12345" className="w-full pl-10 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-gold-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Website (Optional)</label>
                                    <input type="url" placeholder="https://..." className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-gold-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'team' && (
                        <div className="animate-fade-in space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite Your Team 🤝</h1>
                                <p className="text-gray-600 text-sm">
                                    Parish management is a team effort. Invite others to help.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex gap-2">
                                    <input type="email" placeholder="email@example.com" className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gold-500 text-sm" />
                                    <select className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none">
                                        <option>Editor</option>
                                        <option>Admin</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <input type="email" placeholder="email@example.com" className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gold-500 text-sm" />
                                    <select className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none">
                                        <option>Editor</option>
                                        <option>Admin</option>
                                    </select>
                                </div>
                                <button className="text-sm text-gold-600 font-medium hover:underline flex items-center gap-1">
                                    <PlusIcon className="w-4 h-4" /> Add another
                                </button>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-amber-50 text-amber-800 rounded-lg text-xs">
                                <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p>Editors can post announcements and update times. Only Admins can edit church details and manage billing.</p>
                            </div>
                        </div>
                    )}

                    {/* Footer / Navigation */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                        {step !== 'welcome' && (
                            <button onClick={() => setStep(step === 'verification' ? 'welcome' : step === 'essentials' ? 'verification' : 'essentials')} className="text-sm text-gray-500 hover:text-gray-700">
                                Back
                            </button>
                        )}
                        <div className="ml-auto">
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {step === 'team' ? 'Complete Setup' : 'Continue'}
                                {!loading && step !== 'team' && <ChevronRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
    )
}
