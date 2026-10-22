import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Subscription can be a Web Push object or a raw token string
        const tokenString = typeof body === 'string' 
            ? body 
            : body.endpoint || (body.token ? body.token : JSON.stringify(body));

        if (!tokenString) {
            return NextResponse.json({ error: 'Valid subscription token is required' }, { status: 400 });
        }

        const user = await getUserFromCookie().catch(() => null);
        const userAgent = req.headers.get('user-agent') || undefined;

        // If authenticated, persist to deviceToken table
        if (user?.id) {
            await db.deviceToken.upsert({
                where: { token: tokenString },
                update: {
                    userId: user.id,
                    isActive: true,
                    userAgent,
                    updatedAt: new Date()
                },
                create: {
                    userId: user.id,
                    token: tokenString,
                    platform: 'web',
                    userAgent,
                    isActive: true
                }
            });
        }

        return NextResponse.json({ success: true, message: 'Push subscription processed' });
    } catch (error) {
        console.error('Error in /api/notifications/subscribe:', error);
        return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Push notification subscribe endpoint. Send POST request.' });
}
