'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Menu, X, Check } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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
        // Optional: Poll every minute
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
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const res = await fetch(`${API_BASE}/admin/notifications?limit=5`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                // Assuming API returns unread count or we calculate it
                const unread = (data.notifications || []).filter((n: Notification) => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Failed to load notifications', error);
        }
    };

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Call API (Implement mark-read endpoint if needed, or just rely on open)
    };

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4 lg:hidden">
                {/* Mobile menu trigger */}
                <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-600">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Bell className="w-5 h-5 text-gray-500" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-sm">Notifications</h3>
                                <Link href="/admin/notifications" className="text-xs text-amber-600 hover:underline">
                                    View All
                                </Link>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No notifications
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-amber-50/30' : ''}`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="text-sm text-gray-800 line-clamp-2">{notification.message}</p>
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 mt-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-200" />

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                            {(user.name as string)?.[0] || 'A'}
                        </span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{user.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500">{user.role || 'Administrator'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
