
import { PrismaClient } from '@mpt/database';

// Use direct import or rely on package hoisting. 
// Since we are in monorepo, @prisma/client is usually hoisted or in the package.
// We'll try generic import.
const prisma = new PrismaClient();

const BASE_URL = 'https://raw.githubusercontent.com/aseemsavio/catholicism-in-json/main';

async function fetchJson(file: string) {
    console.log(`Fetching ${file}...`);
    const res = await fetch(`${BASE_URL}/${file}`);
    if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.statusText}`);
    return res.json();
}

async function seedCatechism() {
    console.log('Seeding Catechism...');
    const data = await fetchJson('catechism.json') as { id: number, text: string }[];

    // Process in chunks
    const chunkSize = 100;
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await Promise.all(chunk.map(async (item) => {
            await prisma.catechismParagraph.upsert({
                where: { number: item.id },
                create: {
                    number: item.id,
                    content: item.text,
                    sectionId: undefined, // Optional now
                },
                update: {
                    content: item.text
                }
            });
        }));
        console.log(`Processed Catechism ${i + chunk.length}/${data.length}`);
    }
}

async function seedCanonLaw() {
    console.log('Seeding Canon Law...');
    const data = await fetchJson('canon.json') as { id: number, text: string | null, sections: { id: number, text: string }[] | null }[];

    for (const item of data) {
        await prisma.canonLaw.upsert({
            where: { number: item.id },
            create: {
                number: item.id,
                text: item.text || '',
                sections: item.sections ? {
                    create: item.sections.map(s => ({
                        sectionNumber: s.id,
                        text: s.text
                    }))
                } : undefined
            },
            update: {
                text: item.text || '',
            }
        });
        // Note: Update of sections is complex, skipping for simplicity of seed
    }
    console.log(`Processed Canon Law: ${data.length}`);
}

async function seedGIRM() {
    console.log('Seeding GIRM...');
    const data = await fetchJson('girm.json') as { id: number, text: string }[];

    const chunkSize = 100;
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await Promise.all(chunk.map(async (item) => {
            await prisma.gIRMItem.upsert({
                where: { number: item.id },
                create: {
                    number: item.id,
                    text: item.text
                },
                update: {
                    text: item.text
                }
            });
        }));
        console.log(`Processed GIRM ${Math.min(i + chunkSize, data.length)}/${data.length}`);
    }
    console.log(`Processed GIRM: ${data.length}`);
}


async function main() {
    try {
        await seedCatechism();
        await seedCanonLaw();
        await seedGIRM();
        console.log('Seeding completed successfully.');
    } catch (e) {
        console.error('Seeding failed:', e);
        process.exit(1);
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
