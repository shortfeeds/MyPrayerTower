/**
 * Centralized Client-Side Fetcher
 * Routes all API calls through the Next.js server's own /api routes.
 * This avoids CORS issues by keeping all requests same-origin.
 */

export async function directFetch(path: string, options: RequestInit = {}) {
    // All client-side fetches go to the app's own Next.js API routes
    // The path should already start with /api/ (e.g., /api/ads, /api/sponsored)
    // No rewriting needed — the Next.js API routes handle the logic directly.
    const url = path.startsWith('/') ? path : `/${path}`;

    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
}
