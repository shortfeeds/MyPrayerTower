import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 86400; // 24 hours

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('id');

    if (!videoId || !/^[\w-]{10,12}$/.test(videoId)) {
        return new NextResponse('Invalid video ID', { status: 400 });
    }

    const qualities = ['maxresdefault.jpg', 'hqdefault.jpg', 'mqdefault.jpg', 'default.jpg'];

    for (const q of qualities) {
        try {
            const ytUrl = `https://i.ytimg.com/vi/${videoId}/${q}`;
            const res = await fetch(ytUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                next: { revalidate: 86400 },
            });

            if (res.ok) {
                const buffer = await res.arrayBuffer();
                // Avoid YouTube's 120x90 empty placeholder (which returns 200 with ~1097 bytes)
                if (buffer.byteLength > 2000 || q === 'default.jpg') {
                    return new NextResponse(buffer, {
                        headers: {
                            'Content-Type': 'image/jpeg',
                            'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
                        },
                    });
                }
            }
        } catch {
            // Continue to next quality
        }
    }

    // Elegant Sacred SVG fallback if all YouTube servers fail
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0d0818"/>
                <stop offset="50%" stop-color="#1f103c"/>
                <stop offset="100%" stop-color="#0a0515"/>
            </linearGradient>
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <rect width="640" height="360" fill="url(#bg)"/>
        <circle cx="320" cy="180" r="140" fill="url(#halo)"/>
        <!-- Golden Cross -->
        <g stroke="#eab308" stroke-width="4" stroke-linecap="round">
            <line x1="320" y1="120" x2="320" y2="240"/>
            <line x1="280" y1="155" x2="360" y2="155"/>
        </g>
        <circle cx="320" cy="180" r="40" fill="#dc2626" opacity="0.9"/>
        <polygon points="314,166 332,180 314,194" fill="#ffffff"/>
        <text x="320" y="290" text-anchor="middle" fill="#fde68a" font-family="serif" font-size="18" font-weight="600" letter-spacing="1">
            MY PRAYER TOWER
        </text>
    </svg>
    `.trim();

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}
