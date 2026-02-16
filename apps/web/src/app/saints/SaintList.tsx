'use client';

import { useState } from 'react';
import { Search, User, Calendar, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Saint } from '@prisma/client';
import Image from 'next/image';

interface SaintSummary {
    id: string;
    name: string;
    slug: string;
    title: string | null;
    feastDay: string | null;
    imageUrl: string | null;
    patronOf: string[];
    shortBio: string | null;
    biography?: string | null; // Optional now
}

interface SaintListProps {
    initialSaints: SaintSummary[];
}

export default function SaintList({ initialSaints }: SaintListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSaints = initialSaints.filter(saint => {
        const query = searchQuery.toLowerCase();
        return (
            saint.name.toLowerCase().includes(query) ||
            (saint.patronOf && saint.patronOf.some(p => p.toLowerCase().includes(query))) ||
            (saint.feastDay && saint.feastDay.toLowerCase().includes(query))
        );
    });

    return (
        <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center gap-2 border border-gray-100">
                    <Search className="w-6 h-6 text-gray-400 ml-3" />
                    <input
                        type="text"
                        placeholder="Search for a saint, patronage, or feast day..."
                        className="flex-1 px-3 py-3 outline-none text-gray-700 placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Results Grid */}
            {filteredSaints.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSaints.map((saint) => (
                        <Link
                            key={saint.id}
                            href={`/saints/${saint.slug}`}
                            className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
                        >
                            <div className="h-48 bg-amber-50 relative overflow-hidden">
                                {saint.imageUrl ? (
                                    <Image
                                        src={saint.imageUrl}
                                        alt={saint.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <User className="w-16 h-16 text-amber-200" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    {saint.feastDay && (
                                        <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {saint.feastDay}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                                    {saint.title ? `${saint.title} ${saint.name}` : saint.name}
                                </h3>

                                {saint.patronOf && saint.patronOf.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Patron Of</p>
                                        <div className="flex flex-wrap gap-1">
                                            {saint.patronOf.slice(0, 3).map((patron, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full">
                                                    {patron}
                                                </span>
                                            ))}
                                            {saint.patronOf.length > 3 && (
                                                <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full">
                                                    +{saint.patronOf.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                    {saint.shortBio || saint.biography?.substring(0, 150) + "..."}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-50 text-amber-600 font-medium text-sm flex items-center justify-between">
                                    Read Biography
                                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No saints found</h3>
                    <p className="text-gray-500">Try searching for a different name or patronage.</p>
                </div>
            )}
        </div>
    );
}
