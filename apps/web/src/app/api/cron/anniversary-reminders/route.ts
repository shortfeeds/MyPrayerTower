import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { sendAnniversaryReminder } from '@/lib/email';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// GET /api/cron/anniversary-reminders - Send anniversary reminders (called by Vercel Cron)
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // Find memorials with anniversaries today (death date)
        const memorials = await prisma.memorial.findMany({
            where: {
                isPublic: true,
                deathDate: { not: null },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                slug: true,
                deathDate: true,
                owner: {
                    select: { email: true, displayName: true },
                },
            },
        });

        let sent = 0;
        const anniversaries = memorials.filter(m => {
            if (!m.deathDate) return false;
            const d = new Date(m.deathDate);
            return d.getMonth() + 1 === month && d.getDate() === day;
        });

        for (const memorial of anniversaries) {
            const fullName = `${memorial.firstName} ${memorial.lastName}`;

            // Send to owner
            if (memorial.owner?.email) {
                await sendAnniversaryReminder({
                    memorialName: fullName,
                    memorialSlug: memorial.slug,
                    anniversaryDate: memorial.deathDate!.toISOString(),
                    recipientEmail: memorial.owner.email,
                    recipientName: memorial.owner.displayName || undefined,
                });
                sent++;
            }

            // In the future, also send to followers/family who opted in
        }

        return NextResponse.json({
            success: true,
            date: today.toISOString().split('T')[0],
            anniversariesToday: anniversaries.length,
            emailsSent: sent,
        });
    } catch (error) {
        console.error('Error sending anniversary reminders:', error);
        return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
    }
}
