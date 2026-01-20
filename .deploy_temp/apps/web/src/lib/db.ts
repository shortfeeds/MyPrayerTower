import { PrismaClient } from '@mpt/database';

declare global {
    var prisma: PrismaClient | undefined;
}

// Create Prisma client with error handling
function createPrismaClient() {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}

// Get or create Prisma client singleton
function getPrismaClient() {
    if (!global.prisma) {
        global.prisma = createPrismaClient();
    }
    return global.prisma;
}

export const db = getPrismaClient();

// Reconnect function for handling connection resets
export async function reconnectIfNeeded() {
    try {
        await db.$connect();
    } catch (error) {
        console.error('Database connection error, attempting to reconnect...', error);
        // Disconnect and create new connection
        await db.$disconnect();
        global.prisma = createPrismaClient();
        await global.prisma.$connect();
    }
}

// Shutdown handler
if (process.env.NODE_ENV !== 'production') {
    // In development, preserve the client
    global.prisma = db;
}
