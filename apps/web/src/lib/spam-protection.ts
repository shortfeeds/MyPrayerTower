import { NextRequest } from 'next/server';

/**
 * Universal Spam Protection Engine for MyPrayerTower
 *
 * Implements a multi-layered defense strategy:
 * 1. Invisible Honeypot Traps (Silent Bot Drop)
 * 2. Time-Trap Analysis (Sub-human completion detection)
 * 3. In-Memory Client IP Rate Limiting (DoS and brute force protection)
 * 4. Content & Keyword Spam Inspection (Crypto, gambling, adult, backlink spam)
 * 5. Disposable / Burner Email Detection
 * 6. High Link-Density and Character Randomness Checks
 */

// In-memory rate limiting store: key -> { count, firstRequestTime }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Periodic cleanup of expired rate limit entries every 10 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, value] of rateLimitStore.entries()) {
            if (now > value.resetTime) {
                rateLimitStore.delete(key);
            }
        }
    }, 10 * 60 * 1000);
}

// Common disposable/temporary email provider domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
    'mailinator.com', 'tempmail.com', 'guerrillamail.com', 'sharklasers.com',
    'trashmail.com', '10minutemail.com', 'temp-mail.org', 'yopmail.com',
    'dispostable.com', 'getairmail.com', 'burnermail.io', 'fakemailgenerator.com',
    'mohmal.com', 'throwawaymail.com', 'crazymailing.com', 'mytemp.email'
]);

// Spam trigger keywords commonly targeted at contact forms
const SPAM_KEYWORDS = [
    'viagra', 'cialis', 'levitra', 'xanax', 'pharmacy without',
    'casino', 'crypto', 'cryptocurrency', 'bitcoin', 'usdt', 'forex trading',
    'seo ranking', 'backlinks', 'guest post', 'traffic to your website',
    'domain authority', 'web traffic', 'increase sales', 'ranking on google',
    'whatsapp marketing', 'bulk email', 'telegram bot', 'investment opportunity',
    'earn money fast', 'passive income', 'sugar daddy', 'escort', 'dating site',
    'xxx', 'porn', 'adult webcam', 'onlyfans'
];

/**
 * Extract client IP address from incoming request headers
 */
export function getClientIp(request: Request | NextRequest): string {
    const headers = request.headers;
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    const realIp = headers.get('x-real-ip');
    if (realIp) return realIp.trim();
    const cfConnectingIp = headers.get('cf-connecting-ip');
    if (cfConnectingIp) return cfConnectingIp.trim();
    return '127.0.0.1';
}

/**
 * Check and record IP rate limit
 * @param ip Client IP address
 * @param action Namespace action (e.g. 'contact', 'newsletter', 'prayer')
 * @param maxRequests Maximum allowable requests within the window
 * @param windowSeconds Window length in seconds (default: 600s = 10m)
 */
export function checkRateLimit(
    ip: string,
    action = 'contact',
    maxRequests = 5,
    windowSeconds = 600
): { allowed: boolean; remaining: number; resetTime: number } {
    const key = `${action}:${ip}`;
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        const resetTime = now + windowSeconds * 1000;
        rateLimitStore.set(key, { count: 1, resetTime });
        return { allowed: true, remaining: maxRequests - 1, resetTime };
    }

    if (record.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count += 1;
    rateLimitStore.set(key, record);
    return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Honeypot Validation:
 * If any honeypot input is populated, the submitter is a bot.
 */
export function validateHoneypot(...honeypotValues: (string | null | undefined)[]): boolean {
    for (const val of honeypotValues) {
        if (val && typeof val === 'string' && val.trim().length > 0) {
            return false; // Failed honeypot = bot detected
        }
    }
    return true; // Passed honeypot
}

/**
 * Generate an obfuscated, time-stamped token for client forms
 */
export function generateTimeToken(): string {
    const timestamp = Date.now();
    const nonce = Math.floor(Math.random() * 9000 + 1000);
    // Base64 encode `timestamp:nonce`
    const raw = `${timestamp}:${nonce}`;
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(raw).toString('base64');
    }
    return btoa(raw);
}

/**
 * Validate that a form submission took a realistic human duration
 * @param token The encoded time token generated at form render
 * @param minSeconds Minimum required seconds (default: 3 seconds)
 * @param maxHours Maximum validity hours (default: 24 hours)
 */
export function validateTimeTrap(token?: string | null, minSeconds = 3, maxHours = 24): boolean {
    if (!token) {
        // Token is missing (likely automated script bypassing form render)
        return false;
    }

    try {
        let decoded = '';
        if (typeof Buffer !== 'undefined') {
            decoded = Buffer.from(token, 'base64').toString('utf-8');
        } else {
            decoded = atob(token);
        }

        const [timestampStr] = decoded.split(':');
        const timestamp = parseInt(timestampStr, 10);
        if (isNaN(timestamp)) return false;

        const now = Date.now();
        const elapsedSeconds = (now - timestamp) / 1000;

        // Submitted faster than human typing threshold (e.g., < 3s)
        if (elapsedSeconds < minSeconds) {
            return false;
        }

        // Form loaded more than 24 hours ago (expired session)
        if (elapsedSeconds > maxHours * 3600) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

/**
 * Check if an email address belongs to a disposable or throwaway domain
 */
export function isDisposableEmail(email?: string): boolean {
    if (!email || !email.includes('@')) return false;
    const domain = email.split('@')[1]?.toLowerCase().trim();
    if (!domain) return false;
    return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

export interface SpamInspectionInput {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

export interface SpamInspectionResult {
    isSpam: boolean;
    reason?: string;
    score: number; // 0 = clean, 100 = blatant spam
}

/**
 * Deep inspection of form fields for spam markers
 */
export function inspectSpamContent(input: SpamInspectionInput): SpamInspectionResult {
    let score = 0;
    const reasons: string[] = [];

    const fullText = [
        input.name || '',
        input.email || '',
        input.subject || '',
        input.message || ''
    ].join(' ').toLowerCase();

    // 1. Check for spam trigger keywords
    for (const keyword of SPAM_KEYWORDS) {
        if (fullText.includes(keyword)) {
            score += 40;
            reasons.push(`Contains commercial or promotional spam keyword: "${keyword}"`);
            break;
        }
    }

    // 2. Disposable Email Check
    if (input.email && isDisposableEmail(input.email)) {
        score += 50;
        reasons.push('Disposable email addresses are not accepted');
    }

    // 3. Link density check in message & subject
    const urlMatches = fullText.match(/https?:\/\/|www\./gi) || [];
    if (input.subject && (input.subject.includes('http://') || input.subject.includes('https://') || input.subject.includes('www.'))) {
        score += 50;
        reasons.push('Links are not allowed in the subject line');
    }
    if (urlMatches.length > 2) {
        score += 40;
        reasons.push('Excessive links detected in submission');
    }

    // 4. Repeated character gibberish check (e.g. "aaaaaa", "11111111", "asdfghjkl")
    if (/(.)\1{6,}/.test(fullText)) {
        score += 30;
        reasons.push('Repeated character sequence detected');
    }

    // 5. Giant word with no spaces (obfuscated payload)
    if (input.message && input.message.length > 80 && !input.message.includes(' ')) {
        score += 50;
        reasons.push('Unspaced text payload detected');
    }

    // 6. Name containing URL or email
    if (input.name && (input.name.includes('http') || input.name.includes('.com') || input.name.includes('@'))) {
        score += 35;
        reasons.push('Name field contains web address or email');
    }

    return {
        isSpam: score >= 40,
        score,
        reason: reasons[0]
    };
}
