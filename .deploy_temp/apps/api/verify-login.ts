import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@myprayertower.com';
    const password = 'AdminPassword123!';

    console.log(`Verifying login for: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.error('❌ User not found in database!');
        return;
    }

    console.log('✅ User found in database.');
    console.log('ID:', user.id);
    console.log('Email Verified:', user.emailVerified);
    console.log('Hash:', user.passwordHash?.substring(0, 10) + '...');

    if (!user.passwordHash) {
        console.error('❌ User has no password hash!');
        return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (isValid) {
        console.log('✅ Password comparison SUCCESSFUL');
    } else {
        console.error('❌ Password comparison FAILED');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
