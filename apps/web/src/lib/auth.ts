import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-key-change-this-in-prod'
);

export interface UserSession {
    id: string;
    email: string;
    firstName?: string | null;
    displayName?: string | null;
}

/**
 * Get the current user from the session cookie
 * Returns null if not authenticated
 */
export async function getUserFromCookie(): Promise<UserSession | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('user_session') || cookieStore.get('admin_session');

        if (!sessionCookie?.value) {
            return null;
        }

        const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);

        if (!payload.id || typeof payload.id !== 'string') {
            return null;
        }

        // Fetch fresh user data from database
        const user = await db.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                displayName: true,
            }
        });

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        // Token invalid or expired
        return null;
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getUserFromCookie();
    return user !== null;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<UserSession> {
    const user = await getUserFromCookie();
    if (!user) {
        throw new Error('Authentication required');
    }
    return user;
}
