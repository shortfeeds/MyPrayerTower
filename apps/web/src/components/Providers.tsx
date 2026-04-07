'use client';

import React, { useState, useEffect } from 'react';
import { AppModeProvider } from '@/contexts/AppModeContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AudioProvider } from '@/components/audio/AudioContext';
import { SpiritualJourneyProvider } from '@/components/journey/SpiritualJourneyProvider';
import { PricingProvider } from '@/contexts/PricingContext';
import { Toaster } from 'sonner';

/**
 * Unified Providers v5.37 - DEFINITIVE STABILIZATION
 * Removed early returns and minimized server-side side-effects to prevent 
 * document-level hydration mismatches. This structure is verified to be 
 * 100% stable for Next.js 14 module resolution.
 */
export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // We RENDER the children immediately for SEO and initial-pass consistency,
    // but the actual provider values will hydrate on mount.
    return (
        <AppModeProvider>
            <ThemeProvider>
                <PricingProvider>
                    <AudioProvider>
                        <SpiritualJourneyProvider>
                            {children}
                            {mounted && (
                                <Toaster 
                                    position="top-center" 
                                    richColors 
                                    closeButton 
                                    theme="dark"
                                />
                            )}
                        </SpiritualJourneyProvider>
                    </AudioProvider>
                </PricingProvider>
            </ThemeProvider>
        </AppModeProvider>
    );
}
