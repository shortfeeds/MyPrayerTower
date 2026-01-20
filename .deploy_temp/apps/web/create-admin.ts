
import { PrismaClient, AdminRole } from '@mpt/database';
import * as fs from 'fs';
import * as path from 'path';

console.log("Starting...");

try {
    const envPath = path.resolve(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
        console.log('Loading .env from', envPath);
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Remove quotes
                if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                    value = value.replace(/^"|"$/g, '');
                }
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    } else {
        console.warn('Warning: .env file not found at', envPath);
    }
} catch (err) {
    console.error('Error loading .env:', err);
}

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        // Force connection check
        await prisma.$connect();
        console.log('Connected.');

        console.log('Checking for existing admin...');
        const email = 'admin@myprayertower.com';
        const targetId = 'admim';
        const passwordHash = '$2a$10$5G0ouAFj7U8pbyKJbbjEv.K0gwlDu5ybTkpXH1raiGtQhGl9..WEe';

        const existingByEmail = await prisma.adminUser.findUnique({ where: { email } });
        const existingById = await prisma.adminUser.findUnique({ where: { id: targetId } });

        if (existingByEmail) {
            console.log(`Found existing user by email (ID: ${existingByEmail.id}). Updating...`);
            await prisma.adminUser.update({
                where: { email },
                data: {
                    id: targetId, // Rename ID to requested 'admim'
                    passwordHash,
                    role: AdminRole.SUPER_ADMIN,
                    updatedAt: new Date(),
                }
            });
            console.log(`✅ User updated. ID set to '${targetId}'.`);
        } else if (existingById) {
            console.log(`Found existing user by ID '${targetId}' (Email: ${existingById.email}). Updating...`);
            // If email differs, we might fail unique constraint if we change email? 
            // Better to keep email or update it if possible.
            // Assumption: User wants this ID to have this Email.
            await prisma.adminUser.update({
                where: { id: targetId },
                data: {
                    email, // Might fail if taken, but we checked existingByEmail above (it was null).
                    passwordHash,
                    role: AdminRole.SUPER_ADMIN,
                    updatedAt: new Date(),
                }
            });
            console.log(`✅ User updated.`);
        } else {
            console.log('Creating new admin user...');
            const res = await prisma.adminUser.create({
                data: {
                    id: targetId,
                    email,
                    passwordHash,
                    name: 'Admin User',
                    role: AdminRole.SUPER_ADMIN,
                    updatedAt: new Date(),
                }
            });
            console.log('✅ Admin user created successfully with ID:', res.id);
        }
    } catch (e) {
        console.error('❌ Error creating admin user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
