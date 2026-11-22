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

// Rate limiting removed from middleware to save CPU cycles.
// Recommendation: Use a dedicated service like Upstash for serverless rate limiting if needed.

// Helper to build reliable public redirects behind reverse proxies
function getAbsoluteRedirectUrl(request: NextRequest, targetPath: string): URL {
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'www.myprayertower.com';
    return new URL(targetPath, `${proto}://${host}`);
}

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

    // Redirect root to /app ONLY if launched from native app with ?source=twa
    if (isTwaSource && pathname === '/') {
        const url = getAbsoluteRedirectUrl(request, '/app');
        const resp = NextResponse.redirect(url);
        resp.cookies.set('is_twa', '1', { path: '/', maxAge: 60 * 60 * 24 * 365 });
        return resp;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Persist TWA session across all pages inside the Android app
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
            const url = getAbsoluteRedirectUrl(request, '/admin/login');
            return NextResponse.redirect(url);
        }

        try {
            // Lightweight token presence check is often enough at middleware level 
            // if pages themselves do a proper verify.
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');
            const { payload } = await import('jose').then(m => m.jwtVerify(token, secret));
            if (!payload || !payload.isAdmin) throw new Error();
        } catch {
            const url = getAbsoluteRedirectUrl(request, '/admin/login');
            return NextResponse.redirect(url);
        }
    }

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/journey')) {
        if (!request.cookies.has('user_session')) {
            const url = getAbsoluteRedirectUrl(request, '/login');
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
