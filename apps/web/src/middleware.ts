import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * Optimized middleware:
 * - Narrowed matcher to only routes that need processing (/admin, /dashboard, /journey, /api)
 * - Removed broken in-memory rate limiter (doesn't work in edge/serverless — each invocation gets fresh memory)
 * - Pre-imported jose instead of dynamic import() on every request
 * - Correctly sets x-pathname on the request so it can be read by Server Components via headers()
 */

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const requestHeaders = new Headers(request.headers);
    
    // Add pathname header for server components to detect current route
    // CRITICAL: Must be on the request, not response, for headers() to see it
    requestHeaders.set('x-pathname', pathname);

    // Security headers (lightweight — no CSP here, that's in next.config.js)
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Telegram Mini Apps need to be embeddable
    if (pathname.startsWith('/bot')) {
        response.headers.set('X-Frame-Options', 'ALLOWALL');
    } else {
        response.headers.set('X-Frame-Options', 'DENY');
    }

    // API CORS
    if (pathname.startsWith('/api/')) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    }

    // Admin Authentication
    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') {
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
            const { payload } = await jwtVerify(token, secret);

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
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/journey')) {
        const userToken = request.cookies.get('user_session')?.value;

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

// CRITICAL: Only run middleware on routes that actually need auth or headers
// Added '/' to matcher so it can correctly detect ISR homepage vs admin without per-request overhead
export const config = {
    matcher: [
        '/',
        '/admin/:path*',
        '/dashboard/:path*',
        '/journey/:path*',
        '/api/:path*',
        '/bot/:path*',
        '/saints/:slug*',
        '/prayers/:slug*',
        '/memorials/:path*'
    ],
};
