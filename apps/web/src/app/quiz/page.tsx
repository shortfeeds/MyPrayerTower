'use client';

import { useState, useEffect } from 'react';
import { Brain, CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw, Loader2 } from 'lucide-react';
import { getRandomQuestions, QuizQuestion } from '@/lib/telegram/content/quiz-content';

export default function QuizPage() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load random 10 questions on mount
        setQuestions(getRandomQuestions(10));
        setLoading(false);
    }, []);

    const question = questions[current];

    const handleSelect = (index: number) => {
        if (showResult) return;
        setSelected(index);
        setShowResult(true);
        if (index === question.correctIndex) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        if (current < questions.length - 1) {
            setCurrent(c => c + 1);
            setSelected(null);
            setShowResult(false);
        } else {
            setFinished(true);
        }
    };

    const restart = () => {
        setLoading(true);
        // Small timeout to allow UI to reset
        setTimeout(() => {
            setQuestions(getRandomQuestions(10));
            setCurrent(0);
            setSelected(null);
            setScore(0);
            setShowResult(false);
            setFinished(false);
            setLoading(false);
        }, 300);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (finished) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-violet-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
                    <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                    <p className="text-gray-600 mb-6">You scored</p>
                    <div className="text-6xl font-bold text-indigo-600 mb-2">{score}/{questions.length}</div>
                    <p className="text-gray-500 mb-8">{score >= 8 ? 'Excellent!' : score >= 6 ? 'Good job!' : 'Keep studying!'}</p>
                    <button onClick={restart} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto">
                        <RotateCcw className="w-5 h-5" />
                        Try Again
                    </button>
                    <p className="text-xs text-gray-400 mt-6">
                        We have 200+ questions. Try again for a new set!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-800 to-violet-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Brain className="w-4 h-4 text-indigo-300" />
                        <span>Test Your Knowledge</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Catholic Faith Quiz</h1>
                    <p className="text-xl text-indigo-100">Question {current + 1} of {questions.length}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-2xl">
                {/* Progress */}
                <div className="flex gap-1 mb-8">
                    {questions.map((_, i) => (
                        <div key={i} className={`h-2 flex-1 rounded-full ${i < current ? 'bg-indigo-600' : i === current ? 'bg-indigo-400' : 'bg-gray-200'}`} />
                    ))}
                </div>

                {/* Question */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{question.question}</h2>

                    <div className="space-y-3 mb-8">
                        {question.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelect(i)}
                                disabled={showResult}
                                className={`w-full p-4 rounded-xl text-left font-medium transition-all flex items-center justify-between ${showResult
                                    ? i === question.correctIndex
                                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                        : i === selected
                                            ? 'bg-red-100 text-red-800 border-2 border-red-500'
                                            : 'bg-gray-100 text-gray-500'
                                    : 'bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 border-2 border-transparent'
                                    }`}
                            >
                                <span>{opt}</span>
                                {showResult && i === question.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                {showResult && i === selected && i !== question.correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
                            </button>
                        ))}
                    </div>

                    {showResult && (
                        <>
                            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                                <p className="text-indigo-800">{question.explanation}</p>
                            </div>
                            <button onClick={nextQuestion} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                {current < questions.length - 1 ? 'Next Question' : 'See Results'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Score */}
                <div className="text-center mt-6 text-gray-500">
                    Current Score: <span className="font-bold text-indigo-600">{score}</span>
                </div>
            </div>
        </div>
    );
}
