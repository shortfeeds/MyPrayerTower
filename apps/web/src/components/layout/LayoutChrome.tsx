'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GlobalEngagement } from '@/components/GlobalEngagement';
import { BackToTop } from '@/components/ui/BackToTop';
import { CookieConsent } from '@/components/CookieConsent';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { FloatingPrayerButton } from '@/components/ui/FloatingPrayerButton';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

interface LayoutChromeProps {
    children: React.ReactNode;
}

export function LayoutChrome({ children }: LayoutChromeProps) {
    const pathname = usePathname() || '';
    const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/church-dashboard');
    const isDedicatedAppPage = pathname === '/app' || pathname.startsWith('/app/');
    const hideWebChrome = isAdminPage || isDedicatedAppPage;

    if (hideWebChrome) {
        return (
            <>
                <main id="main-content">
                    {children}
                </main>
                {isDedicatedAppPage && (
                    <>
                        <FloatingPrayerButton href="/prayers" label="Pray Now" enabled={true} />
                        <MobileBottomNav />
                    </>
                )}
            </>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <SkipToContent />
            <Header />
            <main id="main-content" className="flex-1 w-full">
                {children}
            </main>
            <Footer />
            <GlobalEngagement />
            <BackToTop />
            <CookieConsent />
        </div>
    );
}
