'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Flame, Heart, Sparkles, ExternalLink, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NotificationItem {
    id: string;
    type: string;
    title: string;
    body: string;
    data?: any;
    isRead: boolean;
    createdAt: string;
}

export function NotificationCenter() {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await fetch('/api/notifications', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (err) {
            console.error('Failed to fetch user notifications:', err);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            // Auto-pilot poll for updates every 45 seconds
            const interval = setInterval(fetchNotifications, 45000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, fetchNotifications]);

    // Handle outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            setLoading(true);
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllAsRead: true }),
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'MASS_OFFERING_UPDATE':
                return <Sparkles className="w-4 h-4 text-amber-400" />;
            case 'SYSTEM':
                return <Flame className="w-4 h-4 text-orange-400" />;
            default:
                return <Heart className="w-4 h-4 text-rose-400" />;
        }
    };

    const formatTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMin = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMin / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMin < 1) return 'Just now';
            if (diffMin < 60) return `${diffMin}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            return `${diffDays}d ago`;
        } catch {
            return '';
        }
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell trigger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-white/70 hover:text-white hover:bg-white/[0.08] transition-all focus:outline-none focus:ring-1 focus:ring-gold-400"
                aria-label="Notifications"
                title="Sanctuary Notifications"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-gold-400 text-[10px] font-bold text-sacred-950 shadow-sm animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Popover */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e0919] border border-gold-500/20 shadow-2xl shadow-black/80 z-50 overflow-hidden backdrop-blur-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.08]">
                        <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-gold-200">
                                Sanctuary Notices
                            </span>
                            {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gold-500/20 text-gold-300 font-semibold border border-gold-500/30">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    disabled={loading}
                                    className="text-[11px] text-white/60 hover:text-gold-300 flex items-center gap-1 transition-colors"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    <span>Read all</span>
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/40 hover:text-white p-1"
                                aria-label="Close"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-white/[0.05]">
                        {notifications.length === 0 ? (
                            <div className="py-10 px-4 text-center">
                                <Sparkles className="w-8 h-8 text-gold-400/30 mx-auto mb-2" />
                                <p className="text-xs text-white/60 font-medium">No sanctuary notifications yet</p>
                                <p className="text-[11px] text-white/40 mt-1">
                                    When your candles complete or Masses are offered, notices appear here automatically.
                                </p>
                            </div>
                        ) : (
                            notifications.map(item => (
                                <div
                                    key={item.id}
                                    className={`p-3.5 transition-colors flex gap-3 items-start ${item.isRead ? 'bg-transparent' : 'bg-gold-500/[0.06]'
                                        } hover:bg-white/[0.04]`}
                                >
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-white/[0.05] border border-white/10 shrink-0">
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className={`text-xs font-semibold truncate ${item.isRead ? 'text-white/80' : 'text-gold-200'}`}>
                                                {item.title}
                                            </h4>
                                            <span className="text-[10px] text-white/40 shrink-0">
                                                {formatTime(item.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-white/60 leading-relaxed mt-0.5 line-clamp-2">
                                            {item.body}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            {item.data?.certificateUrl && (
                                                <Link
                                                    href={item.data.certificateUrl}
                                                    onClick={() => {
                                                        markAsRead(item.id);
                                                        setIsOpen(false);
                                                    }}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300"
                                                >
                                                    <span>View Keepsake</span>
                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                </Link>
                                            )}
                                            {!item.isRead && (
                                                <button
                                                    onClick={() => markAsRead(item.id)}
                                                    className="text-[10px] text-white/40 hover:text-white transition-colors"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer link to Vigils archive */}
                    <div className="p-2.5 bg-white/[0.02] border-t border-white/[0.05] text-center">
                        <Link
                            href="/my-vigils"
                            onClick={() => setIsOpen(false)}
                            className="text-[11px] text-gold-400/80 hover:text-gold-300 font-medium transition-colors"
                        >
                            Open Sanctuary Keepsake Archive &rarr;
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
