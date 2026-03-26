import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const position = searchParams.get('position');
        const placement = searchParams.get('placement'); // Legacy support
        const platform = searchParams.get('platform');

        console.log(`[Sponsored API] Request: page=${page}, position=${position}, placement=${placement}, platform=${platform}`);

        const now = new Date();

        // Build query based on page/position or placement
        const whereClause: any = {
            isActive: true,
            isApproved: true,
            startDate: { lte: now },
            endDate: { gte: now },
        };

        if (page && position) {
            whereClause.placement = `${page}-${position}`;
        } else if (page) {
            whereClause.placement = { startsWith: page };
        } else if (placement) {
            whereClause.placement = placement;
        }

        if (platform) {
            whereClause.platforms = { has: platform };
        } else {
            whereClause.platforms = { has: 'web' };
        }

        console.log('[Sponsored API] Query:', JSON.stringify(whereClause));

        if (!db || !(db as any).sponsoredContent) {
            console.error('[Sponsored API] Prisma model "sponsoredContent" not found in client');
            return NextResponse.json({ ads: [], content: null }, { status: 200 });
        }

        // Find all active sponsored content, sorted by priority then impressions
        const contents = await (db as any).sponsoredContent.findMany({
            where: whereClause,
            orderBy: [
                { priority: 'desc' },      // Higher priority first
                { paidAmount: 'desc' },    // Then by paid amount
                { impressions: 'asc' },    // Then by least impressions (fairness)
            ],
            select: {
                id: true,
                type: true,
                title: true,
                description: true,
                imageUrl: true,
                linkUrl: true,
                advertiser: true,
                placement: true,
                adSource: true,
                googleAdUnitId: true,
                priority: true,
            },
        });

        console.log(`[Sponsored API] Found ${contents.length} contents`);

        // Transform to match frontend expectations
        const ads = contents.map(content => {
            const parts = content.placement.split('-');
            return {
                id: content.id,
                adSource: (content as any).adSource || 'OFFLINE',
                imageUrl: content.imageUrl || '',
                linkUrl: content.linkUrl || '',
                altText: content.description || content.title,
                googleAdUnitId: (content as any).googleAdUnitId || '',
                androidAdUnitId: (content as any).androidAdUnitId || '',
                iosAdUnitId: (content as any).iosAdUnitId || '',
                position: parts[1] || 'sidebar',
                priority: (content as any).priority || 0,
            };
        });

        const content = contents[0] || null;

        return NextResponse.json({
            ads,
            content: content ? {
                id: content.id,
                type: content.type,
                title: content.title,
                description: content.description,
                imageUrl: content.imageUrl,
                linkUrl: content.linkUrl,
                advertiser: content.advertiser
            } : null
        });
    } catch (error: any) {
        console.error('[Sponsored API] FATAL ERROR:', error);
        return NextResponse.json({
            error: 'Failed to fetch sponsored content',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            ads: [],
            content: null
        }, { status: 500 });
    }
}
