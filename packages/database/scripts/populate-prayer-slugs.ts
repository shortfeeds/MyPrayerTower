import { PrismaClient } from '@prisma/client';
import * as process from 'process';

const prisma = new PrismaClient();

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}

async function main() {
    console.log('Starting prayer slug population...');

    // Get all prayers without slugs or with empty slugs
    const prayers = await prisma.prayer.findMany({
        where: {
            OR: [
                { slug: null },
                { slug: '' }
            ]
        }
    });

    console.log(`Found ${prayers.length} prayers to update.`);

    for (const prayer of prayers) {
        let slug = slugify(prayer.title);

        // Ensure uniqueness
        let uniqueSlug = slug;
        let counter = 1;

        while (true) {
            const existing = await prisma.prayer.findUnique({
                where: { slug: uniqueSlug }
            });

            if (!existing || existing.id === prayer.id) {
                break;
            }

            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        console.log(`Updating prayer "${prayer.title}" with slug: ${uniqueSlug}`);

        await prisma.prayer.update({
            where: { id: prayer.id },
            data: { slug: uniqueSlug }
        });
    }

    console.log('Finished updating prayer slugs.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
