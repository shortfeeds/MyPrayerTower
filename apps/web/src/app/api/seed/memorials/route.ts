import { NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';

export const dynamic = 'force-dynamic';

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

// 20 Unique portraits - gender matched to memorial names
// Females: Margaret, Rosa, Catherine, Anna, Teresa, Mary, Elizabeth, Lucia, Maria, Helen
// Males: John, Francis, Michael, Patrick, Joseph, Thomas, William, James, Anthony, Peter
const PHOTOS = [
    // Female portraits (indices 0-9)
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', // Margaret - 0
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', // Rosa - 2
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', // Catherine - 4
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', // Anna - 6
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400', // Teresa - 8
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', // Mary - 10
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', // Elizabeth - 12
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', // Lucia - 14
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400', // Maria - 16
    'https://images.unsplash.com/photo-1548142813-c348350df52b?w=400', // Helen - 18
    // Male portraits (indices 10-19)
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', // John - 1
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', // Francis - 3
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', // Michael - 5
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', // Patrick - 7
    'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400', // Joseph - 9
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', // Thomas - 11
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400', // William - 13
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', // James - 15
    'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400', // Anthony - 17
    'https://images.unsplash.com/photo-1557862921-37829c790f19?w=400', // Peter - 19
];

// Gender index mapping for each memorial (F=female index 0-9, M=male index 10-19)
const PHOTO_INDEX_MAP = [0, 10, 1, 11, 2, 12, 3, 13, 4, 14, 5, 15, 6, 16, 7, 17, 8, 18, 9, 19];

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

            // Ensure a user exists to own these memorials
            const user = await prisma.user.upsert({
                where: { email: 'admin@myprayertower.com' },
                update: {},
                create: {
                    id: 'user_admin_seed', // Explicit ID required
                    email: 'admin@myprayertower.com',
                    firstName: 'Admin',
                    lastName: 'User',
                    passwordHash: 'placeholder',
                    updatedAt: new Date(),
                },
            });

            // Check if exists
            const existing = await prisma.memorial.findUnique({ where: { slug } });
            if (existing) continue;

            const memorial = await prisma.memorial.create({
                data: {
                    ownerId: user.id,
                    slug,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    biography: data.bio,
                    shortBio: data.shortBio,
                    birthDate,
                    deathDate,
                    photoUrl: PHOTOS[PHOTO_INDEX_MAP[i]],
                    tier: i < 10 ? 'PREMIUM' : 'BASIC',
                    isPublic: true,
                    isVerified: i < 10,
                    totalCandles: i < 10 ? Math.floor(Math.random() * 500) + 200 : Math.floor(Math.random() * 100) + 10,
                    totalMasses: i < 10 ? Math.floor(Math.random() * 50) + 20 : Math.floor(Math.random() * 10) + 1,
                    totalFlowers: i < 10 ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 30) + 5,
                    totalPrayers: i < 10 ? Math.floor(Math.random() * 1000) + 300 : Math.floor(Math.random() * 150) + 20,
                    viewCount: i < 10 ? Math.floor(Math.random() * 5000) + 1000 : Math.floor(Math.random() * 500) + 50,
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
