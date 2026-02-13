export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
    const token = process.env.BOT_TOKEN;
    if (!token) return new Response("BOT_TOKEN missing", { status: 500 });

    try {
        console.log(">>> [TELEGRAM TEST] Calling getMe...");
        const start = Date.now();
        const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        const data = await res.json();
        const end = Date.now();

        console.log(">>> [TELEGRAM TEST] Success!", data);
        return new Response(JSON.stringify({
            status: "Success",
            timeMs: end - start,
            data
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (e: any) {
        console.error(">>> [TELEGRAM TEST] Failed!", e);
        return new Response("Failed: " + e.message, { status: 500 });
    }
};
