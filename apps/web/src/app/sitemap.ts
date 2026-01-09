import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://myprayertower.com';
    const lastModified = new Date();

    // Core static pages
    const routes = [
        '',
        '/about',
        '/contact',
        '/donate',
        '/candles',
        '/mass-offerings',
        '/memorials',
        '/prayers',
        '/saints',
        '/bible',
        '/confession',
        '/rosary',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...routes];
}
