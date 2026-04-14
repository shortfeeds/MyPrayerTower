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

    return headers;
};

// Rate limiting removed from middleware to save CPU cycles on Vercel Free Tier.
// Recommendation: Use a dedicated service like Upstash for serverless rate limiting if needed.

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Fast-path for performance: skip middleware for internal or static assets
    if (
        pathname.includes('.') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname === '/favicon.ico' ||
        pathname.startsWith('/api/telegram/webhook')
    ) {
        return NextResponse.next();
    }

    // --- TWA / Android App Detection ---
    const isTwaSource = request.nextUrl.searchParams.get('source') === 'twa';
    const hasTwaCookie = request.cookies.has('is_twa');
    const isApp = isTwaSource || hasTwaCookie;

    // Redirect root to /app if inside native app
    if (isApp && pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/app';
        if (!url.searchParams.has('source')) {
            url.searchParams.set('source', 'twa');
        }
        const resp = NextResponse.redirect(url);
        if (!hasTwaCookie) {
            resp.cookies.set('is_twa', '1', { path: '/', maxAge: 60 * 60 * 24 * 365 });
        }
        return resp;
    }

    // Strict Non-App User Redirect
    const isLocal = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';
    if (pathname === '/app' && !isApp && !isLocal) {
        return NextResponse.redirect('https://www.myprayertower.com');
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    if (isTwaSource && !hasTwaCookie) {
        response.cookies.set('is_twa', '1', { path: '/', maxAge: 60 * 60 * 24 * 365 });
    }

    // Add headers only for HTML pages/API to save bytes
    response.headers.set('x-pathname', pathname);
    const secHeaders = getSecurityHeaders(pathname);
    Object.entries(secHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    if (pathname.startsWith('/api/')) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
        return response;
    }

    // Authentication Checks (Optimized: only run for specific paths)
    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') return response;

        const token = request.cookies.get('admin_session')?.value;
        if (!token) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }

        try {
            // Lightweight token presence check is often enough at middleware level 
            // if pages themselves do a proper verify. 
            // For Vercel limit safety, we keep it simple here.
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');
            const { payload } = await import('jose').then(m => m.jwtVerify(token, secret));
            if (!payload || !payload.isAdmin) throw new Error();
        } catch {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
    }

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/journey')) {
        if (!request.cookies.has('user_session')) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets (svg, png, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?)).*)',
    ],
};
