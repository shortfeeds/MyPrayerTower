'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Church,
    BookOpen,
    Heart,
    Image,
    Settings,
    Shield,
    BarChart3,
    Bell,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Search,
    Moon,
    Sun,
    Flame,
    ShoppingBag
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface MenuItem {
    name: string;
    href: string;
    icon: any;
    badge?: number;
    children?: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    {
        name: 'Financial Center',
        href: '/admin/finance',
        icon: BarChart3,
        children: [
            { name: 'Revenue Overview', href: '/admin/revenue' },
            { name: 'Donations', href: '/admin/offerings/donations' },
            { name: 'Mass Offerings', href: '/admin/offerings/mass-offerings' },
            { name: 'Virtual Candles', href: '/admin/offerings/candles' },
            { name: 'Failed Payments', href: '/admin/finance/failed-payments' },
            { name: 'Abandoned Carts', href: '/admin/abandoned-carts' },
        ]
    },
    {
        name: 'Content & Resources',
        href: '/admin/cms',
        icon: BookOpen,
        children: [
            { name: 'Saints', href: '/admin/saints' },
            { name: 'Prayers', href: '/admin/prayers' },
            { name: 'Readings', href: '/admin/readings' },
            { name: 'Articles', href: '/admin/articles' },
            { name: 'Memorials', href: '/admin/memorials' },
        ]
    },
    {
        name: 'Churches & Community',
        href: '/admin/churches',
        icon: Church,
        children: [
            { name: 'All Churches', href: '/admin/churches' },
            { name: 'Pending Claims', href: '/admin/churches/claims' },
            { name: 'Verified', href: '/admin/churches/verified' },
        ]
    },
    {
        name: 'Growth & Ads',
        href: '/admin/ads',
        icon: Image,
        children: [
            { name: 'Advertisements', href: '/admin/ads' },
            { name: 'Moderation', href: '/admin/moderation' },
            { name: 'Reports', href: '/admin/reports' },
        ]
    },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
    const pathname = usePathname();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    const toggleMenu = (name: string) => {
        setExpandedMenus(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

    const [reportCount, setReportCount] = useState(0);

    useEffect(() => {
        const fetchReportCount = async () => {
            try {
                const res = await fetch('/api/admin/reports?status=PENDING&limit=1');
                if (res.ok) {
                    const data = await res.json();
                    setReportCount(data.total || 0);
                }
            } catch (err) {
                console.error('Failed to fetch report count', err);
            }
        };

        fetchReportCount();
        // Optional: Poll every minute
        const interval = setInterval(fetchReportCount, 60000);
        return () => clearInterval(interval);
    }, []);

    const updatedMenuItems = menuItems.map(item => {
        if (item.name === 'Moderation') {
            return { ...item, badge: reportCount > 0 ? reportCount : undefined };
        }
        return item;
    });

    return (
        <>
            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0F172A] text-white border-r border-gray-800
                transform transition-transform duration-300 z-50 flex flex-col overflow-hidden
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Custom Scrollbar Styling */}
                <style jsx global>{`
                    .admin-sidebar-scroll::-webkit-scrollbar {
                        display: none;
                    }
                    .admin-sidebar-scroll {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                `}</style>
                <div className="p-4 mb-0">
                    <Link href="/" className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Flame className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 tracking-tight">
                            PrayerTower
                        </span>
                    </Link>
                </div>

                {/* Search */}
                <div className="px-4 py-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        />
                    </div>
                </div>

                {/* Navigation - Scrollable Section */}
                <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto admin-sidebar-scroll">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedMenus.includes(item.name);

                        return (
                            <div key={item.name}>
                                {hasChildren ? (
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${active
                                                ? 'bg-amber-500/10 text-amber-400'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                    <Icon className="w-5 h-5 text-inherit" />
                                                </div>
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${active
                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-inherit" />
                                            </div>
                                            <span className="font-medium">{item.name}</span>
                                            {item.badge && item.badge > 0 && (
                                                <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    )}

                                    {/* Submenu */}
                                    {hasChildren && isExpanded && (
                                        <div className="ml-[1rem] pl-4 border-l border-gray-700/50 space-y-0.5 mt-0.5">
                                            {item.children!.map(child => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${pathname === child.href
                                                        ? 'bg-amber-500/20 text-amber-400 font-medium'
                                                        : 'text-gray-400/80 hover:text-white hover:bg-gray-800/50'
                                                        }`}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">SA</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-xs truncate">Super Admin</p>
                            <p className="text-[10px] text-gray-500 truncate">admin@myprayertower.com</p>
                        </div>
                    </div>
                    <button
                        onClick={async () => {
                            await fetch('/api/admin/auth/logout', { method: 'POST' });
                            window.location.href = '/admin/login';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
