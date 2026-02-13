import { webhookCallback } from "grammy";
import { createBot } from "@/lib/telegram/bot";

export const dynamic = 'force-dynamic';

export const POST = async (req: Request) => {
    try {
        const bot = createBot();
        return webhookCallback(bot, "std/http")(req);
    } catch (e: any) {
        console.error("Error in Telegram Webhook:", e);
        return new Response("Error", { status: 500 });
    }
};
