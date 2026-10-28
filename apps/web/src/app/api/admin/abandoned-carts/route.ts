import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const carts = await db.abandonedCart.findMany({
            where: {
                converted: false,
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        const formatted = carts.map((c) => ({
            id: c.id,
            type: c.type,
            email: c.email,
            name: c.name,
            step: c.step,
            createdAt: c.createdAt.toISOString(),
            reminderCount: c.reminderCount,
            lastReminder: c.lastReminder ? c.lastReminder.toISOString() : null,
        }));

        return NextResponse.json({ carts: formatted });
    } catch (error: any) {
        console.error('Error fetching abandoned carts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch abandoned carts', details: error.message },
            { status: 500 }
        );
    }
}
