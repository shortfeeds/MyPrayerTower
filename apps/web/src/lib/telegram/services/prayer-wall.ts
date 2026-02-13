import { db } from "@/lib/db";
import { findOrCreateUser } from "./user.service";
import { ModerationStatus, PrayerVisibility } from "@prisma/client";

export const getLatestPublicPrayers = async (limit = 5) => {
    try {
        const prayers = await db.prayerRequest.findMany({
            where: {
                status: ModerationStatus.APPROVED,
                visibility: { in: [PrayerVisibility.PUBLIC, PrayerVisibility.ANONYMOUS] },
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
            const existing = await db.prayerAction.findUnique({
                where: {
                    prayerRequestId_userId: {
                        prayerRequestId,
                        userId: telegramUser.mptUserId
                    }
                }
            });

            if (existing) return { success: true, alreadyPrayed: true };

            await db.$transaction([
                db.prayerAction.create({
                    data: {
                        prayerRequestId,
                        userId: telegramUser.mptUserId,
                    },
                }),
                db.prayerRequest.update({
                    where: { id: prayerRequestId },
                    data: { prayerCount: { increment: 1 } },
                }),
            ]);

            return { success: true, linked: true };

        } else {
            // Guest User
            await db.prayerRequest.update({
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
