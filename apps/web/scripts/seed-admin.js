const { PrismaClient } = require('@mpt/database');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2] || 'admin@myprayertower.com';
    const password = process.argv[3] || 'Admin123!';

    console.log(`Creating admin user: ${email}`);

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.adminUser.upsert({
        where: { email },
        update: {
            passwordHash,
            role: 'SUPER_ADMIN',
            isActive: true,
        },
        create: {
            email,
            passwordHash,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            isActive: true,
        },
    });

    console.log(`✅ Admin user created/updated: ${admin.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
