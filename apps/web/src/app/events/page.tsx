'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Filter, Clock, Users, ChevronDown, Globe } from 'lucide-react';

interface Event {
    id: string;
    title: string;
    eventType: string;
    startDate: string;
    location: string;
    church: {
        name: string;
        city: string;
        state: string;
    };
}

const eventTypes = [
    { id: 'all', label: 'All Events' },
    { id: 'MASS', label: 'Special Mass' },
    { id: 'RETREAT', label: 'Retreats' },
    { id: 'CONFERENCE', label: 'Conferences' },
    { id: 'PILGRIMAGE', label: 'Pilgrimages' },
    { id: 'FUNDRAISER', label: 'Fundraisers' },
    { id: 'YOUTH_EVENT', label: 'Youth Events' },
];

const demoEvents: Event[] = [
    { id: '1', title: 'Advent Parish Mission', eventType: 'RETREAT', startDate: '2024-12-28T18:00:00', location: 'Parish Hall', church: { name: 'St. Patrick Cathedral', city: 'New York', state: 'NY' } },
    { id: '2', title: 'New Year\'s Vigil Mass', eventType: 'MASS', startDate: '2024-12-31T23:00:00', location: 'Main Church', church: { name: 'Holy Family Church', city: 'Chicago', state: 'IL' } },
    { id: '3', title: 'Youth Conference 2025', eventType: 'CONFERENCE', startDate: '2025-01-15T09:00:00', location: 'Convention Center', church: { name: 'Diocese of Phoenix', city: 'Phoenix', state: 'AZ' } },
    { id: '4', title: 'Lourdes Pilgrimage Info Night', eventType: 'PILGRIMAGE', startDate: '2025-01-20T19:00:00', location: 'Parish Center', church: { name: 'Our Lady of Lourdes', city: 'Denver', state: 'CO' } },
];

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>(demoEvents);
    const [selectedType, setSelectedType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const filteredEvents = events.filter(e => {
        const matchesType = selectedType === 'all' || e.eventType === selectedType;
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.church.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.church.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl -translate-y-1/2"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-8 h-8 text-gold-400" />
                        <span className="text-gold-400 font-medium uppercase tracking-widest text-sm">Catholic Events</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Events Near You</h1>
                    <p className="text-primary-100 text-lg max-w-2xl">
                        Find retreats, conferences, pilgrimages, and special Masses happening at Catholic parishes worldwide.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events, churches, or cities..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <select
                                value={selectedType}
                                onChange={e => setSelectedType(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500"
                            >
                                {eventTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                                    }`}
                            >
                                List View
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                                    }`}
                            >
                                Map View
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Cards */}
            <div className="container mx-auto px-4 py-12">
                {viewMode === 'list' ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <article
                                key={event.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                            >
                                {/* Date Badge */}
                                <div className="bg-primary-600 text-white p-4 text-center">
                                    <p className="text-sm uppercase tracking-wider opacity-80">
                                        {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {new Date(event.startDate).getDate()}
                                    </p>
                                    <p className="text-sm uppercase">
                                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                                    </p>
                                </div>

                                <div className="p-5">
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded mb-3">
                                        {event.eventType.replace('_', ' ')}
                                    </span>

                                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {event.title}
                                    </h2>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {new Date(event.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-gray-400" />
                                            {event.church.name} · {event.church.city}, {event.church.state}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-[600px] bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-2">Map View Coming Soon</p>
                                <p className="text-gray-400 text-sm">
                                    Interactive map with event locations will be available soon.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
