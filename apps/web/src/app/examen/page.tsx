'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, Heart, Sun, Moon, Check, ArrowRight } from 'lucide-react';
import { saveExamenEntry } from '@/app/actions/spiritual';

const steps = [
    {
        id: 'gratitude',
        title: 'Give Thanks',
        subtitle: 'Recall the gifts of the day',
        icon: Sun,
        prompt: 'What am I most grateful for today? What moments brought me joy or peace?',
        placeholder: 'Today I am grateful for...'
    },
    {
        id: 'review',
        title: 'Review the Day',
        subtitle: 'Walk through your day with God',
        icon: BookOpen,
        prompt: 'Walk through your day hour by hour. Where did you feel God\'s presence? Where did you feel distant from Him?',
        placeholder: 'As I review my day, I notice...'
    },
    {
        id: 'sorrow',
        title: 'Express Sorrow',
        subtitle: 'Ask for forgiveness',
        icon: Heart,
        prompt: 'What moments today do you regret? Where did you fall short of being your best self?',
        placeholder: 'I am sorry for...'
    },
    {
        id: 'tomorrow',
        title: 'Look Forward',
        subtitle: 'Prepare for tomorrow',
        icon: Moon,
        prompt: 'What do you hope for tomorrow? What grace do you need? How do you want to grow?',
        placeholder: 'Tomorrow, I ask for the grace to...'
    }
];

export default function ExamenPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<string, string>>({
        gratitude: '',
        review: '',
        sorrow: '',
        tomorrow: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const step = steps[currentStep];
    const Icon = step.icon;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await saveExamenEntry({
                gratitude: responses.gratitude,
                review: responses.review,
                sorrow: responses.sorrow,
                tomorrow: responses.tomorrow
            });
            setIsComplete(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sacred-800 to-sacred-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-4">
                        Examen Complete
                    </h1>
                    <p className="text-blue-100 mb-8">
                        Well done! You've completed your Daily Examen. May God bless your night and grant you peaceful rest.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 bg-white text-sacred-800 font-semibold rounded-xl hover:bg-gold-50 transition-colors"
                        >
                            View Dashboard
                        </Link>
                        <Link
                            href="/"
                            className="px-6 py-3 text-white/70 hover:text-white transition-colors"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sacred-800 to-sacred-900">
            {/* Header */}
            <div className="container mx-auto px-4 pt-24 pb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Link>
            </div>

            {/* Progress */}
            <div className="container mx-auto px-4 mb-8">
                <div className="max-w-lg mx-auto">
                    <div className="flex gap-2">
                        {steps.map((s, i) => (
                            <div
                                key={s.id}
                                className={`flex-1 h-1.5 rounded-full transition-all ${i <= currentStep ? 'bg-gold-400' : 'bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-center text-white/60 text-sm mt-3">
                        Step {currentStep + 1} of {steps.length}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-8">
                <div className="max-w-lg mx-auto">
                    {/* Step Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gold-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Icon className="w-8 h-8 text-gold-400" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">
                            {step.title}
                        </h1>
                        <p className="text-blue-100/80">{step.subtitle}</p>
                    </div>

                    {/* Prompt */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 mb-6 border border-white/10">
                        <p className="text-white/90 text-lg leading-relaxed">
                            {step.prompt}
                        </p>
                    </div>

                    {/* Response */}
                    <textarea
                        value={responses[step.id]}
                        onChange={(e) => setResponses(prev => ({ ...prev, [step.id]: e.target.value }))}
                        placeholder={step.placeholder}
                        rows={6}
                        className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-gold-400 text-lg resize-none"
                    />

                    {/* Navigation */}
                    <div className="flex gap-4 mt-8">
                        {currentStep > 0 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Back
                            </button>
                        )}

                        {currentStep < steps.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="flex-1 py-4 bg-gold-500 text-white font-semibold rounded-xl hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
                            >
                                Continue
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    'Saving...'
                                ) : (
                                    <>
                                        Complete Examen
                                        <Check className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
