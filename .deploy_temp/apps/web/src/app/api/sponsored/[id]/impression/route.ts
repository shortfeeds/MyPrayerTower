'use server';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.sponsoredContent.update({
            where: { id: params.id },
            data: { impressions: { increment: 1 } },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking impression:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
