import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock data helpers
const FIRST_NAMES = [
    'Maria', 'John', 'Sarah', 'Michael', 'David', 'Grace', 'James', 'Patricia', 'Robert', 'Jennifer',
    'William', 'Elizabeth', 'Thomas', 'Linda', 'Joseph', 'Barbara', 'Charles', 'Susan', 'Christopher', 'Jessica',
    'Daniel', 'Karen', 'Matthew', 'Nancy', 'Anthony', 'Lisa', 'Mark', 'Margaret', 'Donald', 'Betty'
];

const LAST_INITIALS = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.', 'K.', 'L.', 'M.', 'N.', 'O.', 'P.', 'R.', 'S.', 'T.', 'W.'];

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
    "For the lonely and forgotten in our community."
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

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomIntention(): string {
    return getRandomElement(INTENTIONS);
}

function getRandomName(): string {
    return `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_INITIALS)}`;
}

async function main() {
    console.log('Start seeding candles...');

    // Optional: clear existing candles if you want a clean slate (safely check first?)
    // await prisma.prayerCandle.deleteMany({}); 

    const candlesToCreate = [];

    for (const duration of DURATIONS) {
        // Create 10 candles for each duration
        for (let i = 0; i < 10; i++) {
            const days = {
                'ONE_DAY': 1,
                'THREE_DAYS': 3,
                'SEVEN_DAYS': 7,
                'FOURTEEN_DAYS': 14,
                'THIRTY_DAYS': 30
            }[duration];

            // Lit sometime in the past few hours/days, so it's currently active
            const litAt = new Date();
            const randomHoursAgo = Math.floor(Math.random() * (days * 24 * 0.8)); // Lit within 80% of its duration
            litAt.setHours(litAt.getHours() - randomHoursAgo);

            const expiresAt = new Date(litAt);
            expiresAt.setDate(expiresAt.getDate() + days);

            const isAnonymous = Math.random() > 0.7; // 30% anonymous

            candlesToCreate.push({
                intention: getRandomIntention(),
                name: isAnonymous ? null : getRandomName(),
                isAnonymous,
                duration,
                litAt,
                expiresAt,
                isActive: true,
                paymentStatus: 'PAID', // Important for getActiveCandles
                // Use enum if Prisma expects it, but usually string works in JS client if types match
                // We'll trust the string representation which matches schema enum often
                amount: PRICES[duration],
                prayerCount: Math.floor(Math.random() * 50) + 5, // Random prayer count 5-55
                // userId and email optional
            });
        }
    }

    // Using createMany for efficiency
    // Note: SQLite doesn't support createMany in some versions, but Postgres (implied by schema) does.
    const result = await prisma.prayerCandle.createMany({
        data: candlesToCreate
    });

    console.log(`Seeded ${result.count} candles successfully.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
