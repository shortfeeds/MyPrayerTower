
const { PrismaClient } = require('@mpt/database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Load env
try {
    const envPath = path.resolve(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                    value = value.replace(/^"|"$/g, '');
                }
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
} catch (err) {
    console.error('Error loading .env:', err);
}

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Hashing password...');
        const hash = await bcrypt.hash('Admin123!@#', 10);
        console.log('Hash generated. Updating DB...');

        await prisma.adminUser.upsert({
            where: { email: 'admin@myprayertower.com' },
            create: {
                id: 'admin',
                email: 'admin@myprayertower.com',
                name: 'Super Admin',
                passwordHash: hash,
                role: 'SUPER_ADMIN',
                isActive: true,
                updatedAt: new Date(),
            },
            update: {
                passwordHash: hash,
                isActive: true
            }
        });
        console.log('✅ Admin password reset to: Admin123!@#');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
