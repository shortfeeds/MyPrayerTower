import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendVigilCompletedEmail, sendBouquetGiftEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Basic authorization guard for Vercel Cron or secret header
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        // Vercel Cron automatically sends `Authorization: Bearer <CRON_SECRET>`
        // Allow local dev testing if no secret configured
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const now = new Date();
    const results = {
        timestamp: now.toISOString(),
        candlesArchived: 0,
        massesProgressed: 0,
        bouquetsDelivered: 0,
        abandonedCartsPruned: 0,
    };

    try {
        // ─── 1. AUTONOMOUS CANDLE EXPIRATION & ARCHIVAL ───
        const expiredCandles = await db.prayerCandle.findMany({
            where: {
                isActive: true,
                expiresAt: { lte: now }
            },
            take: 200,
            select: {
                id: true,
                userId: true,
                name: true,
                email: true,
                intention: true,
            }
        });

        if (expiredCandles.length > 0) {
            const expiredIds = expiredCandles.map(c => c.id);

            // Batch deactivate
            await db.prayerCandle.updateMany({
                where: { id: { in: expiredIds } },
                data: { isActive: false }
            });

            results.candlesArchived = expiredCandles.length;

            // Notify devotees asynchronously
            for (const candle of expiredCandles) {
                // Email notification
                if (candle.email) {
                    sendVigilCompletedEmail({
                        email: candle.email,
                        name: candle.name || undefined,
                        intention: candle.intention,
                    }).catch(err => console.error('Error sending completion email:', err));
                }

                // In-App User Notification if registered
                if (candle.userId) {
                    db.userNotification.create({
                        data: {
                            userId: candle.userId,
                            title: 'Sacred Vigil Completed',
                            message: `Your vigil for "${candle.intention.slice(0, 40)}..." has completed. It remains sealed in our perpetual archives.`,
                            type: 'SYSTEM',
                            link: '/my-vigils',
                        }
                    }).catch(() => {});
                }
            }
        }

        // ─── 2. AUTONOMOUS MASS OFFERING ADVANCEMENT ───
        // Progress active Scheduled, Assigned or Paid masses
        const activeMasses = await db.massOffering.findMany({
            where: {
                status: { in: ['PAID', 'SCHEDULED', 'ASSIGNED'] }
            },
            take: 100,
            select: {
                id: true,
                orderNumber: true,
                offeringType: true,
                createdAt: true,
                paidAt: true,
                celebrationDate: true,
            }
        });

        for (const mass of activeMasses) {
            const startDate = mass.paidAt || mass.createdAt;
            const daysElapsed = Math.floor((now.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

            let shouldComplete = false;

            if (mass.offeringType === 'REGULAR' || mass.offeringType === 'EXPEDITED') {
                // Single mass completes once celebrationDate has passed or 48 hours after request
                if (mass.celebrationDate && new Date(mass.celebrationDate) <= now) {
                    shouldComplete = true;
                } else if (daysElapsed >= 2) {
                    shouldComplete = true;
                }
            } else if (mass.offeringType === 'NOVENA') {
                // Novena runs for 9 consecutive days
                if (daysElapsed >= 9) {
                    shouldComplete = true;
                }
            } else if (mass.offeringType === 'GREGORIAN') {
                // Gregorian Masses run for 30 consecutive days
                if (daysElapsed >= 30) {
                    shouldComplete = true;
                }
            }

            if (shouldComplete) {
                await db.massOffering.update({
                    where: { id: mass.id },
                    data: {
                        status: 'COMPLETED',
                        celebrationDate: mass.celebrationDate || now,
                    }
                });
                results.massesProgressed++;
            }
        }

        // ─── 3. AUTONOMOUS SPIRITUAL BOUQUET DELIVERY ───
        const pendingBouquets = await db.spiritualBouquet.findMany({
            where: {
                paymentStatus: 'PAID',
                sentAt: null,
                OR: [
                    { sendDate: null },
                    { sendDate: { lte: now } }
                ]
            },
            take: 50,
            select: {
                id: true,
                recipientEmail: true,
                recipientName: true,
                creatorName: true,
                occasion: true,
                message: true,
            }
        });

        for (const bq of pendingBouquets) {
            if (bq.recipientEmail) {
                await sendBouquetGiftEmail({
                    recipientEmail: bq.recipientEmail,
                    recipientName: bq.recipientName,
                    senderName: bq.creatorName,
                    occasion: bq.occasion || undefined,
                    message: bq.message || undefined,
                    bouquetId: bq.id,
                });
            }

            await db.spiritualBouquet.update({
                where: { id: bq.id },
                data: { sentAt: now }
            });
            results.bouquetsDelivered++;
        }

        // ─── 4. AUTONOMOUS STALE ABANDONED CART PRUNING ───
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const pruneResult = await db.abandonedCart.deleteMany({
            where: {
                createdAt: { lt: thirtyDaysAgo }
            }
        }).catch(() => ({ count: 0 }));

        results.abandonedCartsPruned = pruneResult.count;

        return NextResponse.json({
            success: true,
            ...results
        });

    } catch (error: any) {
        console.error('Sanctuary lifecycle cron error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Lifecycle execution failed'
        }, { status: 500 });
    }
}
