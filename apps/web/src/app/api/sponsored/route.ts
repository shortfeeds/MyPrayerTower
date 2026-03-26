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

        console.log('[Sponsored API] Query:', JSON.stringify(whereClause));

        // Find all active sponsored content using raw SQL to bypass Prisma model validation issues
        // (Specifically the missing "platforms" column in production DB)
        const contents: any[] = await (db as any).$queryRaw`
            SELECT 
                id, type, title, description, 
                "imageUrl", "linkUrl", advertiser, placement, 
                "adSource", "googleAdUnitId", priority 
            FROM "SponsoredContent" 
            WHERE "isActive" = true 
              AND "isApproved" = true 
              AND "startDate" <= ${now}
              AND "endDate" >= ${now}
              AND ("placement" = ${whereClause.placement} OR "placement" LIKE ${page ? `${page}-%` : '%'})
            ORDER BY priority DESC, "paidAmount" DESC, impressions ASC
        `;

        console.log(`[Sponsored API] Found ${contents.length} contents via raw SQL`);

        // Transform to match frontend expectations
        const ads = contents.map(content => {
            const parts = (content.placement || '').split('-');
            return {
                id: content.id,
                adSource: content.adSource || 'OFFLINE',
                imageUrl: content.imageUrl || '',
                linkUrl: content.linkUrl || '',
                altText: content.description || content.title,
                googleAdUnitId: content.googleAdUnitId || '',
                androidAdUnitId: '', 
                iosAdUnitId: '',
                position: parts[1] || 'sidebar',
                priority: content.priority || 0,
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
