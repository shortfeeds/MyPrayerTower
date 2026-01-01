'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, RotateCcw, ArrowLeft, Info, BookOpen, List } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateLastConfessionDate } from '@/actions/user';
import guideData from '@/data/confession-guide.json';
import { MassOfferingCTA } from '@/components/giving/MassOfferingCTA';

type Commandment = typeof guideData.commandments[0];

export default function ConfessionPage() {
    const [openCommandment, setOpenCommandment] = useState<number | null>(null);
    const [checkedSins, setCheckedSins] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'list' | 'wizard'>('list');
    const [wizardStep, setWizardStep] = useState(0);
    const router = useRouter();

    const toggleCommandment = (id: number) => {
        setOpenCommandment(openCommandment === id ? null : id);
    };

    const toggleSin = (sin: string) => {
        const newChecked = new Set(checkedSins);
        if (newChecked.has(sin)) {
            newChecked.delete(sin);
        } else {
            newChecked.add(sin);
        }
        setCheckedSins(newChecked);
    };

    const resetConfession = () => {
        if (confirm('Are you sure you want to clear your examination?')) {
            setCheckedSins(new Set());
            setOpenCommandment(null);
            setWizardStep(0);
        }
    };

    const handleFinish = async () => {
        if (confirm('Finish and record today as your last confession date? (Sins are NOT saved)')) {
            await updateLastConfessionDate(new Date());
            router.push('/dashboard');
        }
    };

    // Wizard Navigation
    const currentCommandment = guideData.commandments[wizardStep];
    const isLastStep = wizardStep === guideData.commandments.length;

    return (
        <div className="min-h-screen bg-sand-50 font-serif pb-20">
            {/* Header */}
            <div className="bg-primary-900 text-white py-12 px-4 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Info size={120} />
                </div>
                <div className="container mx-auto max-w-2xl relative z-10">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Examination of Conscience</h1>
                    <p className="text-primary-100 text-lg leading-relaxed">
                        "The confession of evil works is the first beginning of good works."
                        <span className="block mt-2 text-sm opacity-75">— St. Augustine</span>
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-2xl px-4 -mt-8 relative z-20">
                {/* Controls Bar */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                                title="List View"
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('wizard')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'wizard' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                                title="Step-by-Step Mode"
                            >
                                <BookOpen className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sins</p>
                            <p className="text-xl font-bold text-primary-700">{checkedSins.size}</p>
                        </div>
                    </div>

                    <button
                        onClick={resetConfession}
                        className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                        title="Reset Examination"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>

                {/* VIEW: WIZARD MODE */}
                {viewMode === 'wizard' && (
                    <div className="space-y-6">
                        {!isLastStep ? (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-primary-50 p-6 border-b border-primary-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-primary-600 tracking-wider">COMMANDMENT {currentCommandment.id} OF 10</span>
                                        <span className="text-sm text-gray-500">{Math.round(((wizardStep + 1) / 10) * 100)}%</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{currentCommandment.text}</h2>
                                    <div className="w-full bg-gray-200 h-1.5 mt-4 rounded-full overflow-hidden">
                                        <div className="bg-primary-500 h-full transition-all duration-300" style={{ width: `${((wizardStep + 1) / 10) * 100}%` }} />
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {currentCommandment.questions.map((question, qIdx) => {
                                        const isChecked = checkedSins.has(question);
                                        return (
                                            <label
                                                key={qIdx}
                                                className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border ${isChecked ? 'bg-gold-50 border-gold-200 shadow-sm' : 'border-gray-100 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-gold-500 border-gold-500' : 'border-gray-300 bg-white'
                                                    }`}>
                                                    {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isChecked}
                                                    onChange={() => toggleSin(question)}
                                                />
                                                <span className={`text-lg text-gray-700 ${isChecked ? 'text-gray-900 font-medium' : ''}`}>
                                                    {question}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>

                                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                                    <button
                                        onClick={() => setWizardStep(Math.max(0, wizardStep - 1))}
                                        disabled={wizardStep === 0}
                                        className="px-6 py-2 text-gray-600 font-medium hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setWizardStep(wizardStep + 1)}
                                        className="px-8 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 shadow-md transition-transform active:scale-95"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Examination Complete</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    You have identified <strong>{checkedSins.size}</strong> areas for confession.
                                    Scroll down to see the Act of Contrition.
                                </p>
                                <button
                                    onClick={() => setWizardStep(0)}
                                    className="text-primary-600 font-medium hover:underline"
                                >
                                    Review Answers
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* VIEW: LIST MODE */}
                {viewMode === 'list' && (
                    <div className="space-y-4 animate-in fade-in">
                        {guideData.commandments.map((cmd) => (
                            <div key={cmd.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                                <button
                                    onClick={() => toggleCommandment(cmd.id)}
                                    className={`w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors ${openCommandment === cmd.id ? 'bg-gray-50' : ''
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold font-sans">
                                            {cmd.id}
                                        </span>
                                        <span className={`font-medium text-lg pt-0.5 ${openCommandment === cmd.id ? 'text-primary-800' : 'text-gray-700'}`}>
                                            {cmd.text}
                                        </span>
                                    </div>
                                    {openCommandment === cmd.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400 mt-1" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 mt-1" />
                                    )}
                                </button>

                                {openCommandment === cmd.id && (
                                    <div className="px-5 pb-6 pt-2 bg-gray-50/50 border-t border-gray-100">
                                        <div className="space-y-3">
                                            {cmd.questions.map((question, qIdx) => {
                                                const isChecked = checkedSins.has(question);
                                                return (
                                                    <label
                                                        key={qIdx}
                                                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-white shadow-sm ring-1 ring-gold-200' : 'hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-gold-500 border-gold-500' : 'border-gray-300 bg-white'
                                                            }`}>
                                                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={isChecked}
                                                            onChange={() => toggleSin(question)}
                                                        />
                                                        <span className={`text-gray-700 ${isChecked ? 'text-gray-900 font-medium' : ''}`}>
                                                            {question}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Act of Contrition (Always Visible at End) */}
                <div className="mt-12 bg-white rounded-xl shadow-sm p-8 border-t-4 border-primary-600 text-center">
                    <h3 className="text-xl font-bold font-display text-gray-900 mb-4">Act of Contrition</h3>
                    <p className="text-gray-600 italic leading-relaxed max-w-lg mx-auto mb-6">
                        "{guideData.actOfContrition.traditional}"
                    </p>

                    <button
                        onClick={handleFinish}
                        className="inline-block px-8 py-3 bg-primary-900 text-white font-bold rounded-lg hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Finish & Save Date
                    </button>
                    <p className="mt-4 text-xs text-gray-400">
                        Note: For privacy, your specific sins are never saved to the server. Only the date of your confession is recorded.
                    </p>
                </div>

                {/* Mass Offering CTA */}
                <div className="mt-8">
                    <MassOfferingCTA variant="inline" context="confession" />
                </div>
            </div>
        </div >
    );
}
