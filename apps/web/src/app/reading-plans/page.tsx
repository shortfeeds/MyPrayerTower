"use client";

import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Circle, ChevronLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';

type ReadingPlan = {
    id: string;
    title: string;
    description: string;
    days: number;
    category: 'Bible' | 'Seasonal' | 'Topical';
    color: string;
};

const PLANS: ReadingPlan[] = [
    {
        id: 'bible_in_a_year',
        title: 'Bible in a Year',
        description: 'Read the entire Bible in 365 days. Old Testament, New Testament, and Psalms daily.',
        days: 365,
        category: 'Bible',
        color: 'bg-blue-600',
    },
    {
        id: 'nt_90_days',
        title: 'New Testament in 90 Days',
        description: 'Immerse yourself in the life of Jesus and the early church.',
        days: 90,
        category: 'Bible',
        color: 'bg-emerald-600',
    },
    {
        id: 'psalms_30_days',
        title: 'Psalms & Proverbs',
        description: 'Daily wisdom and worship for a month.',
        days: 30,
        category: 'Topical',
        color: 'bg-amber-600',
    },
    {
        id: 'lent_40_days',
        title: 'Lenten Journey',
        description: 'Prepare your heart for Easter with daily scripture.',
        days: 40,
        category: 'Seasonal',
        color: 'bg-purple-600',
    },
];

export default function ReadingPlansPage() {
    const [activePlanId, setActivePlanId] = useState<string | null>(null);
    const [progress, setProgress] = useState<Record<string, number[]>>({}); // planId -> [completedDayIndices]

    useEffect(() => {
        const saved = localStorage.getItem('mpt_reading_plans');
        if (saved) {
            setProgress(JSON.parse(saved));
        }
    }, []);

    const toggleDay = (planId: string, dayIndex: number) => {
        const currentProgress = progress[planId] || [];
        let updatedProgress;

        if (currentProgress.includes(dayIndex)) {
            updatedProgress = currentProgress.filter(d => d !== dayIndex);
        } else {
            updatedProgress = [...currentProgress, dayIndex];
        }

        const newProgress = { ...progress, [planId]: updatedProgress };
        setProgress(newProgress);
        localStorage.setItem('mpt_reading_plans', JSON.stringify(newProgress));
    };

    const activePlan = PLANS.find(p => p.id === activePlanId);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Main View: List of Plans */}
                {!activePlan && (
                    <>
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Reading Plans</h1>
                            <p className="text-slate-600">Grow in faith through structured daily reading.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {PLANS.map((plan) => {
                                const completedCount = progress[plan.id]?.length || 0;
                                const percentage = Math.round((completedCount / plan.days) * 100);

                                return (
                                    <button
                                        key={plan.id}
                                        onClick={() => setActivePlanId(plan.id)}
                                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all text-left border border-slate-100 group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${plan.color}`}>
                                                {plan.category}
                                            </span>
                                            {percentage > 0 && (
                                                <span className="text-sm font-semibold text-slate-500">
                                                    {percentage}% Complete
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {plan.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm mb-6 min-h-[40px]">
                                            {plan.description}
                                        </p>

                                        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                                            <div
                                                className={`h-full ${plan.color} transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-400 text-right">
                                            {completedCount} / {plan.days} Days
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Detail View: Active Plan Tracker */}
                {activePlan && (
                    <div className="animate-in slide-in-from-right-8 duration-300">
                        <button
                            onClick={() => setActivePlanId(null)}
                            className="flex items-center text-slate-500 hover:text-slate-900 mb-8 font-medium"
                        >
                            <ChevronLeft size={20} className="mr-1" /> Back to Plans
                        </button>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">{activePlan.title}</h1>
                                    <p className="text-slate-600 max-w-xl">{activePlan.description}</p>
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {Math.round(((progress[activePlan.id]?.length || 0) / activePlan.days) * 100)}%
                                    </div>
                                    <div className="text-slate-400 text-sm">Completed</div>
                                </div>
                            </div>

                            {/* Day Grid */}
                            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                                {Array.from({ length: activePlan.days }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const isCompleted = progress[activePlan.id]?.includes(dayNum);

                                    return (
                                        <button
                                            key={dayNum}
                                            onClick={() => toggleDay(activePlan.id, dayNum)}
                                            className={`aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all ${isCompleted
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-100'
                                                    : 'bg-white border-slate-100 hover:border-blue-300 text-slate-400 hover:text-blue-600 hover:scale-105'
                                                }`}
                                            title={`Day ${dayNum}`}
                                        >
                                            <span className="text-xs font-bold mb-1">Day</span>
                                            <span className="text-lg font-bold">{dayNum}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
