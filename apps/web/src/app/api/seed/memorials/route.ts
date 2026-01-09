import { NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

// Realistic Catholic names and details
const MEMORIAL_DATA = [
    { firstName: 'Margaret', lastName: 'O\'Brien', bio: 'Devoted mother, grandmother, and pillar of St. Patrick\'s Parish', shortBio: 'Loving mother of 5, grandmother of 12' },
    { firstName: 'John', lastName: 'Murphy', bio: 'A man of deep faith who served as a Knight of Columbus for 40 years', shortBio: 'Beloved husband, father, and Knight' },
    { firstName: 'Rosa', lastName: 'Martinez', bio: 'Her hands were always folded in prayer, her heart always open to others', shortBio: 'Faithful servant of Our Lady' },
    { firstName: 'Francis', lastName: 'Kelly', bio: 'Vietnam veteran who found peace through the Rosary and daily Mass', shortBio: 'Veteran, daily communicant' },
    { firstName: 'Catherine', lastName: 'Walsh', bio: 'Taught CCD for 35 years, bringing countless children to Christ', shortBio: 'Catechist and spiritual mother' },
    { firstName: 'Michael', lastName: 'Brennan', bio: 'Deacon and devoted servant who answered God\'s call', shortBio: 'Deacon, servant of the Lord' },
    { firstName: 'Anna', lastName: 'Rossi', bio: 'Her kitchen was a place of love, feeding both body and soul', shortBio: 'Beloved Nonna to all' },
    { firstName: 'Patrick', lastName: 'Sullivan', bio: 'Proud Irish-American who never missed Sunday Mass', shortBio: 'Faithful husband and father' },
    { firstName: 'Teresa', lastName: 'Nguyen', bio: 'Escaped Vietnam, found refuge in Christ, shared her faith with all', shortBio: 'Refugee who became a witness' },
    { firstName: 'Joseph', lastName: 'DiLorenzo', bio: 'Built three Catholic churches with his own hands', shortBio: 'Builder of churches, builder of faith' },
    { firstName: 'Mary', lastName: 'O\'Connor', bio: 'Founder of the parish pro-life ministry', shortBio: 'Defender of the unborn' },
    { firstName: 'Thomas', lastName: 'Kowalski', bio: 'Polish immigrant who kept the faith through war and displacement', shortBio: 'Survivor, believer, witness' },
    { firstName: 'Elizabeth', lastName: 'Chen', bio: 'First-generation Catholic who led Bible study for 20 years', shortBio: 'Convert who inspired many' },
    { firstName: 'William', lastName: 'McCarthy', bio: 'WWII veteran who prayed the Rosary on the beaches of Normandy', shortBio: 'Hero of faith and country' },
    { firstName: 'Lucia', lastName: 'Santos', bio: 'Named after Our Lady of Fatima, lived a life of Marian devotion', shortBio: 'Daughter of Our Lady' },
    { firstName: 'James', lastName: 'O\'Malley', bio: 'Lector, usher, and parish council member for 50 years', shortBio: 'Lifetime of service' },
    { firstName: 'Maria', lastName: 'Garcia', bio: 'Her devotion to the Sacred Heart touched everyone she met', shortBio: 'Heart of gold, faith of steel' },
    { firstName: 'Anthony', lastName: 'Rizzo', bio: 'Raised 8 children in the faith, all went to Catholic school', shortBio: 'Patriarch of a faithful family' },
    { firstName: 'Helen', lastName: 'Fitzgerald', bio: 'Altar society member who ensured the church was always beautiful', shortBio: 'Keeper of sacred beauty' },
    { firstName: 'Peter', lastName: 'Andersen', bio: 'Convert from Lutheranism, RCIA sponsor for 25 years', shortBio: 'Brought many home to Rome' },
];

const PHOTOS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    'https://images.unsplash.com/photo-1542178243-bc20974f57b7?w=400',
    'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400',
];

// GET /api/seed/memorials - Create dummy memorials
export async function GET() {
    try {
        const created = [];

        for (let i = 0; i < MEMORIAL_DATA.length; i++) {
            const data = MEMORIAL_DATA[i];
            const slug = `${data.firstName}-${data.lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');

            // Random dates
            const deathYear = 2020 + Math.floor(Math.random() * 5);
            const birthYear = deathYear - (60 + Math.floor(Math.random() * 35));
            const birthDate = new Date(birthYear, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28));
            const deathDate = new Date(deathYear, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28));

            // Check if exists
            const existing = await prisma.memorial.findUnique({ where: { slug } });
            if (existing) continue;

            const memorial = await prisma.memorial.create({
                data: {
                    slug,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    biography: data.bio,
                    shortBio: data.shortBio,
                    birthDate,
                    deathDate,
                    photoUrl: PHOTOS[i % PHOTOS.length],
                    tier: i < 5 ? 'PREMIUM' : 'BASIC',
                    isPublic: true,
                    isVerified: i < 5,
                    totalCandles: Math.floor(Math.random() * 200) + 10,
                    totalMasses: Math.floor(Math.random() * 20) + 1,
                    totalFlowers: Math.floor(Math.random() * 50) + 5,
                    totalPrayers: Math.floor(Math.random() * 300) + 20,
                    viewCount: Math.floor(Math.random() * 1000) + 100,
                },
            });
            created.push(memorial.slug);
        }

        return NextResponse.json({
            success: true,
            created: created.length,
            memorials: created,
        });
    } catch (error) {
        console.error('Error seeding memorials:', error);
        return NextResponse.json({ error: 'Failed to seed memorials' }, { status: 500 });
    }
}
