'use client';

import { useState, useEffect } from 'react';
import { Clock, Users, Calendar, Play, Bell, BellOff, ChevronRight, Video } from 'lucide-react';
import Link from 'next/link';

interface PrayerSession {
    id: string;
    name: string;
    description: string;
    type: 'rosary' | 'novena' | 'adoration' | 'divine_mercy' | 'community';
    scheduledFor: Date;
    duration: number; // minutes
    hostName?: string;
    participantCount: number;
    isLive: boolean;
    streamUrl?: string;
}

// Sample scheduled sessions
const SAMPLE_SESSIONS: PrayerSession[] = [
    {
        id: '1',
        name: 'Morning Rosary',
        description: 'Join us for the daily Rosary prayer',
        type: 'rosary',
        scheduledFor: new Date(new Date().setHours(7, 0, 0, 0)),
        duration: 30,
        hostName: 'Fr. Michael',
        participantCount: 45,
        isLive: false,
    },
    {
        id: '2',
        name: 'Divine Mercy Chaplet',
        description: 'Pray the Chaplet of Divine Mercy together',
        type: 'divine_mercy',
        scheduledFor: new Date(new Date().setHours(15, 0, 0, 0)),
        duration: 20,
        participantCount: 128,
        isLive: false,
    },
    {
        id: '3',
        name: 'Community Prayer Hour',
        description: 'Open prayer session for all intentions',
        type: 'community',
        scheduledFor: new Date(new Date().setHours(20, 0, 0, 0)),
        duration: 60,
        participantCount: 67,
        isLive: false,
    },
];

const SESSION_ICONS = {
    rosary: '📿',
    novena: '🕯️',
    adoration: '✨',
    divine_mercy: '❤️',
    community: '🙏',
};

/**
 * Upcoming live prayer sessions widget
 */
export function LivePrayerSessions() {
    const [sessions, setSessions] = useState<PrayerSession[]>(SAMPLE_SESSIONS);
    const [reminders, setReminders] = useState<Set<string>>(new Set());

    // Load reminders from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('mpt-session-reminders');
        if (saved) {
            setReminders(new Set(JSON.parse(saved)));
        }
    }, []);

    const toggleReminder = (sessionId: string) => {
        setReminders(prev => {
            const next = new Set(prev);
            if (next.has(sessionId)) {
                next.delete(sessionId);
            } else {
                next.add(sessionId);
            }
            localStorage.setItem('mpt-session-reminders', JSON.stringify(Array.from(next)));
            return next;
        });
    };


    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getTimeUntil = (date: Date) => {
        const diff = date.getTime() - Date.now();
        if (diff < 0) return 'Now';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) return `In ${hours}h ${mins}m`;
        return `In ${mins}m`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Video size={18} className="text-rose-500" />
                    Live Prayer Sessions
                </h3>
                <Link
                    href="/sessions"
                    className="text-sm text-sacred-600 hover:text-sacred-700 flex items-center gap-1"
                >
                    View all <ChevronRight size={14} />
                </Link>
            </div>

            <div className="space-y-3">
                {sessions.map(session => (
                    <div
                        key={session.id}
                        className={`
                            p-4 rounded-xl border transition-all
                            ${session.isLive
                                ? 'bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 border-rose-200 dark:border-rose-800'
                                : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-sacred-200 dark:hover:border-sacred-700'
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">{SESSION_ICONS[session.type]}</div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {session.name}
                                    </h4>
                                    {session.isLive && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full animate-pulse">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                            LIVE
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    {session.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatTime(session.scheduledFor)} ({session.duration}min)
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={12} />
                                        {session.participantCount} joined
                                    </span>
                                    {session.hostName && (
                                        <span>Host: {session.hostName}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className={`
                                    text-xs font-medium px-2 py-1 rounded-full
                                    ${session.isLive
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }
                                `}>
                                    {getTimeUntil(session.scheduledFor)}
                                </span>

                                <div className="flex gap-2">
                                    {!session.isLive && (
                                        <button
                                            onClick={() => toggleReminder(session.id)}
                                            className={`
                                                p-2 rounded-lg transition-colors
                                                ${reminders.has(session.id)
                                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                }
                                            `}
                                            title={reminders.has(session.id) ? 'Remove reminder' : 'Set reminder'}
                                        >
                                            {reminders.has(session.id) ? <Bell size={16} className="fill-current" /> : <BellOff size={16} />}
                                        </button>
                                    )}

                                    {session.isLive ? (
                                        <Link
                                            href={session.streamUrl || `/sessions/${session.id}`}
                                            className="flex items-center gap-1 px-3 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-colors"
                                        >
                                            <Play size={14} />
                                            Join
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/sessions/${session.id}`}
                                            className="flex items-center gap-1 px-3 py-2 bg-sacred-600 text-white text-sm font-medium rounded-lg hover:bg-sacred-700 transition-colors"
                                        >
                                            Details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Compact session indicator for header/sidebar
 */
export function LiveSessionIndicator() {
    const [hasLive, setHasLive] = useState(false);

    // Check for live sessions periodically
    useEffect(() => {
        // In production, this would check an API
        const checkLive = () => {
            const hour = new Date().getHours();
            // Mock: Show as live during certain hours
            setHasLive(hour === 7 || hour === 15 || hour === 20);
        };

        checkLive();
        const interval = setInterval(checkLive, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!hasLive) return null;

    return (
        <Link
            href="/sessions"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-full animate-pulse"
        >
            <span className="w-2 h-2 bg-white rounded-full" />
            LIVE NOW
        </Link>
    );
}

/**
 * Session schedule for a specific day
 */
export function DailySessionSchedule({ date = new Date() }: { date?: Date }) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    const schedule = [
        { time: '07:00', name: 'Morning Rosary', recurring: true },
        { time: '12:00', name: 'Angelus', recurring: true },
        { time: '15:00', name: 'Divine Mercy Chaplet', recurring: true },
        { time: '19:00', name: 'Evening Rosary', recurring: 'weekdays' },
        { time: '20:00', name: 'Community Prayer', recurring: 'weekends' },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-sacred-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">{dayName} Schedule</h3>
            </div>

            <div className="space-y-3">
                {schedule.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <span className="w-14 text-sm font-mono text-gray-500 dark:text-gray-400">
                            {item.time}
                        </span>
                        <span className="flex-1 text-gray-900 dark:text-white">
                            {item.name}
                        </span>
                        {item.recurring === true && (
                            <span className="text-xs text-gray-400">Daily</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
