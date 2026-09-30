'use client';

import React, { useState, useEffect } from 'react';
import { PersonalizedHome } from '@/components/dashboard/PersonalizedHome';

interface HomeSessionWrapperProps {
    children: React.ReactNode;
}

export function HomeSessionWrapper({ children }: HomeSessionWrapperProps) {
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const cookies = document.cookie.split('; ');
            const sessionCookie = cookies.find(row => row.startsWith('user_session='));
            if (sessionCookie && sessionCookie.split('=')[1]) {
                setHasSession(true);
            }
        }
    }, []);

    if (hasSession) {
        return <PersonalizedHome />;
    }

    return <>{children}</>;
}
