const fs = require('fs');
const path = require('path');

// Read DATABASE_URL directly from apps/web/.env
const envText = fs.readFileSync(path.resolve(__dirname, '../apps/web/.env'), 'utf8');
for (const line of envText.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        process.env[key] = val;
    }
}

const prismaPath = path.resolve(__dirname, '../node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client/default.js');
const { PrismaClient } = require(prismaPath);
const prisma = new PrismaClient();

async function main() {
    console.log('=== Checking Database Tables ===');
    const models = [
        'adminUser', 'user', 'prayerCandle', 'donation', 'massOffering', 
        'prayerRequest', 'prayer', 'church', 'saint', 'article', 'memorial'
    ];

    for (const m of models) {
        if (prisma[m]) {
            try {
                const count = await prisma[m].count();
                console.log(`\nTable: ${m} (total: ${count})`);
                if (count > 0 && count <= 10) {
                    const sample = await prisma[m].findMany({ take: 10 });
                    console.log(JSON.stringify(sample, null, 2));
                } else if (count > 10) {
                    const sample = await prisma[m].findMany({ take: 2 });
                    console.log(`Sample (first 2 of ${count}):`, JSON.stringify(sample, null, 2));
                }
            } catch (err) {
                console.log(`${m}: error ${err.message}`);
            }
        } else {
            console.log(`${m}: not found in prisma client`);
        }
    }
    await prisma.$disconnect();
}

main().catch(console.error);
