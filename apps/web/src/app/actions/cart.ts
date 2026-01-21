'use server';

import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function saveAbandonedCart(data: {
    type: string;
    email: string; // Used for tracking/identification even if not fully entered
    name?: string | null;
    phone?: string | null;
    data: any;
    step: string;
    source?: string;
}) {
    try {
        await db.abandonedCart.create({
            data: {
                id: randomUUID(),
                type: data.type,
                email: data.email,
                name: data.name,
                phone: data.phone,
                data: data.data,
                step: data.step,
                source: data.source || 'WEB',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return { success: true };
    } catch (error) {
        // Silent fail for analytics
        console.error('Error saving abandoned cart:', error);
        return { success: false };
    }
}
