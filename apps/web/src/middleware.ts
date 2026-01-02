import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers
const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=()',
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.google.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.google-analytics.com https://*.googleadservices.com https://*.doubleclick.net https://*.cashfree.com https://*.vercel-scripts.com https://*.vercel-insights.com",
        "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.google.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.google-analytics.com https://*.googleadservices.com https://*.doubleclick.net https://*.cashfree.com https://*.vercel-scripts.com https://*.vercel-insights.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https: http:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://*.stripe.com https://*.supabase.co https://*.googleapis.com https://*.google-analytics.com https://*.googlesyndication.com https://*.gstatic.com https://*.adtrafficquality.google https://*.cashfree.com https://*.vercel-scripts.com https://*.vercel-insights.com https://*.neon.tech",
        "frame-src 'self' https://*.stripe.com https://*.google.com https://*.youtube.com https://*.vimeo.com https://*.doubleclick.net https://*.googlesyndication.com https://*.cashfree.com",
        "media-src 'self' https: blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
    ].join('; '),
};

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100;

function getRateLimitKey(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    return ip;
}

function isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(key);
    if (!record || now > record.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return false;
    }
    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return true;
    }
    record.count++;
    return false;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/api/')) {
        const rateLimitKey = getRateLimitKey(request);
        if (isRateLimited(rateLimitKey)) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
            );
        }
    }

    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    if (pathname.startsWith('/api/')) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    }

    // Admin Authentication
    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login' || pathname.startsWith('/_next')) {
            return response;
        }

        const token = request.cookies.get('admin_session')?.value;

        if (!token) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }

        try {
            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET || 'default-secret-key-change-this-in-prod'
            );
            const { payload } = await import('jose').then(m => m.jwtVerify(token, secret));

            if (!payload || !payload.isAdmin) {
                throw new Error('Unauthorized');
            }
        } catch (error) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
