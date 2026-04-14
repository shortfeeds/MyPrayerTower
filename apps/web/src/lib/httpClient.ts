/**
 * Centralized Client-Side Fetcher
 * Points directly to the external API to bypass Vercel Proxy and save CPU/Request limits.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function directFetch(path: string, options: RequestInit = {}) {
    // If the path starts with /api, we replace it with the external URL + /api/v1
    const cleanPath = path.startsWith('/api/') ? path.replace('/api/', '/api/v1/') : path;
    const url = `${API_BASE_URL}${cleanPath}`;

    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
}
