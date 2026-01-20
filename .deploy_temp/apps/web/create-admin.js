"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@mpt/database");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
    }
    else {
        console.warn('Warning: .env file not found at', envPath);
    }
}
catch (err) {
    console.error('Error loading .env:', err);
}
const prisma = new database_1.PrismaClient();
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
                    role: database_1.AdminRole.SUPER_ADMIN,
                    updatedAt: new Date(),
                }
            });
            console.log(`✅ User updated. ID set to '${targetId}'.`);
        }
        else if (existingById) {
            console.log(`Found existing user by ID '${targetId}' (Email: ${existingById.email}). Updating...`);
            // If email differs, we might fail unique constraint if we change email? 
            // Better to keep email or update it if possible.
            // Assumption: User wants this ID to have this Email.
            await prisma.adminUser.update({
                where: { id: targetId },
                data: {
                    email, // Might fail if taken, but we checked existingByEmail above (it was null).
                    passwordHash,
                    role: database_1.AdminRole.SUPER_ADMIN,
                    updatedAt: new Date(),
                }
            });
            console.log(`✅ User updated.`);
        }
        else {
            console.log('Creating new admin user...');
            const res = await prisma.adminUser.create({
                data: {
                    id: targetId,
                    email,
                    passwordHash,
                    name: 'Admin User',
                    role: database_1.AdminRole.SUPER_ADMIN,
                    updatedAt: new Date(),
                }
            });
            console.log('✅ Admin user created successfully with ID:', res.id);
        }
    }
    catch (e) {
        console.error('❌ Error creating admin user:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
