'use client';

import { useState } from 'react';
import { Plus, Calendar, MapPin, Clock, Users, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ChurchEvent {
    id: string;
    title: string;
    eventType: string;
    startDate: string;
    endDate: string | null;
    location: string;
    maxAttendees: number | null;
    isPublished: boolean;
}

const demoEvents: ChurchEvent[] = [
    {
        id: '1',
        title: 'Christmas Eve Mass',
        eventType: 'MASS',
        startDate: '2024-12-24T18:00:00',
        endDate: '2024-12-24T19:30:00',
        location: 'Main Church',
        maxAttendees: null,
        isPublished: true,
    },
    {
        id: '2',
        title: 'Parish Potluck Dinner',
        eventType: 'SOCIAL',
        startDate: '2024-12-28T17:00:00',
        endDate: '2024-12-28T20:00:00',
        location: 'Parish Hall',
        maxAttendees: 100,
        isPublished: true,
    },
    {
        id: '3',
        title: 'New Year\'s Day Mass',
        eventType: 'MASS',
        startDate: '2025-01-01T10:00:00',
        endDate: null,
        location: 'Main Church',
        maxAttendees: null,
        isPublished: true,
    },
    {
        id: '4',
        title: 'Youth Group Movie Night',
        eventType: 'YOUTH_EVENT',
        startDate: '2025-01-05T19:00:00',
        endDate: '2025-01-05T22:00:00',
        location: 'Youth Center',
        maxAttendees: 30,
        isPublished: false,
    },
];

const eventTypeColors: Record<string, string> = {
    MASS: 'bg-purple-100 text-purple-700',
    CONFESSION: 'bg-blue-100 text-blue-700',
    ADORATION: 'bg-yellow-100 text-yellow-700',
    RETREAT: 'bg-green-100 text-green-700',
    BIBLE_STUDY: 'bg-indigo-100 text-indigo-700',
    YOUTH_EVENT: 'bg-pink-100 text-pink-700',
    FUNDRAISER: 'bg-orange-100 text-orange-700',
    SOCIAL: 'bg-teal-100 text-teal-700',
    VOLUNTEER: 'bg-red-100 text-red-700',
    OTHER: 'bg-gray-100 text-gray-700',
};

export default function EventsPage() {
    const [events] = useState<ChurchEvent[]>(demoEvents);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const navigateMonth = (direction: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
                    <p className="text-gray-500">Manage parish events and activities</p>
                </div>

                <Link
                    href="/dashboard/events/new"
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Event
                </Link>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 min-w-[180px] text-center">{monthName}</h2>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
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
                        onClick={() => setViewMode('calendar')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                            }`}
                    >
                        Calendar
                    </button>
                </div>
            </div>

            {/* List View */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Event</th>
                                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Date & Time</th>
                                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Location</th>
                                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Status</th>
                                <th className="text-right py-4 px-6 font-medium text-gray-500 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-medium text-gray-900">{event.title}</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${eventTypeColors[event.eventType] || eventTypeColors.OTHER
                                                }`}>
                                                {event.eventType.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(event.startDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {event.location}
                                        </div>
                                        {event.maxAttendees && (
                                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                Max {event.maxAttendees}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        {event.isPublished ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 35 }, (_, i) => {
                            const day = i - new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 1;
                            const isCurrentMonth = day > 0 && day <= new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                            const dayEvents = events.filter(e => {
                                const eventDate = new Date(e.startDate);
                                return eventDate.getDate() === day &&
                                    eventDate.getMonth() === currentMonth.getMonth() &&
                                    eventDate.getFullYear() === currentMonth.getFullYear();
                            });

                            return (
                                <div
                                    key={i}
                                    className={`min-h-[100px] p-2 border border-gray-100 rounded-lg ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                >
                                    {isCurrentMonth && (
                                        <>
                                            <span className="text-sm text-gray-600">{day}</span>
                                            <div className="mt-1 space-y-1">
                                                {dayEvents.slice(0, 2).map(event => (
                                                    <div
                                                        key={event.id}
                                                        className={`text-xs px-1 py-0.5 rounded truncate ${eventTypeColors[event.eventType] || eventTypeColors.OTHER
                                                            }`}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-xs text-gray-500">
                                                        +{dayEvents.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
