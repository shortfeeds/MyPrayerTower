import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'verify':
                await db.user.update({
                    where: { id },
                    data: { emailVerified: new Date() }
                });
                break;

            case 'makeAdmin':
                await db.user.update({
                    where: { id },
                    data: { role: 'ADMIN' }
                });
                break;

            case 'ban':
                // Would need a 'banned' field in schema
                // For now, just update to reflect action
                break;

            case 'unban':
                // Would need a 'banned' field in schema
                break;

            case 'delete':
                await db.user.delete({ where: { id } });
                break;

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Admin User Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform action', message: error.message }, { status: 500 });
    }
}
