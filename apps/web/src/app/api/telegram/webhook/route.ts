import { createBot } from "@/lib/telegram/bot";
import { UserFromGetMe } from "grammy/types";

export const runtime = 'nodejs';
// Prevent cold start delays by caching bot info if container is reused
let cachedBotInfo: UserFromGetMe | undefined = undefined;

export const POST = async (req: Request) => {
    console.log(">>> [TELEGRAM WEBHOOK] Incoming POST request (Polyfill Mode)");

    try {
        const body = await req.json();
        console.log(">>> [TELEGRAM WEBHOOK] Update received:", body.update_id);

        if (!cachedBotInfo) {
            try {
                console.log(">>> [INIT] Fetching bot info via global fetch (bypass grammy init)...");
                const token = process.env.BOT_TOKEN;
                const res = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000),
                    cache: 'no-store'
                });
                if (!res.ok) throw new Error(`getMe failed with status ${res.status}`);
                const json = await res.json();
                if (!json.ok) throw new Error(`getMe API error: ${json.description}`);

                cachedBotInfo = json.result as UserFromGetMe;
                console.log(">>> [INIT] Bot info fetched successfully:", cachedBotInfo.username);
            } catch (fetchError) {
                console.error(">>> [INIT] CONNECTIVITY ERROR:", fetchError);
                // Fallback: Try to create bot without info (will likely time out in init, but worth a try)
                // Or return error
                return new Response("Connectivity Error during Init", { status: 500 });
            }
        } else {
            console.log(">>> [INIT] Using cached bot info:", cachedBotInfo.username);
        }

        // Initialize bot with pre-fetched info
        console.log(">>> [WEBHOOK] Creating bot instance...");
        const bot = createBot(cachedBotInfo);

        // No need to await bot.init() because we passed botInfo!
        // But to be safe, we can call it (it should resolve instantly)
        // await bot.init(); 

        console.log(`>>> [WEBHOOK] Protocol established. Processing update ${body.update_id}`);

        // Handle update with timeout assurance
        await Promise.race([
            bot.handleUpdate(body),
            new Promise((_, reject) => setTimeout(() => reject(new Error("bot.handleUpdate timed out")), 8000))
        ]);

        console.log(`>>> [WEBHOOK] Update ${body.update_id} handled successfully.`);
        return new Response("OK", { status: 200 });
    } catch (e: any) {
        console.error(`>>> [WEBHOOK] Error handling update:`, e);
        // Return 200 to satisfy Telegram retry logic
        return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
};

export const GET = async () => {
    return new Response("Webhook is active (Polyfill Mode). Send POST.", { status: 200 });
};
