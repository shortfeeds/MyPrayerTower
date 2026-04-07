'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

/**
 * Sacred Hub Stabilization v5.23 - ULTIMATE SIMPLIFICATION
 * Removed the 'useSearchParams' + 'Suspense' bailout architecture which was identified
 * as the cause of document-level hydration crashes and white-screen failures.
 * Now uses standard window.location detection which is perfectly safe for initial hydration.
 */

interface NativeAppActiveContextType {
    isNativeApp: boolean;
}

const NativeAppActiveContext = createContext<NativeAppActiveContextType>({ isNativeApp: false });

export function AppModeProvider({ children }: { children: React.ReactNode }) {
    const [isNativeApp, setIsNativeApp] = useState(false);

    useEffect(() => {
        const checkAppMode = () => {
            if (typeof window === 'undefined') return;

            const isTwaSource = window.location.search.includes('source=twa');
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isIosStandalone = ('standalone' in window.navigator) && !!(window.navigator as any).standalone;
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            
            const active = isStandalone || isTwaSource || isIosStandalone || isLocal;
            setIsNativeApp(active);
            
            // Critical: Monkey-patch for stale Webpack chunks
            (window as any).isAppMode = active;

            if (active) {
                document.body.classList.add('app-mode-active');
            } else {
                document.body.classList.remove('app-mode-active');
            }
        };

        checkAppMode();
    }, []);

    const value = useMemo(() => ({ isNativeApp }), [isNativeApp]);

    return (
        <NativeAppActiveContext.Provider value={value}>
            {children}
        </NativeAppActiveContext.Provider>
    );
}

export function useAppMode() {
    const context = useContext(NativeAppActiveContext);
    if (!context) {
        throw new Error('useAppMode must be used within an AppModeProvider');
    }
    return context;
}
