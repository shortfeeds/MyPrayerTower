
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { getUserFromCookie } from '@/lib/auth';

const registerSchema = z.object({
    token: z.string().min(1, "Token is required"),
    platform: z.enum(['android', 'ios', 'web']).default('web'),
    userAgent: z.string().optional()
});

export async function POST(req: Request) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { token, platform, userAgent } = registerSchema.parse(body);

        // Upsert device token
        await db.deviceToken.upsert({
            where: { token },
            update: {
                userId: user.id,
                isActive: true,
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                token,
                platform,
                userAgent: userAgent || (req.headers.get('user-agent') ?? undefined),
                isActive: true
            }
        });

        return NextResponse.json({ success: true, message: 'Device registered' });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
        }
        console.error('Error registering device:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
