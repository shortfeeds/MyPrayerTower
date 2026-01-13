'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { SacredMomentModal } from '@/components/prayer/SacredMomentModal';
import { GentleNudge } from '@/components/ui/GentleNudge';

interface SpiritualJourneyContextType {
    triggerSacredMoment: (type: 'prayer' | 'candle' | 'offering') => void;
    showNudge: (message: string, action: () => void, actionLabel: string) => void;
}

const SpiritualJourneyContext = createContext<SpiritualJourneyContextType | undefined>(undefined);

export function useSpiritualJourney() {
    const context = useContext(SpiritualJourneyContext);
    if (!context) {
        throw new Error('useSpiritualJourney must be used within a SpiritualJourneyProvider');
    }
    return context;
}

export function SpiritualJourneyProvider({ children }: { children: ReactNode }) {
    const [isSacredMomentOpen, setIsSacredMomentOpen] = useState(false);
    const [momentType, setMomentType] = useState<'prayer' | 'candle' | 'offering'>('prayer');

    const [nudge, setNudge] = useState<{ visible: boolean; message: string; action: () => void; label: string } | null>(null);

    const triggerSacredMoment = useCallback((type: 'prayer' | 'candle' | 'offering') => {
        setMomentType(type);
        setIsSacredMomentOpen(true);
    }, []);

    const showNudge = useCallback((message: string, action: () => void, actionLabel: string) => {
        setNudge({ visible: true, message, action, label: actionLabel });
        // Auto-dismiss nudge after 10 seconds if not interacted with
        setTimeout(() => {
            setNudge(prev => prev?.message === message ? null : prev);
        }, 10000);
    }, []);

    const closeNudge = () => setNudge(null);

    return (
        <SpiritualJourneyContext.Provider value={{ triggerSacredMoment, showNudge }}>
            {children}

            {/* Global Sacred Moment Modal */}
            <SacredMomentModal
                isOpen={isSacredMomentOpen}
                onClose={() => setIsSacredMomentOpen(false)}
                type={momentType}
            />

            {/* Global Gentle Nudge */}
            {nudge && nudge.visible && (
                <GentleNudge
                    message={nudge.message}
                    action={nudge.action}
                    actionLabel={nudge.label}
                    onClose={closeNudge}
                />
            )}
        </SpiritualJourneyContext.Provider>
    );
}
