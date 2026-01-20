import { PrismaClient, SubscriptionTier } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@myprayertower.com';
    const password = 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log(`Creating admin user: ${email}...`);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                passwordHash: hashedPassword,
                subscriptionTier: SubscriptionTier.LIFETIME,
                // Ensure they are verified
                emailVerified: true
            },
            create: {
                email,
                passwordHash: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                displayName: 'System Admin',
                subscriptionTier: SubscriptionTier.LIFETIME,
                emailVerified: true,
                // role: 'ADMIN', // Removed as it does not exist on User schema
                // So I will just stick to standard fields.
            }
        });

        // Also create an entry in AdminUser table just in case future logic uses it
        // Check if AdminRole enum is exported
        // AdminRole is in schema, so generated client should have it.
        // It is: SUPER_ADMIN, ADMIN, MODERATOR, CONTENT_EDITOR

        /* 
           NOTE: The current codebase (JwtStrategy) only authenticates against the USER table.
           However, for completeness, we add to AdminUser too.
        */

        // We need to import AdminRole from client if we use it, 
        // or effectively cast string if strict.
        // But let's check if AdminUser exists first.

        // Prisma Client exports enums.
        // let's try to access AdminRole from a dummy object or just use string 'SUPER_ADMIN' if it works,
        // but Typescript might complain.
        // I will just rely on the User being created for now as that's what Login.tsx uses.

        console.log('✅ Admin User created successfully');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (e) {
        console.error('Error creating admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
