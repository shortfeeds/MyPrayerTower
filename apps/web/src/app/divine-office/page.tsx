"use client";

import { useState } from 'react';
import { Sun, Moon, Sunrise, Sunset, BookOpen, Clock } from 'lucide-react';
import { format } from 'date-fns';

const HOURS = [
    { id: 'invitatory', name: 'Invitatory', time: 'Start of day', icon: BookOpen },
    { id: 'office_of_readings', name: 'Office of Readings', time: 'Anytime', icon: BookOpen },
    { id: 'lauds', name: 'Morning Prayer', time: '6:00 AM', icon: Sunrise },
    { id: 'terce', name: 'Midmorning Prayer', time: '9:00 AM', icon: Sun },
    { id: 'sext', name: 'Midday Prayer', time: '12:00 PM', icon: Sun },
    { id: 'none', name: 'Midafternoon Prayer', time: '3:00 PM', icon: Sun },
    { id: 'vespers', name: 'Evening Prayer', time: '6:00 PM', icon: Sunset },
    { id: 'compline', name: 'Night Prayer', time: '9:00 PM', icon: Moon },
];

export default function DivineOfficePage() {
    const [activeHour, setActiveHour] = useState('lauds');

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Liturgy of the Hours</h1>
                    <p className="text-slate-600 mb-4">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-slate-100 rounded-full text-slate-500 text-sm">
                        <Clock size={14} />
                        <span>Praying with the Universal Church</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        {HOURS.map((hour) => {
                            const Icon = hour.icon;
                            const isActive = activeHour === hour.id;
                            return (
                                <button
                                    key={hour.id}
                                    onClick={() => setActiveHour(hour.id)}
                                    className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${isActive
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                                    <div>
                                        <div className="font-semibold">{hour.name}</div>
                                        <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>{hour.time}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 min-h-[600px]">

                            <div className="text-center mb-12 border-b border-slate-100 pb-8">
                                <div className="uppercase tracking-widest text-xs font-bold text-slate-400 mb-2">
                                    {HOURS.find(h => h.id === activeHour)?.time}
                                </div>
                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
                                    {HOURS.find(h => h.id === activeHour)?.name}
                                </h2>
                                <div className="text-red-600 font-serif italic">
                                    God, come to my assistance. Lord, make haste to help me.
                                </div>
                            </div>

                            {/* Placeholder Content - In a real app this would come from an API */}
                            <div className="prose prose-slate max-w-none prose-p:font-serif prose-headings:font-sans mx-auto">
                                <h3 className="text-center text-slate-400 text-sm uppercase tracking-widest mb-6">Hymn</h3>
                                <div className="text-center italic text-slate-600 mb-12 whitespace-pre-line">
                                    Now that the daylight fills the sky,<br />
                                    We lift our hearts to God on high,<br />
                                    That He, in all we do or say,<br />
                                    Would keep us free from harm today.
                                </div>

                                <h3 className="text-center text-slate-400 text-sm uppercase tracking-widest mb-6">Psalmody</h3>

                                <div className="mb-8">
                                    <h4 className="text-red-600 font-bold mb-2">Antiphon 1</h4>
                                    <p className="italic mb-4">The Lord is my shepherd; there is nothing I shall want.</p>

                                    <h4 className="text-slate-900 font-bold mb-2">Psalm 23</h4>
                                    <p>
                                        The Lord is my shepherd;<br />
                                        there is nothing I shall want.<br />
                                        Fresh and green are the pastures<br />
                                        where he gives me repose.<br />
                                        Near restful waters he leads me,<br />
                                        to revive my drooping spirit.
                                    </p>
                                    <p className="border-l-4 border-slate-200 pl-4 my-4 text-slate-500 text-sm">
                                        Glory to the Father, and to the Son, and to the Holy Spirit:<br />
                                        as it was in the beginning, is now, and will be for ever. Amen.
                                    </p>
                                    <p className="text-red-600 italic">Ant. The Lord is my shepherd; there is nothing I shall want.</p>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-12 text-center">
                                    <p className="text-blue-900 text-sm">
                                        This is a preview of the Divine Office. In the full version, daily content is fetched from liturgies sources.
                                    </p>
                                </div>

                                <h3 className="text-center text-slate-400 text-sm uppercase tracking-widest mb-6">Dismissal</h3>
                                <div className="text-center">
                                    <p>May the Lord bless us, protect us from all evil and bring us to everlasting life.</p>
                                    <p className="font-bold mt-2">Amen.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
