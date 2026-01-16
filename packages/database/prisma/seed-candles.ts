import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock data helpers
const FIRST_NAMES = [
    'Maria', 'John', 'Sarah', 'Michael', 'David', 'Grace', 'James', 'Patricia', 'Robert', 'Jennifer',
    'William', 'Elizabeth', 'Thomas', 'Linda', 'Joseph', 'Barbara', 'Charles', 'Susan', 'Christopher', 'Jessica',
    'Daniel', 'Karen', 'Matthew', 'Nancy', 'Anthony', 'Lisa', 'Mark', 'Margaret', 'Donald', 'Betty',
    'Sofia', 'Mateo', 'Alejandro', 'Isabella', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava',
    'Lucas', 'Mia', 'Mason', 'Charlotte', 'Oliver', 'Amelia', 'Elijah', 'Harper', 'Aiden', 'Evelyn'
];

const LAST_INITIALS = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.', 'K.', 'L.', 'M.', 'N.', 'O.', 'P.', 'R.', 'S.', 'T.', 'W.', 'Y.', 'Z.'];

const COUNTRIES = [
    'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina',
    'United Kingdom', 'Ireland', 'France', 'Italy', 'Spain', 'Germany', 'Poland', 'Portugal',
    'Philippines', 'Australia', 'Nigeria', 'India', 'Kenya'
];

const INTENTIONS = [
    "For my mother's healing and recovery from surgery.",
    "For the repose of the soul of my dear father involved in an accident.",
    "Praying for my son to find his way back to the faith.",
    "For peace in my family and resolution of our conflicts.",
    "Thanksgiving for a safe delivery and a healthy baby.",
    "Guidance in making a difficult career decision.",
    "For the holy souls in purgatory, especially those with no one to pray for them.",
    "For strength and courage to overcome my addiction.",
    "Praying for my daughter's marriage to be blessed.",
    "For the unemployed and those facing financial hardship.",
    "For the conversion of sinners and the triumph of the Immaculate Heart.",
    "For the Pope and all clergy to be faithful shepherds.",
    "For an end to abortion and respect for all life.",
    "For successful exams and clarity of mind.",
    "Healing for my husband facing cancer treatment.",
    "For my depression to lift and to find hope in Christ.",
    "For a special intention known only to God.",
    "Thanksgiving for answered prayers regarding my housing situation.",
    "For wisdom for our world leaders.",
    "For the lonely and forgotten in our community.",
    "For the protection of my family.",
    "In memory of my beloved grandmother.",
    "For a safe journey.",
    "For healing of relationships.",
    "For the gift of faith."
];

const DURATIONS = [
    'ONE_DAY',
    'THREE_DAYS',
    'SEVEN_DAYS',
    'FOURTEEN_DAYS',
    'THIRTY_DAYS'
] as const;

const PRICES = {
    'ONE_DAY': 0,
    'THREE_DAYS': 299,
    'SEVEN_DAYS': 599,
    'FOURTEEN_DAYS': 999,
    'THIRTY_DAYS': 1499
};

// Weighted likes based on tier to encourage upgrades
const PRAYER_COUNT_Ranges = {
    'ONE_DAY': { min: 5, max: 20 },
    'THREE_DAYS': { min: 20, max: 50 },
    'SEVEN_DAYS': { min: 50, max: 150 },
    'FOURTEEN_DAYS': { min: 150, max: 300 },
    'THIRTY_DAYS': { min: 300, max: 800 } // High popularity for top tier
};

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomIntention(): string {
    return getRandomElement(INTENTIONS);
}

function getRandomName(): string {
    return `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_INITIALS)}`;
}

function getRandomCountry(): string {
    return getRandomElement(COUNTRIES);
}

async function main() {
    console.log('Start seeding 2000+ candles...');

    const candlesToCreate = [];
    const COUNT_PER_TIER = 500; // Total 2500 candles

    for (const duration of DURATIONS) {
        // Create candles for each duration
        for (let i = 0; i < COUNT_PER_TIER; i++) {
            const days = {
                'ONE_DAY': 1,
                'THREE_DAYS': 3,
                'SEVEN_DAYS': 7,
                'FOURTEEN_DAYS': 14,
                'THIRTY_DAYS': 30
            }[duration];

            // Lit sometime in the past so it's active
            // Distribute them evenly over the "active" window so we have recent ones and older ones
            const litAt = new Date();
            // Randomly lit strictly within the window that keeps it active
            const randomHoursAgo = Math.floor(Math.random() * (days * 24 * 0.95));
            litAt.setHours(litAt.getHours() - randomHoursAgo);

            const expiresAt = new Date(litAt);
            expiresAt.setDate(expiresAt.getDate() + days);

            const isAnonymous = Math.random() > 0.8; // 20% anonymous

            const range = PRAYER_COUNT_Ranges[duration];
            const prayerCount = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

            candlesToCreate.push({
                intention: getRandomIntention(),
                name: isAnonymous ? null : getRandomName(),
                country: isAnonymous ? null : getRandomCountry(),
                isAnonymous,
                duration,
                litAt,
                expiresAt,
                isActive: true,
                paymentStatus: 'PAID',
                amount: PRICES[duration],
                prayerCount: prayerCount,
            });
        }
    }

    // Insert in chunks to avoid memory/query limits
    const CHUNK_SIZE = 500;
    for (let i = 0; i < candlesToCreate.length; i += CHUNK_SIZE) {
        const chunk = candlesToCreate.slice(i, i + CHUNK_SIZE);
        await prisma.prayerCandle.createMany({
            data: chunk
        });
        console.log(`Inserted chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(candlesToCreate.length / CHUNK_SIZE)}`);
    }

    console.log(`Seeded ${candlesToCreate.length} candles successfully.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
