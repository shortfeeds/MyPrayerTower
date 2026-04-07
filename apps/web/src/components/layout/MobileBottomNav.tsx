'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Church, Star, Gift } from 'lucide-react';
import { UniversalOfferingModal } from '@/components/offerings/UniversalOfferingModal';
import { useAppMode } from '@/contexts/AppModeContext';

export function MobileBottomNav() {
    const pathname = usePathname();
    const appModeCtx = useAppMode();
    const [showOfferings, setShowOfferings] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Definitively resolve ReferenceError
    const appActive = appModeCtx.isNativeApp;

    const navItems = [
        { href: appActive ? '/app' : '/', label: 'Home', icon: Home },
        { href: '/memorials', label: 'Memorials', icon: Heart },
        { href: '/churches', label: 'Sacred Spaces', icon: Church },
        { href: '/prayers', label: 'Prayers', icon: Star },
        { href: '#offerings', label: 'Offerings', icon: Gift, isAction: true },
    ];

    const isActive = (path: string) => {
        if (!pathname) return false;
        if (pathname === '/app' && path === '/app') return true;
        if (pathname === '/' && path === '/') return true;
        return pathname === path;
    };

    // Hydration stabilization
    if (!mounted) return null;

    if (pathname && (pathname.startsWith('/bot') || pathname.startsWith('/admin') || pathname.startsWith('/church-dashboard'))) {
        return null; 
    }

    const visibilityClass = !appActive ? 'md:hidden' : '';

    return (
        <>
            {/* Android Sanctuary V7 - Premium Translucent Hub Navigation */}
            <nav className={`
                ${visibilityClass} 
                fixed bottom-0 left-0 right-0 border-t 
                z-[100] transition-all duration-300 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pb-safe
                ${appActive 
                    ? 'bg-[#0a0612] border-white/10 h-auto' 
                    : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 h-auto'
                }
            `}>
                <div className="flex items-center justify-around h-16 px-4">
                    {navItems.map((item) => (
                        <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            onClick={(e) => {
                                if ((item as any).isAction) {
                                    e.preventDefault();
                                    setShowOfferings(true);
                                }
                            }}
                            className={`
                                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95
                                ${isActive(item.href) 
                                    ? (appActive ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-blue-600 dark:text-amber-500 font-black bg-blue-50/50 dark:bg-amber-500/10') 
                                    : (appActive ? 'text-white/50 font-bold' : 'text-gray-600 dark:text-gray-400 font-bold')
                                }
                            `}
                        >
                            <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : ''}`} strokeWidth={isActive(item.href) ? 3 : 2.5} />
                            <span className="text-[9px] tracking-tight font-black uppercase">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
            <UniversalOfferingModal isOpen={showOfferings} onClose={() => setShowOfferings(false)} />
        </>
    );
}

export default MobileBottomNav;
