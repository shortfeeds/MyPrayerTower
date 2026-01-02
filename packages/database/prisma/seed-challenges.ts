import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seed data for prayer challenges
const seedChallenges = async () => {
    const challenges = [
        {
            name: '30-Day Rosary Challenge',
            slug: '30-day-rosary',
            description: `Join thousands of Catholics in praying the Rosary every day for 30 days!

The Rosary is one of the most powerful prayers in the Catholic tradition. Mary herself has appeared countless times encouraging the faithful to pray the Rosary daily.

During this challenge, you will:
- Pray one full Rosary (5 decades) each day
- Meditate on the mysteries of Christ's life
- Build a consistent prayer habit
- Experience deeper connection with Mary and Jesus

"The Rosary is the weapon for these times." - St. Padre Pio`,
            shortDescription: 'Pray the Rosary daily for 30 days and experience spiritual transformation.',
            type: 'ROSARY' as const,
            duration: 30,
            isActive: true,
            isPremium: false,
            dailyAction: 'Pray one complete Rosary (5 decades)',
            reward: 'Rosary Warrior Badge',
            participantCount: 4523
        },
        {
            name: '9-Day Divine Mercy Novena',
            slug: 'divine-mercy-novena',
            description: `Pray the Divine Mercy Novena as taught by St. Faustina.

The Divine Mercy Novena was given to St. Faustina by Jesus Himself. It begins on Good Friday and ends on Divine Mercy Sunday, but can be prayed at any time.

Each day focuses on a different group of souls:
Day 1: All mankind, especially sinners
Day 2: Priests and religious
Day 3: Devout and faithful souls
Day 4: Those who do not believe in God
Day 5: Separated brethren
Day 6: Meek and humble souls
Day 7: Souls who venerate His mercy
Day 8: Souls detained in purgatory
Day 9: Lukewarm souls

Complete the novena daily with the Divine Mercy Chaplet.`,
            shortDescription: 'Pray the Divine Mercy Novena and Chaplet for 9 days.',
            type: 'DIVINE_MERCY' as const,
            duration: 9,
            isActive: true,
            isPremium: false,
            dailyAction: 'Pray the Divine Mercy Novena prayers and Chaplet',
            reward: 'Divine Mercy Badge',
            participantCount: 2847
        },
        {
            name: '33-Day Marian Consecration',
            slug: 'marian-consecration',
            description: `Prepare for Total Consecration to Jesus through Mary following St. Louis de Montfort's method.

This 33-day preparation leads to the powerful act of consecrating yourself entirely to Jesus Christ through the hands of Mary.

The preparation includes:
- 12 days: Renouncing the spirit of the world
- 7 days: Knowing yourself
- 7 days: Knowing Mary
- 7 days: Knowing Jesus

This is one of the most transformative spiritual exercises you can undertake!`,
            shortDescription: 'Complete the 33-day preparation for Marian Consecration.',
            type: 'MARIAN_CONSECRATION' as const,
            duration: 33,
            isActive: true,
            isPremium: false,
            dailyAction: 'Complete daily Marian Consecration readings and prayers',
            reward: 'Marian Devotee Badge',
            participantCount: 1256
        },
        {
            name: 'Lenten Journey',
            slug: 'lent-2026',
            description: `Walk with Jesus through the 40 days of Lent.

Lent is the sacred season of preparation for Easter. Through prayer, fasting, and almsgiving, we prepare our hearts to celebrate the Resurrection.

Daily activities include:
- Morning reflection on the day's Gospel
- Examination of conscience
- Act of sacrifice or charity
- Stations of the Cross (Fridays)

Join the community in this beautiful season of conversion!`,
            shortDescription: 'Daily prayers and reflections for the 40 days of Lent.',
            type: 'LENT' as const,
            duration: 40,
            startDate: new Date('2026-02-18'),
            endDate: new Date('2026-04-04'),
            isActive: true,
            isPremium: false,
            dailyAction: 'Complete daily Lenten reflection and prayer',
            reward: 'Lenten Pilgrim Badge',
            participantCount: 8934
        },
        {
            name: 'Advent Preparation',
            slug: 'advent-2025',
            description: `Prepare your heart for the coming of Christ during the holy season of Advent.

Advent is a time of joyful expectation as we await the celebration of Christ's birth and prepare for His second coming.

Each week focuses on a theme:
- Week 1: Hope
- Week 2: Peace
- Week 3: Joy
- Week 4: Love

Daily activities include scripture readings, Advent prayers, and family devotions.`,
            shortDescription: 'Daily Advent prayers and reflections to prepare for Christmas.',
            type: 'ADVENT' as const,
            duration: 28,
            startDate: new Date('2025-11-30'),
            endDate: new Date('2025-12-24'),
            isActive: true,
            isPremium: false,
            dailyAction: 'Complete Advent daily reflection',
            reward: 'Advent Badge',
            participantCount: 5672
        },
        {
            name: '14-Day Stations of the Cross',
            slug: 'stations-of-the-cross',
            description: `Walk the Way of the Cross for 14 days, focusing on one station each day.

The Stations of the Cross is a powerful devotion that allows us to accompany Jesus on His journey to Calvary.

Each day you will:
- Meditate deeply on one station
- Pray the traditional station prayers
- Reflect on how this station applies to your life
- Unite your sufferings with Christ

Perfect for Lent or anytime you want to grow closer to Jesus through His Passion.`,
            shortDescription: 'Meditate on one Station of the Cross each day for 14 days.',
            type: 'STATIONS' as const,
            duration: 14,
            isActive: true,
            isPremium: false,
            dailyAction: 'Meditate on one Station of the Cross',
            reward: 'Way of the Cross Badge',
            participantCount: 1893
        }
    ];

    for (const challenge of challenges) {
        await prisma.prayerChallenge.upsert({
            where: { slug: challenge.slug },
            update: challenge,
            create: challenge
        });
    }

    console.log('Challenges seeded successfully!');
};

export { seedChallenges };

// Run if executed directly
if (require.main === module) {
    seedChallenges()
        .then(() => process.exit(0))
        .catch((e) => {
            console.error(e);
            process.exit(1);
        });
}
