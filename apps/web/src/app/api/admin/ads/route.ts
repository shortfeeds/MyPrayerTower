import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

// GET - Fetch all ads for admin
export async function GET(request: NextRequest) {
    try {
        const ads = await db.sponsoredContent.findMany({
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        // Transform to match frontend expectations
        const transformedAds = ads.map(ad => ({
            id: ad.id,
            name: ad.title,
            adSource: (ad as any).adSource || 'OFFLINE',
            imageUrl: ad.imageUrl || '',
            linkUrl: ad.linkUrl || '',
            googleAdUnitId: (ad as any).googleAdUnitId || '',
            altText: ad.description || ad.title,
            page: ad.placement.split('-')[0],
            position: ad.placement.includes('-') ? ad.placement.split('-')[1] : 'sidebar',
            priority: (ad as any).priority || 0,
            isActive: ad.isActive,
            impressions: ad.impressions,
            clicks: ad.clicks,
            startDate: ad.startDate?.toISOString().split('T')[0] || null,
            endDate: ad.endDate?.toISOString().split('T')[0] || null,
            createdAt: ad.createdAt.toISOString()
        }));

        return NextResponse.json({ ads: transformedAds });
    } catch (error: any) {
        console.error('Admin Ads GET Error (Falling back to empty array):', error);
        // Fallback to empty array instead of 500 to keep UI functional
        return NextResponse.json({ ads: [], error: 'Database table not ready. Please run migrations.' });
    }
}


// POST - Create new ad
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Combine page and position for placement
        const placement = `${body.page}-${body.position}`;

        // Determine ad type based on source
        const isGoogleAd = body.adSource === 'GOOGLE';

        const ad = await db.sponsoredContent.create({
            data: {
                id: randomUUID(),
                type: 'BANNER',
                title: body.name,
                description: body.altText || body.name,
                imageUrl: isGoogleAd ? null : body.imageUrl,
                linkUrl: isGoogleAd ? null : body.linkUrl,
                placement: placement,
                advertiser: isGoogleAd ? 'Google AdMob/AdSense' : 'Admin Created',
                startDate: body.startDate ? new Date(body.startDate) : new Date(),
                endDate: body.endDate ? new Date(body.endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                isActive: body.isActive ?? true,
                isApproved: true,
                approvedBy: 'admin',
                approvedAt: new Date(),
                updatedAt: new Date(),
                // New fields for ad source
                adSource: body.adSource || 'OFFLINE',
                googleAdUnitId: isGoogleAd ? body.googleAdUnitId : null,
                priority: body.priority || 0,
            } as any
        });

        return NextResponse.json({ ad, success: true });
    } catch (error: any) {
        console.error('Admin Ads POST Error:', error);
        return NextResponse.json({ error: 'Failed to create ad', message: error.message }, { status: 500 });
    }
}
