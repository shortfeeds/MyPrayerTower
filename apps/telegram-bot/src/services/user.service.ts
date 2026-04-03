import prisma from "./db";

export const findOrCreateUser = async (telegramId: number | bigint, username?: string, referredByCode?: string) => {
    const telegramIdBigInt = BigInt(telegramId);

    try {
        let user = await prisma.telegramUser.findUnique({
            where: { telegramId: telegramIdBigInt }
        });

        if (user) {
            // Update existing user
            user = await prisma.telegramUser.update({
                where: { telegramId: telegramIdBigInt },
                data: {
                    telegramUsername: username,
                    lastActiveDate: new Date(),
                },
            });
        } else {
            // Create new user
            const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            let referredById: string | undefined;

            if (referredByCode) {
                const referrer = await prisma.telegramUser.findUnique({
                    where: { referralCode: referredByCode }
                });
                if (referrer) {
                    referredById = referrer.id;
                }
            }

            user = await prisma.telegramUser.create({
                data: {
                    telegramId: telegramIdBigInt,
                    telegramUsername: username,
                    referralCode: referralCode,
                    referredById: referredById,
                    lastActiveDate: new Date(),
                },
            });
            console.log(`New user created: ${telegramIdBigInt} (Referral: ${referralCode})`);
        }
        return user;
    } catch (error) {
        console.error("Error finding or creating user:", error);
        return null;
    }
};

export const updateUserPreference = async (telegramId: number | bigint, preference: string) => {
    try {
        await prisma.telegramUser.update({
            where: { telegramId: BigInt(telegramId) },
            data: { preference }
        });
        return true;
    } catch (error) {
        console.error("Error updating user preference:", error);
        return false;
    }
};

export const updateLastActive = async (telegramId: number | bigint) => {
    // This is now redundant if we call updateStreak, but kept for compatibility
    try {
        await prisma.telegramUser.update({
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
        const user = await prisma.telegramUser.findUnique({ where: { telegramId: id } });

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
                // Already active today, do nothing
            } else if (isYesterday) {
                // Was active yesterday, increment streak
                newStreak += 1;
                justIncreased = true;
            } else {
                // Missed a day (or more), reset to 1
                newStreak = 1;
                justIncreased = true; // technically increased from 0 effectively for today
            }
        } else {
            // First time active
            newStreak = 1;
            justIncreased = true;
        }

        await prisma.telegramUser.update({
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
