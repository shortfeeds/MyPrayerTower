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
                await db.church.update({
                    where: { id },
                    data: { isVerified: true }
                });
                break;

            case 'unverify':
                await db.church.update({
                    where: { id },
                    data: { isVerified: false }
                });
                break;

            case 'delete':
                await db.church.delete({ where: { id } });
                break;

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Admin Church Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform action', message: error.message }, { status: 500 });
    }
}
