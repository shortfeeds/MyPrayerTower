import { db } from "@/lib/db";

export const findOrCreateUser = async (telegramId: number | bigint, username?: string, referrerCode?: string) => {
    const telegramIdBigInt = BigInt(telegramId);

    try {
        // If referrer code provided, try to find the referrer
        let referredById: string | undefined;
        if (referrerCode) {
            const referrer = await db.telegramUser.findUnique({
                where: { referralCode: referrerCode }
            });
            if (referrer) {
                referredById = referrer.id;
            }
        }

        const user = await db.telegramUser.upsert({
            where: { telegramId: telegramIdBigInt },
            update: {
                telegramUsername: username,
                lastActiveDate: new Date(),
                // If they don't have a referral code yet, generate one (migration)
                referralCode: { set: undefined } // Don't overwrite if exists, but we can't conditionally set in update easily without raw query or separate check. 
                // Actually, let's just ensure it exists? No, keep simple.
            },
            create: {
                telegramId: telegramIdBigInt,
                telegramUsername: username,
                lastActiveDate: new Date(),
                referralCode: telegramId.toString(), // Use ID as simple referral code
                referredById: referredById
            },
        });

        // Ensure referral code exists (for old users)
        if (!user.referralCode) {
            return await db.telegramUser.update({
                where: { id: user.id },
                data: { referralCode: telegramId.toString() }
            });
        }

        return user;
    } catch (error) {
        console.error("Error finding or creating user:", error);
        return null;
    }
};

export const incrementQuizScore = async (telegramUserId: number | undefined) => {
    if (!telegramUserId) return;
    return db.telegramUser.update({
        where: { telegramId: BigInt(telegramUserId) },
        data: { quizScore: { increment: 1 } }
    });
};

export const updateLastActive = async (telegramId: number | bigint) => {
    try {
        await db.telegramUser.update({
            where: { telegramId: BigInt(telegramId) },
            data: { lastActiveDate: new Date() }
        });
    } catch (error) {
        console.error("Failed to update last active:", error);
    }
}

export const updateStreak = async (telegramId: number | bigint) => {
    try {
        const id = BigInt(telegramId);
        const user = await db.telegramUser.findUnique({ where: { telegramId: id } });

        if (!user) return null;

        const now = new Date();
        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
        let newStreak = user.streakCount;
        let justIncreased = false;

        if (lastActive) {
            const isToday = now.toDateString() === lastActive.toDateString();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const isYesterday = yesterday.toDateString() === lastActive.toDateString();

            if (isToday) {
                // Already active today
            } else if (isYesterday) {
                newStreak += 1;
                justIncreased = true;
            } else {
                newStreak = 1;
                justIncreased = true;
            }
        } else {
            newStreak = 1;
            justIncreased = true;
        }

        await db.telegramUser.update({
            where: { telegramId: id },
            data: {
                lastActiveDate: now,
                streakCount: newStreak
            }
        });

        return { streak: newStreak, justIncreased };
    } catch (error) {
        console.error("Error updating streak:", error);
        return null;
    }
};
