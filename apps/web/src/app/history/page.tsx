'use client';

import { useState } from 'react';
import { History, ChevronLeft, ChevronRight, MapPin, Calendar, Users } from 'lucide-react';

interface HistoryEvent {
    year: string;
    title: string;
    description: string;
    category: 'church' | 'council' | 'saint' | 'persecution' | 'reformation';
}

const TIMELINE: HistoryEvent[] = [
    { year: '33 AD', title: 'Pentecost', description: 'The Holy Spirit descends upon the Apostles. Birth of the Church.', category: 'church' },
    { year: '64 AD', title: 'Neronian Persecution', description: 'Emperor Nero persecutes Christians; martyrdom of Sts. Peter and Paul.', category: 'persecution' },
    { year: '313 AD', title: 'Edict of Milan', description: 'Emperor Constantine legalizes Christianity throughout the Roman Empire.', category: 'church' },
    { year: '325 AD', title: 'Council of Nicaea', description: 'First Ecumenical Council; Nicene Creed formulated; Arianism condemned.', category: 'council' },
    { year: '381 AD', title: 'Council of Constantinople I', description: 'Nicene Creed expanded; divinity of the Holy Spirit affirmed.', category: 'council' },
    { year: '431 AD', title: 'Council of Ephesus', description: 'Mary declared Theotokos (Mother of God); Nestorianism condemned.', category: 'council' },
    { year: '451 AD', title: 'Council of Chalcedon', description: 'Two natures of Christ defined; Monophysitism condemned.', category: 'council' },
    { year: '476 AD', title: 'Fall of Rome', description: 'Western Roman Empire falls; Church becomes key institution of stability.', category: 'church' },
    { year: '529 AD', title: 'St. Benedict', description: 'St. Benedict writes his Rule; foundation of Western monasticism.', category: 'saint' },
    { year: '800 AD', title: 'Charlemagne Crowned', description: 'Pope Leo III crowns Charlemagne Emperor; Holy Roman Empire begins.', category: 'church' },
    { year: '1054 AD', title: 'Great Schism', description: 'East-West Schism; Eastern Orthodox Churches separate from Rome.', category: 'church' },
    { year: '1095 AD', title: 'First Crusade', description: 'Pope Urban II calls the First Crusade to reclaim the Holy Land.', category: 'church' },
    { year: '1215 AD', title: 'Fourth Lateran Council', description: 'Transubstantiation defined; annual confession required.', category: 'council' },
    { year: '1378 AD', title: 'Western Schism', description: 'Multiple claimants to papacy; crisis resolved at Council of Constance (1417).', category: 'church' },
    { year: '1517 AD', title: 'Protestant Reformation', description: 'Martin Luther posts 95 Theses; beginning of Protestant movement.', category: 'reformation' },
    { year: '1545 AD', title: 'Council of Trent', description: 'Counter-Reformation council; Catholic doctrine clarified and reforms enacted.', category: 'council' },
    { year: '1870 AD', title: 'Vatican I', description: 'Papal infallibility defined; interrupted by Italian unification.', category: 'council' },
    { year: '1917 AD', title: 'Fatima Apparitions', description: 'Our Lady appears to three children in Portugal with prophetic messages.', category: 'saint' },
    { year: '1962 AD', title: 'Vatican II Opens', description: 'Pope John XXIII convenes the Second Vatican Council for Church renewal.', category: 'council' },
    { year: '1978 AD', title: 'Pope John Paul II', description: 'Cardinal Wojtyla elected; first non-Italian pope in 455 years.', category: 'church' },
    { year: '2013 AD', title: 'Pope Francis', description: 'Cardinal Bergoglio elected; first pope from the Americas.', category: 'church' },
];

const CATEGORY_COLORS = {
    church: 'bg-blue-100 text-blue-700 border-blue-200',
    council: 'bg-purple-100 text-purple-700 border-purple-200',
    saint: 'bg-amber-100 text-amber-700 border-amber-200',
    persecution: 'bg-red-100 text-red-700 border-red-200',
    reformation: 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function HistoryPage() {
    const [filter, setFilter] = useState<string>('all');

    const filtered = filter === 'all' ? TIMELINE : TIMELINE.filter(e => e.category === filter);

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-orange-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <History className="w-4 h-4 text-amber-300" />
                        <span>2,000 Years</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Church History</h1>
                    <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                        From Pentecost to the present — key events that shaped the Catholic Church.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-10 justify-center">
                    {['all', 'church', 'council', 'saint', 'persecution', 'reformation'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full font-medium capitalize transition-all ${filter === cat
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {cat === 'all' ? 'All Events' : cat}
                        </button>
                    ))}
                </div>

                {/* Timeline */}
                <div className="max-w-3xl mx-auto relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-amber-200" />
                    <div className="space-y-6">
                        {filtered.map((event, i) => (
                            <div key={i} className="relative pl-20">
                                <div className="absolute left-6 w-4 h-4 bg-amber-500 rounded-full border-4 border-[#faf9f6]" />
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-bold text-amber-600">{event.year}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[event.category]}`}>
                                            {event.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                                    <p className="text-gray-600">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
