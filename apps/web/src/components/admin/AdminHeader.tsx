'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Menu, X, Check, Globe, Shield, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
    user: any;
    onMenuClick?: () => void;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/admin/notifications?limit=5');
            if (res.ok) {
                const data = await res.json();
                const list = data.notifications || [];
                setNotifications(list);
                const unread = list.filter((n: Notification) => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            // non-blocking
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-xs">
            {/* Left Section */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Environment Badge */}
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-semibold tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>SYSTEM ONLINE</span>
                </div>
            </div>

            {/* Center Section: Quick Search Command */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-6">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search offerings, users, memorials, parishes..."
                        className="w-full pl-9 pr-4 py-1.5 bg-gray-50/80 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* View Public Platform */}
                <Link
                    href="/"
                    target="_blank"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50/60 rounded-lg border border-gray-200/80 transition-colors"
                >
                    <Globe className="w-3.5 h-3.5 text-amber-500" />
                    <span>View Public Site</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                </Link>

                {/* Notifications Drawer */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                            <div className="p-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                <h3 className="font-semibold text-xs text-gray-900 uppercase tracking-wider">
                                    System Alerts
                                </h3>
                                <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                    {unreadCount} unread
                                </span>
                            </div>

                            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-gray-400 text-xs">
                                        No recent alerts or notifications
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => markAsRead(n.id)}
                                            className={`p-3.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                !n.isRead ? 'bg-amber-50/40' : ''
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-xs font-semibold text-gray-900 leading-snug">{n.title}</p>
                                                {!n.isRead && (
                                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1.5">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
