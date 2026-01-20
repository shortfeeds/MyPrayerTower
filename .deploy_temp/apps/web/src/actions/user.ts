'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateLastConfessionDate(date: Date) {
    // TODO: Get real user ID from session
    const demoUserId = 'demo-user-1';

    try {
        // Check if user exists first (for demo purposes)
        const user = await db.user.findUnique({ where: { id: demoUserId } });

        if (!user) {
            // Create demo user if missing (TEMPORARY for prototype)
            await db.user.create({
                data: {
                    id: demoUserId,
                    email: 'demo@example.com',
                    firstName: 'Demo',
                    lastName: 'User'
                }
            });
        }

        await db.user.update({
            where: { id: demoUserId },
            data: { lastConfessionAt: date },
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Failed to update confession date:', error);
        return { success: false, error: 'Failed to update date' };
    }
}
