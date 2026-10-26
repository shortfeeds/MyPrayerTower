'use client';

import React from 'react';
import { CertificateModal } from '@/components/certificates/CertificateModal';

interface DigitalVotiveCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    prayerTitle: string;
    userName?: string;
    durationDays?: number;
    candleTierName?: string;
    prayerUrl?: string;
}

export function DigitalVotiveCardModal({
    isOpen,
    onClose,
    prayerTitle,
    userName = 'Faithful Soul',
    durationDays = 3,
    candleTierName = 'Devotion Votive',
}: DigitalVotiveCardModalProps) {
    if (!isOpen) return null;

    return (
        <CertificateModal
            isOpen={isOpen}
            onClose={onClose}
            type="vigil"
            title="CERTIFICATE OF SACRED VIGIL"
            latinTitle="Perpetua Laus et Lumen Sanctum"
            recipientName={prayerTitle}
            donorName={userName}
            dedicatedDetail={`${candleTierName} • ${durationDays} Days Vigil`}
            intention={prayerTitle}
            durationDays={durationDays}
            scripture="I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life."
            scriptureRef="John 8:12"
            celebrantOrSanctuary="Sanctuary of the Holy Tabernacle & Perpetual Adoration"
        />
    );
}
