import prisma from "./db";
import { findOrCreateUser } from "./user.service";

export const getLatestPublicPrayers = async (limit = 5) => {
    try {
        const prayers = await prisma.prayerRequest.findMany({
            where: {
                status: "APPROVED",
                visibility: { in: ["PUBLIC", "ANONYMOUS"] },
                isAnswered: false,
            },
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return prayers;
    } catch (error) {
        console.error("Error fetching prayers:", error);
        return [];
    }
};

export const prayForRequest = async (telegramUserId: number | bigint, prayerRequestId: string) => {
    try {
        const telegramUser = await findOrCreateUser(telegramUserId);

        if (!telegramUser) {
            throw new Error("Could not find or create Telegram user");
        }

        // If user is linked to MPT account, create a formal PrayerAction
        if (telegramUser.mptUserId) {
            // Check if already prayed
            const existing = await prisma.prayerAction.findUnique({
                where: {
                    prayerRequestId_userId: {
                        prayerRequestId,
                        userId: telegramUser.mptUserId
                    }
                }
            });

            if (existing) return { success: true, alreadyPrayed: true };

            await prisma.$transaction([
                prisma.prayerAction.create({
                    data: {
                        prayerRequestId,
                        userId: telegramUser.mptUserId,
                    },
                }),
                prisma.prayerRequest.update({
                    where: { id: prayerRequestId },
                    data: { prayerCount: { increment: 1 } },
                }),
            ]);

            return { success: true, linked: true };

        } else {
            // Guest User: Just increment the count
            // We could add a TelegramInteraction log here to prevent duplicate spamming from same TG user if we wanted to be stricter
            await prisma.prayerRequest.update({
                where: { id: prayerRequestId },
                data: { prayerCount: { increment: 1 } },
            });

            return { success: true, linked: false };
        }
    } catch (error) {
        console.error("Error praying for request:", error);
        return { success: false };
    }
};
