import prisma from "./db";

export const trackEvent = async (telegramId: number | bigint, command: string, metadata?: any) => {
    try {
        const id = BigInt(telegramId);
        
        // Find the TelegramUser record to get its primary key (CUID)
        const user = await prisma.telegramUser.findUnique({
            where: { telegramId: id }
        });

        if (!user) {
            console.error(`Analytics: User ${id} not found.`);
            return;
        }

        await prisma.telegramInteraction.create({
            data: {
                telegramUserId: user.id,
                command: command,
                metadata: metadata ? JSON.stringify(metadata) : undefined
            }
        });
    } catch (error) {
        console.error("Error tracking event:", error);
    }
};
