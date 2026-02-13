import { PrismaClient } from '@mpt/database';

declare global {
    var prisma: PrismaClient | undefined;
}

// Create Prisma client with error handling
function createPrismaClient() {
    console.log(">>> [DB] Creating new PrismaClient instance...");
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}

/**
 * Proxy-based lazy singleton for Prisma.
 * The PrismaClient instance will only be created upon the first property access.
 */
export const db = new Proxy({} as PrismaClient, {
    get: (target, prop, receiver) => {
        if (!global.prisma) {
            global.prisma = createPrismaClient();

            if (process.env.NODE_ENV !== 'production') {
                global.prisma = global.prisma;
            }
        }
        return Reflect.get(global.prisma, prop, receiver);
    }
});

// Reconnect function for handling connection resets
export async function reconnectIfNeeded() {
    try {
        console.log(">>> [DB] Checking connection...");
        await db.$connect();
    } catch (error) {
        console.error('Database connection error, attempting to reconnect...', error);
        // Disconnect and create new connection
        if (global.prisma) {
            await global.prisma.$disconnect();
        }
        global.prisma = createPrismaClient();
        await global.prisma.$connect();
    }
}
