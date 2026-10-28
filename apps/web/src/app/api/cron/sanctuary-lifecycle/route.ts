import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendVigilCompletedEmail, sendBouquetGiftEmail } from '@/lib/email';
import { dispatchServerNotification } from '@/lib/serverNotifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Basic authorization guard for Vercel Cron or secret header
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const now = new Date();
    const results = {
        timestamp: now.toISOString(),
        candlesArchived: 0,
        tabernaclesRotated: 0,
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

                // In-App User & Push Notification if registered
                if (candle.userId) {
                    dispatchServerNotification({
                        userId: candle.userId,
                        title: 'Sacred Vigil Completed',
                        body: `Your vigil for "${candle.intention.slice(0, 45)}..." has completed. It remains sealed in the perpetual sanctuary archives.`,
                        type: 'SYSTEM',
                        data: { link: '/my-vigils', candleId: candle.id }
                    }).catch(() => {});
                }
            }
        }

        // ─── 2. AUTONOMOUS TABERNACLE LAMP ROTATION & NOTIFICATION ───
        const expiredTabernacles = await db.prayerCandle.findMany({
            where: {
                isActive: true,
                expiresAt: { lte: now },
                OR: [
                    { duration: 'THIRTY_DAYS' },
                    { intention: { contains: 'Tabernacle' } }
                ]
            },
            take: 20,
            select: {
                id: true,
                userId: true,
                name: true,
                email: true,
                intention: true,
            }
        });

        if (expiredTabernacles.length > 0) {
            for (const lamp of expiredTabernacles) {
                await db.prayerCandle.update({
                    where: { id: lamp.id },
                    data: { isActive: false }
                });

                if (lamp.userId) {
                    dispatchServerNotification({
                        userId: lamp.userId,
                        title: 'Tabernacle Lamp Vigil Completed',
                        body: `Your family's sanctuary lamp dedication for "${lamp.intention.slice(0, 45)}..." has completed. The perpetual adoration continues in heaven and earth.`,
                        type: 'SYSTEM',
                        data: { link: '/my-vigils', lampId: lamp.id }
                    }).catch(() => {});
                }
            }
            results.tabernaclesRotated = expiredTabernacles.length;
        }

        // ─── 3. AUTONOMOUS MASS OFFERING ADVANCEMENT ───
        const activeMasses = await db.massOffering.findMany({
            where: {
                status: { in: ['PAID', 'SCHEDULED', 'ASSIGNED'] }
            },
            take: 100,
            select: {
                id: true,
                userId: true,
                email: true,
                orderNumber: true,
                offeringType: true,
                intentionFor: true,
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
                if (mass.celebrationDate && new Date(mass.celebrationDate) <= now) {
                    shouldComplete = true;
                } else if (daysElapsed >= 2) {
                    shouldComplete = true;
                }
            } else if (mass.offeringType === 'NOVENA') {
                if (daysElapsed >= 9) {
                    shouldComplete = true;
                }
            } else if (mass.offeringType === 'GREGORIAN') {
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

                if (mass.userId) {
                    dispatchServerNotification({
                        userId: mass.userId,
                        title: 'Holy Mass Celebrated',
                        body: `The Holy Mass offering for "${mass.intentionFor}" has been completed and consecrated.`,
                        type: 'MASS_OFFERING_UPDATE',
                        data: { link: '/my-vigils', orderNumber: mass.orderNumber }
                    }).catch(() => {});
                }

                results.massesProgressed++;
            }
        }

        // ─── 4. AUTONOMOUS SPIRITUAL BOUQUET DELIVERY ───
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
                creatorId: true,
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
                }).catch(err => console.error('Error sending bouquet gift email:', err));
            }

            await db.spiritualBouquet.update({
                where: { id: bq.id },
                data: { sentAt: now }
            });

            if (bq.creatorId) {
                dispatchServerNotification({
                    userId: bq.creatorId,
                    title: 'Spiritual Bouquet Delivered',
                    body: `Your bouquet for ${bq.recipientName} has been delivered and blessed.`,
                    type: 'SYSTEM',
                    data: { link: `/bouquets/${bq.id}` }
                }).catch(() => {});
            }

            results.bouquetsDelivered++;
        }

        // ─── 5. AUTONOMOUS STALE ABANDONED CART PRUNING ───
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
