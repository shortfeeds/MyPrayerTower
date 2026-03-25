import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers
const getSecurityHeaders = (pathname: string) => {
    const headers: Record<string, string> = {
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=()',
    };

    // Telegram Mini Apps need to be embeddable
    if (pathname.startsWith('/bot')) {
        headers['X-Frame-Options'] = 'ALLOWALL'; // Or specific ALLOW-FROM if supported
    } else {
        headers['X-Frame-Options'] = 'DENY';
    }

    const frameAncestors = pathname.startsWith('/bot')
        ? "'self' https://t.me https://web.telegram.org https://desktop.telegram.org"
        : "'none'";

    headers['Content-Security-Policy'] = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.paypal.com https://*.paypalobjects.com https://*.google.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.google-analytics.com https://*.googleadservices.com https://*.doubleclick.net https://*.vercel-scripts.com https://*.vercel-insights.com https://*.adtrafficquality.google https://translate.googleapis.com https://translate-pa.googleapis.com",
        "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://*.paypal.com https://*.paypalobjects.com https://*.google.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.google-analytics.com https://*.googleadservices.com https://*.doubleclick.net https://*.vercel-scripts.com https://*.vercel-insights.com https://*.adtrafficquality.google https://translate.googleapis.com https://translate-pa.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
        "img-src 'self' data: blob: https: http: https://*.paypal.com",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://*.paypal.com https://*.paypalobjects.com https://*.supabase.co https://*.googleapis.com https://*.google-analytics.com https://*.doubleclick.net https://stats.g.doubleclick.net https://analytics.google.com https://*.googlesyndication.com https://*.gstatic.com https://*.adtrafficquality.google https://*.vercel-scripts.com https://*.vercel-insights.com https://*.neon.tech",
        "frame-src 'self' https://*.paypal.com https://*.paypalobjects.com https://*.google.com https://*.youtube.com https://*.vimeo.com https://*.doubleclick.net https://*.googlesyndication.com https://*.adtrafficquality.google",
        "media-src 'self' https: blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        `frame-ancestors ${frameAncestors}`,
        "upgrade-insecure-requests",
    ].join('; ');

    return headers;
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
        pathname.startsWith('/api/telegram/webhook') ||
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

    // Add pathname header for server components to detect current route
    response.headers.set('x-pathname', pathname);

    const headers = getSecurityHeaders(pathname);
    Object.entries(headers).forEach(([key, value]) => {
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

    // User & Parish Dashboard Authentication
    // Protects /dashboard (Parish) and /journey (User)
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/journey')) {
        const userToken = request.cookies.get('user_session')?.value;
        // In local dev/mock auth, we might just look for existence, or verify a JWT.
        // Assuming simple cookie check for now as per admin logic or existing auth lib.

        if (!userToken) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            url.searchParams.set('message', 'Please sign in to access this page');
            return NextResponse.redirect(url);
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?)).*)',
    ],
};
