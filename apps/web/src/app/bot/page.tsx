import React from 'react';
import { TelegramDashboard } from '@/components/telegram/TelegramDashboard';
import { TelegramScript } from '@/components/telegram/TelegramScript';

export const runtime = 'edge'; // Use Edge for fast TMA load

export default function BotMiniAppPage() {
    return (
        <>
            <TelegramScript />
            <TelegramDashboard />
        </>
    );
}
