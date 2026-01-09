import { NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

// Vercel Cron Secret verification would go here in production
export async function GET(req: Request) {
    try {
        console.log('Running abandoned cart reminder cron...');

        // Find carts offering that are:
        // 1. Not converted
        // 2. Created > 30 mins ago (abandoned)
        // 3. Haven't received max reminders (e.g., 3)
        // 4. Last reminder was sent > 24 hours ago (or never sent)

        const now = new Date();
        const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const abandonedCarts = await prisma.abandonedCart.findMany({
            where: {
                converted: false,
                createdAt: { lt: thirtyMinsAgo },
                reminderCount: { lt: 3 },
                OR: [
                    { lastReminder: null },
                    { lastReminder: { lt: twentyFourHoursAgo } }
                ]
            },
            take: 50 // Process in batches
        });

        console.log(`Found ${abandonedCarts.length} carts requiring reminders.`);

        const results = await Promise.all(abandonedCarts.map(async (cart) => {
            try {
                // Simulate sending email (Replace with generic email service)
                console.log(`Sending reminder email to ${cart.email} for ${cart.type} (Attempt ${cart.reminderCount + 1})`);

                // In a real implementation:
                // await sendEmail({ to: cart.email, subject: 'Complete your memorial', ... });

                // Update cart status
                return await prisma.abandonedCart.update({
                    where: { id: cart.id },
                    data: {
                        reminderCount: { increment: 1 },
                        lastReminder: new Date()
                    }
                });
            } catch (err) {
                console.error(`Failed to process cart ${cart.id}:`, err);
                return null;
            }
        }));

        return NextResponse.json({
            success: true,
            processed: results.filter(Boolean).length
        });

    } catch (error) {
        console.error('Error in reminder cron:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
