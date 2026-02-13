import { db } from './db';

export async function getSaintOfToday() {
    try {
        const today = new Date().toISOString().split('T')[0];

        const dailyContent = await db.dailyContent.findUnique({
            where: { date: today },
            include: { saint: true }
        });

        if (dailyContent?.saint) {
            return dailyContent.saint;
        }

        const count = await db.saint.count();
        if (count === 0) return null;

        const skip = Math.floor(Math.random() * count);
        const [randomSaint] = await db.saint.findMany({
            take: 1,
            skip: skip
        });

        return randomSaint || {
            name: 'St. Therese of Lisieux',
            feastDay: 'October 1',
            slug: 'st-therese'
        };

    } catch (error) {
        console.error('Error fetching saint of the day:', error);
        return {
            name: 'St. Therese of Lisieux',
            feastDay: 'October 1',
            slug: 'st-therese'
        };
    }
}
