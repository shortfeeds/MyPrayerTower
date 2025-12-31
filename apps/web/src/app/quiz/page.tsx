'use client';

import { useState } from 'react';
import { Brain, CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw } from 'lucide-react';

interface Question {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

const QUESTIONS: Question[] = [
    { question: 'How many sacraments are there in the Catholic Church?', options: ['5', '6', '7', '8'], correct: 2, explanation: 'The seven sacraments are: Baptism, Confirmation, Eucharist, Reconciliation, Anointing of the Sick, Holy Orders, and Matrimony.' },
    { question: 'Which Gospel was written first?', options: ['Matthew', 'Mark', 'Luke', 'John'], correct: 1, explanation: 'Most scholars believe Mark was written first, around 65-70 AD.' },
    { question: 'What is the term for the bread and wine becoming Christ\'s Body and Blood?', options: ['Consecration', 'Transubstantiation', 'Transfiguration', 'Transformation'], correct: 1, explanation: 'Transubstantiation means the substance changes while the appearances remain.' },
    { question: 'Who was the first Pope?', options: ['St. Paul', 'St. Peter', 'St. John', 'St. James'], correct: 1, explanation: 'Jesus gave Peter the keys to the Kingdom (Matthew 16:18-19).' },
    { question: 'What is the liturgical color for Advent?', options: ['Red', 'Green', 'White', 'Purple'], correct: 3, explanation: 'Purple (or violet) signifies penance and preparation.' },
    { question: 'How many mysteries are in the Rosary?', options: ['15', '18', '20', '25'], correct: 2, explanation: '5 Joyful + 5 Sorrowful + 5 Glorious + 5 Luminous = 20 mysteries.' },
    { question: 'What feast does the Church celebrate on December 8?', options: ['Christmas', 'Immaculate Conception', 'Assumption', 'Annunciation'], correct: 1, explanation: 'The Immaculate Conception celebrates Mary being conceived without original sin.' },
    { question: 'What is the longest season of the liturgical year?', options: ['Advent', 'Lent', 'Easter', 'Ordinary Time'], correct: 3, explanation: 'Ordinary Time spans about 33-34 weeks throughout the year.' },
    { question: 'Which council defined papal infallibility?', options: ['Trent', 'Vatican I', 'Vatican II', 'Nicaea'], correct: 1, explanation: 'Vatican I (1870) defined papal infallibility in Pastor Aeternus.' },
    { question: 'How many books are in the Catholic Bible?', options: ['66', '72', '73', '76'], correct: 2, explanation: 'The Catholic Bible has 46 OT books + 27 NT books = 73 total.' },
];

export default function QuizPage() {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [finished, setFinished] = useState(false);

    const question = QUESTIONS[current];

    const handleSelect = (index: number) => {
        if (showResult) return;
        setSelected(index);
        setShowResult(true);
        if (index === question.correct) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        if (current < QUESTIONS.length - 1) {
            setCurrent(c => c + 1);
            setSelected(null);
            setShowResult(false);
        } else {
            setFinished(true);
        }
    };

    const restart = () => {
        setCurrent(0);
        setSelected(null);
        setScore(0);
        setShowResult(false);
        setFinished(false);
    };

    if (finished) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-violet-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
                    <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                    <p className="text-gray-600 mb-6">You scored</p>
                    <div className="text-6xl font-bold text-indigo-600 mb-2">{score}/{QUESTIONS.length}</div>
                    <p className="text-gray-500 mb-8">{score >= 8 ? 'Excellent!' : score >= 6 ? 'Good job!' : 'Keep studying!'}</p>
                    <button onClick={restart} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto">
                        <RotateCcw className="w-5 h-5" />
                        Try Again
                    </button>
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
                    <p className="text-xl text-indigo-100">Question {current + 1} of {QUESTIONS.length}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-2xl">
                {/* Progress */}
                <div className="flex gap-1 mb-8">
                    {QUESTIONS.map((_, i) => (
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
                                        ? i === question.correct
                                            ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                            : i === selected
                                                ? 'bg-red-100 text-red-800 border-2 border-red-500'
                                                : 'bg-gray-100 text-gray-500'
                                        : 'bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 border-2 border-transparent'
                                    }`}
                            >
                                <span>{opt}</span>
                                {showResult && i === question.correct && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                {showResult && i === selected && i !== question.correct && <XCircle className="w-5 h-5 text-red-600" />}
                            </button>
                        ))}
                    </div>

                    {showResult && (
                        <>
                            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                                <p className="text-indigo-800">{question.explanation}</p>
                            </div>
                            <button onClick={nextQuestion} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                {current < QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
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
