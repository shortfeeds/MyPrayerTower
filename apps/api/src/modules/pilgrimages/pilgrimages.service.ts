import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Pilgrimage } from '@prisma/client';

@Injectable()
export class PilgrimagesService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        // Ensure table exists (Fallback for failed db push)
        try {
            await this.prisma.$executeRawUnsafe(`
                CREATE TABLE IF NOT EXISTS "pilgrimages" (
                    "id" TEXT NOT NULL,
                    "name" TEXT NOT NULL,
                    "location" TEXT NOT NULL,
                    "country" TEXT NOT NULL,
                    "description" TEXT NOT NULL,
                    "significance" TEXT NOT NULL,
                    "imageUrl" TEXT NOT NULL,
                    "virtualTourUrl" TEXT,
                    "viewCount" INTEGER NOT NULL DEFAULT 0,
                    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP(3) NOT NULL,
                    CONSTRAINT "pilgrimages_pkey" PRIMARY KEY ("id")
                );
            `);
        } catch (e) {
            console.error('Failed to create pilgrimages table:', e);
        }

        // Seed data if empty
        try {
            const count = await this.prisma.pilgrimage.count();
            if (count === 0) {
                await this.seed();
            }
        } catch (e) {
            console.error('Failed to seed pilgrimages:', e);
        }
    }

    async findAll() {
        return this.prisma.pilgrimage.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.pilgrimage.findUnique({
            where: { id },
        });
    }

    private async seed() {
        const sites = [
            {
                name: 'Vatican City & St. Peter\'s Basilica',
                location: 'Rome',
                country: 'Italy',
                description: 'The heart of Catholicism, home to the Pope and the tomb of St. Peter.',
                significance: 'Center of the Universal Church',
                virtualTourUrl: 'https://www.vatican.va/various/basiliche/san_pietro/vr_tour/index-en.html',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/St_Peter%27s_Basilica_1.jpg/800px-St_Peter%27s_Basilica_1.jpg',
            },
            {
                name: 'Holy Land - Jerusalem',
                location: 'Jerusalem',
                country: 'Israel',
                description: 'Walk where Jesus walked. Visit the Church of the Holy Sepulchre, Via Dolorosa, and more.',
                significance: 'Sites of Christ\'s life, death, and resurrection',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Jerusalem_Holy_Sepulchre_BW_2010-09-21_18-34-14.JPG/800px-Jerusalem_Holy_Sepulchre_BW_2010-09-21_18-34-14.JPG',
            },
            {
                name: 'Lourdes',
                location: 'Lourdes',
                country: 'France',
                description: 'Where Our Lady appeared to St. Bernadette in 1858. Known for miraculous healings.',
                significance: 'Marian apparition site',
                virtualTourUrl: 'https://www.lourdes-france.org/en/virtual-tour/',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Lourdes_Basilika_und_Grotte.jpg/800px-Lourdes_Basilika_und_Grotte.jpg',
            },
            {
                name: 'Fatima',
                location: 'Fátima',
                country: 'Portugal',
                description: 'Site of the 1917 apparitions to three shepherd children. Home of the Miracle of the Sun.',
                significance: 'Marian apparition site',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Fatima_sanctuary.jpg/800px-Fatima_sanctuary.jpg',
            },
            {
                name: 'Santiago de Compostela',
                location: 'Santiago',
                country: 'Spain',
                description: 'End point of the Camino pilgrimage. Burial site of St. James the Apostle.',
                significance: 'Apostolic shrine',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Catedral_de_Santiago_de_Compostela_agosto_2018_%28cropped%29.jpg/800px-Catedral_de_Santiago_de_Compostela_agosto_2018_%28cropped%29.jpg',
            },
            {
                name: 'Guadalupe',
                location: 'Mexico City',
                country: 'Mexico',
                description: 'Where Our Lady appeared to St. Juan Diego in 1531. The tilma is preserved here.',
                significance: 'Marian apparition site',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG/800px-Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG',
            },
        ];

        for (const site of sites) {
            await this.prisma.pilgrimage.create({ data: site });
        }
        console.log(`Seeded ${sites.length} pilgrimage sites.`);
    }
}
