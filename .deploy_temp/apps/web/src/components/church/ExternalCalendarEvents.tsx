'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { format, isFuture, isToday, parseISO } from 'date-fns';

interface CalendarEvent {
    uid: string;
    title: string;
    description?: string;
    location?: string;
    start: Date;
    end?: Date;
    allDay: boolean;
    url?: string;
}

interface ExternalCalendarEventsProps {
    calendarUrl: string;
    churchName: string;
    maxEvents?: number;
    className?: string;
}

export function ExternalCalendarEvents({
    calendarUrl,
    churchName,
    maxEvents = 5,
    className = ''
}: ExternalCalendarEventsProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!calendarUrl) {
            setLoading(false);
            return;
        }

        fetch(`/api/calendar/parse?url=${encodeURIComponent(calendarUrl)}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    // Filter to future events only and sort by date
                    const futureEvents = (data.events || [])
                        .map((e: any) => ({
                            ...e,
                            start: new Date(e.start),
                            end: e.end ? new Date(e.end) : undefined,
                        }))
                        .filter((e: CalendarEvent) => isFuture(e.start) || isToday(e.start))
                        .sort((a: CalendarEvent, b: CalendarEvent) => a.start.getTime() - b.start.getTime())
                        .slice(0, maxEvents);

                    setEvents(futureEvents);
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load calendar');
                setLoading(false);
            });
    }, [calendarUrl, maxEvents]);

    if (!calendarUrl) return null;

    if (loading) {
        return (
            <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
                <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-gray-900">Upcoming Events</h3>
                </div>
                <div className="flex justify-center py-8">
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
                <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-gray-900">Upcoming Events</h3>
                </div>
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Calendar temporarily unavailable</span>
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
                <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-gray-900">Upcoming Events</h3>
                </div>
                <p className="text-gray-500 text-sm">No upcoming events scheduled.</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-gray-900">Upcoming Events</h3>
                <span className="ml-auto text-xs text-gray-400">
                    via {churchName} Calendar
                </span>
            </div>

            <div className="divide-y divide-gray-50">
                {events.map((event) => (
                    <div key={event.uid} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-4">
                            {/* Date Badge */}
                            <div className="flex-shrink-0 w-14 h-14 bg-primary-50 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-primary-600 text-xs font-medium uppercase">
                                    {format(event.start, 'MMM')}
                                </span>
                                <span className="text-primary-900 text-xl font-bold">
                                    {format(event.start, 'd')}
                                </span>
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                    {event.title}
                                </h4>

                                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {event.allDay
                                            ? 'All Day'
                                            : format(event.start, 'h:mm a')
                                        }
                                    </div>

                                    {event.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                    )}
                                </div>

                                {event.description && (
                                    <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                                        {event.description}
                                    </p>
                                )}
                            </div>

                            {/* Link */}
                            {event.url && (
                                <a
                                    href={event.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 text-primary-600 hover:text-primary-700"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* View Full Calendar Link */}
            <div className="p-3 bg-gray-50 text-center">
                <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center gap-1"
                >
                    View Full Calendar <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}
