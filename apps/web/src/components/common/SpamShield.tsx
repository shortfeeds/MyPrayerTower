'use client';

import React, { useEffect, useState } from 'react';

interface SpamShieldProps {
    /** Optional custom honeypot field name */
    honeypotName?: string;
    /** Optional secondary trap name */
    secondaryTrapName?: string;
}

/**
 * SpamShield Component
 * 
 * Invisible to human users and screen readers, but easily discovered and filled by
 * automated bots and scrapers. Also tracks the time since the form was rendered
 * to detect instant superhuman bot submissions.
 */
export function SpamShield({
    honeypotName = 'website_url',
    secondaryTrapName = 'company_verification'
}: SpamShieldProps) {
    const [timeToken, setTimeToken] = useState<string>('');

    useEffect(() => {
        // Generate an encoded time token upon mounting in the user's browser
        const timestamp = Date.now();
        const nonce = Math.floor(Math.random() * 9000 + 1000);
        const token = btoa(`${timestamp}:${nonce}`);
        setTimeToken(token);
    }, []);

    return (
        <div
            aria-hidden="true"
            style={{
                display: 'none',
                opacity: 0,
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                height: 0,
                width: 0,
                zIndex: -1,
                pointerEvents: 'none'
            }}
            tabIndex={-1}
        >
            {/* Primary Honeypot Field */}
            <label htmlFor={honeypotName}>Leave this field empty</label>
            <input
                id={honeypotName}
                type="text"
                name={honeypotName}
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
            />

            {/* Secondary Honeypot Trap */}
            <label htmlFor={secondaryTrapName}>Do not write here</label>
            <input
                id={secondaryTrapName}
                type="text"
                name={secondaryTrapName}
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
            />

            {/* Time-Trap Token */}
            <input
                type="hidden"
                name="_f_time"
                value={timeToken}
                autoComplete="off"
            />
        </div>
    );
}
