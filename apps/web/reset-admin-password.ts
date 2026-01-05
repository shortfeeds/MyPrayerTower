
import { PrismaClient } from '@mpt/database';
// @ts-ignore
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'admin@myprayertower.com';
        const password = 'Admin123!@#';

        console.log(`Resetting password for ${email}...`);

        const passwordHash = await hash(password, 10);

        // Upsert the user
        await prisma.adminUser.upsert({
            where: { email },
            update: {
                passwordHash,
                isActive: true, // Ensure active
            },
            create: {
                id: 'admin',
                email,
                name: 'Super Admin',
                passwordHash,
                role: 'SUPER_ADMIN',
                isActive: true,
                updatedAt: new Date(),
            }
        });

        console.log('✅ Password reset successfully.');
    } catch (e) {
        console.error('Error resetting password:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
