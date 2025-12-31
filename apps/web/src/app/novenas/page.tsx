'use client';

import { useState } from 'react';
import { Sparkles, Calendar, ChevronRight, BookOpen, Heart, Clock } from 'lucide-react';
import Link from 'next/link';

interface Novena {
    id: string;
    name: string;
    patron: string;
    duration: string;
    description: string;
    color: string;
}

const NOVENAS: Novena[] = [
    { id: 'divine-mercy', name: 'Divine Mercy Novena', patron: 'Divine Mercy', duration: 'Good Friday - Divine Mercy Sunday', description: 'Prayed from Good Friday to the Saturday before Divine Mercy Sunday, as requested by Jesus to St. Faustina.', color: 'from-red-500 to-rose-600' },
    { id: 'sacred-heart', name: 'Sacred Heart Novena', patron: 'Sacred Heart of Jesus', duration: '9 days before Sacred Heart Feast', description: 'Devotion to the Sacred Heart of Jesus, a symbol of His divine love for humanity.', color: 'from-red-600 to-orange-500' },
    { id: 'immaculate-heart', name: 'Immaculate Heart Novena', patron: 'Immaculate Heart of Mary', duration: '9 days before the Feast', description: 'Honoring Mary\'s pure and holy heart, full of love for God and for us.', color: 'from-blue-500 to-cyan-500' },
    { id: 'st-jude', name: 'St. Jude Novena', patron: 'St. Jude Thaddeus', duration: 'Any 9 consecutive days', description: 'For desperate cases and hopeless situations. St. Jude is the patron of difficult causes.', color: 'from-green-600 to-emerald-500' },
    { id: 'miraculous-medal', name: 'Miraculous Medal Novena', patron: 'Our Lady of the Miraculous Medal', duration: 'Any 9 consecutive days', description: 'Based on the apparitions to St. Catherine Labouré in 1830.', color: 'from-blue-600 to-indigo-500' },
    { id: 'infant-of-prague', name: 'Infant of Prague Novena', patron: 'Infant Jesus of Prague', duration: 'Any 9 consecutive days', description: 'Devotion to the Holy Child Jesus for material and spiritual needs.', color: 'from-amber-500 to-yellow-500' },
    { id: 'st-therese', name: 'St. Thérèse Novena', patron: 'St. Thérèse of Lisieux', duration: 'Sept 22 - Oct 1', description: 'The "Little Flower" who promised to "spend her heaven doing good on earth."', color: 'from-pink-500 to-rose-400' },
    { id: 'st-joseph', name: 'St. Joseph Novena', patron: 'St. Joseph', duration: 'March 10-18', description: 'To the foster father of Jesus, patron of workers, families, and the dying.', color: 'from-stone-600 to-stone-500' },
    { id: 'holy-spirit', name: 'Holy Spirit Novena', patron: 'Holy Spirit', duration: 'Ascension to Pentecost', description: 'The original novena, prayed by the Apostles with Mary awaiting the Holy Spirit.', color: 'from-red-500 to-amber-500' },
    { id: 'our-lady-perpetual-help', name: 'Our Lady of Perpetual Help', patron: 'Our Lady of Perpetual Help', duration: 'Any 9 consecutive days', description: 'An ancient devotion to Mary under this beautiful Byzantine icon.', color: 'from-purple-600 to-violet-500' },
];

export default function NovenasPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-rose-600 via-pink-700 to-purple-800 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Sparkles className="w-4 h-4 text-pink-300" />
                        <span>Nine Days of Prayer</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Novena Library</h1>
                    <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                        Intensive nine-day prayer devotions for special intentions and feast day preparation.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {NOVENAS.map(novena => (
                        <div key={novena.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                            <div className={`bg-gradient-to-r ${novena.color} p-4 text-white`}>
                                <h3 className="font-bold text-lg">{novena.name}</h3>
                                <p className="text-sm opacity-90">{novena.patron}</p>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <Calendar className="w-4 h-4" />
                                    <span>{novena.duration}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{novena.description}</p>
                                <a
                                    href={`https://www.ewtn.com/catholicism/devotions/novenas`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-pink-600 text-sm font-medium group-hover:underline"
                                >
                                    Pray This Novena
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div className="mt-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 md:p-12 text-center">
                    <Clock className="w-12 h-12 text-pink-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">What is a Novena?</h3>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        A novena is a traditional Catholic devotion consisting of prayers prayed for nine consecutive days.
                        The practice originates from the nine days the Apostles and Mary spent in prayer between
                        the Ascension and Pentecost.
                    </p>
                </div>
            </div>
        </div>
    );
}
