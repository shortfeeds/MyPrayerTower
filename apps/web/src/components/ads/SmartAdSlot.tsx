'use client';

import React from 'react';

export interface SmartAdSlotProps {
    page?: 'home' | 'churches' | 'saints' | 'prayers' | 'bible' | 'readings' | 'prayer-wall' | 'memorials' | 'candles' | 'blog' | 'rosary' | 'novenas' | 'guides' | 'catechism' | 'general';
    position?: 'top' | 'sidebar' | 'inline' | 'bottom';
    className?: string;
    showPlaceholder?: boolean;
}

/**
 * SmartAdSlot - All advertisements completely disabled and removed per user request.
 */
export function SmartAdSlot(props: SmartAdSlotProps) {
    return null;
}

export function TopBannerAd(props: { page?: SmartAdSlotProps['page']; className?: string }) {
    return null;
}

export function SidebarAd(props: { page?: SmartAdSlotProps['page']; className?: string }) {
    return null;
}

export function InlineAd(props: { page?: SmartAdSlotProps['page']; className?: string }) {
    return null;
}

export function BottomBannerAd(props: { page?: SmartAdSlotProps['page']; className?: string }) {
    return null;
}
