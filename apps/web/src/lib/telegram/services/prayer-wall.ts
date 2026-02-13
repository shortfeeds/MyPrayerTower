import { db } from "@/lib/db";
import { findOrCreateUser } from "./user.service";
import { ModerationStatus, PrayerVisibility } from "@prisma/client";

export const getPrayerRequests = async () => {
    return db.prayerRequest.findMany({
        where: {
            isPublic: true,
            status: ModerationStatus.APPROVED
        },
        orderBy: { createdAt: "desc" },
        take: 10,
    });
};

export const markPrayer = async (id: string) => {
    return db.prayerRequest.update({
        where: { id },
        data: { prayerCount: { increment: 1 } },
    });
};

export const submitPrayerFromTelegram = async (content: string, name: string, telegramUserId: string) => {
    const user = await findOrCreateUser(parseInt(telegramUserId));

    return db.prayerRequest.create({
        data: {
            content,
            name,
            isPublic: true,
            userId: user?.mptUserId || null,
            status: ModerationStatus.PENDING
        }
    });
};
