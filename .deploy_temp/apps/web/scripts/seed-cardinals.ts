import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

const CARDINALS_URL = 'https://raw.githubusercontent.com/ChrisVo/cardinals/master/cardinals.json';

interface CardinalData {
    Rank: string;
    Name: string;
    Country: string;
    Born: string;
    Order: string;
    Consistory: string;
    Office: string;
    PapalConclaveEligible: boolean;
    CreatedCardinalBy: string;
}

async function main() {
    console.log('Fetching Cardinals data...');

    const response = await fetch(CARDINALS_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch cardinals: ${response.statusText}`);
    }

    const data = await response.json();
    const cardinals: CardinalData[] = data.Cardinals;

    console.log(`Found ${cardinals.length} cardinals. Seeding...`);

    for (const cardinal of cardinals) {
        await prisma.cardinal.upsert({
            where: { rank: parseInt(cardinal.Rank) },
            update: {
                name: cardinal.Name,
                country: cardinal.Country,
                born: cardinal.Born,
                order: cardinal.Order,
                consistory: cardinal.Consistory,
                office: cardinal.Office,
                papalConclaveEligible: cardinal.PapalConclaveEligible,
                createdCardinalBy: cardinal.CreatedCardinalBy,
            },
            create: {
                rank: parseInt(cardinal.Rank),
                name: cardinal.Name,
                country: cardinal.Country,
                born: cardinal.Born,
                order: cardinal.Order,
                consistory: cardinal.Consistory,
                office: cardinal.Office,
                papalConclaveEligible: cardinal.PapalConclaveEligible,
                createdCardinalBy: cardinal.CreatedCardinalBy,
            }
        });
    }

    console.log(`✅ Seeded ${cardinals.length} cardinals successfully!`);
}

main()
    .catch(e => {
        console.error('Error seeding cardinals:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
