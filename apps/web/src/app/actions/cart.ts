'use server';

import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

export interface AbandonedCartPayload {
    type: string; // 'MASS' | 'CANDLE' | 'MEMORIAL' | 'DONATION' | 'OFFERING'
    email: string;
    name?: string | null;
    phone?: string | null;
    data: any;
    step: string;
    source?: string;
}

/**
 * Save or update an in-progress cart before payment completion.
 * If a cart already exists for this email & type in the last 24 hours, updates it.
 */
export async function saveAbandonedCart(payload: AbandonedCartPayload) {
    try {
        const email = payload.email?.trim().toLowerCase();
        if (!email || !payload.type) {
            return { success: false, error: 'Missing email or type' };
        }

        // Check if an existing unconverted cart exists within 24 hours
        const existing = await db.abandonedCart.findFirst({
            where: {
                email,
                type: payload.type.toUpperCase(),
                converted: false,
                createdAt: {
                    gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (existing) {
            const updated = await db.abandonedCart.update({
                where: { id: existing.id },
                data: {
                    data: payload.data,
                    step: payload.step,
                    name: payload.name || existing.name,
                    phone: payload.phone || existing.phone,
                    source: payload.source || existing.source || 'WEB',
                    updatedAt: new Date()
                }
            });
            return { success: true, id: updated.id, updated: true };
        }

        const created = await db.abandonedCart.create({
            data: {
                id: randomUUID(),
                type: payload.type.toUpperCase(),
                email,
                name: payload.name || null,
                phone: payload.phone || null,
                data: payload.data,
                step: payload.step,
                source: payload.source || 'WEB',
                converted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });

        return { success: true, id: created.id, created: true };
    } catch (error) {
        console.error('Failed to save abandoned cart:', error);
        return { success: false, error: 'Database error' };
    }
}

/**
 * Mark a cart as successfully converted upon payment completion.
 */
export async function markAbandonedCartConverted(email: string, type?: string) {
    try {
        const cleanEmail = email?.trim().toLowerCase();
        if (!cleanEmail) return { success: false };

        const whereClause: any = {
            email: cleanEmail,
            converted: false
        };

        if (type) {
            whereClause.type = type.toUpperCase();
        }

        const pendingCarts = await db.abandonedCart.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        if (pendingCarts.length > 0) {
            await db.abandonedCart.updateMany({
                where: {
                    id: { in: pendingCarts.map(c => c.id) }
                },
                data: {
                    converted: true,
                    convertedAt: new Date(),
                    updatedAt: new Date()
                }
            });
        }

        return { success: true, updatedCount: pendingCarts.length };
    } catch (error) {
        console.error('Failed to mark cart converted:', error);
        return { success: false };
    }
}
