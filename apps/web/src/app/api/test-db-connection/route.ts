import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
    console.log(">>> [DB TEST] Attempting connection...");
    try {
        const start = Date.now();
        await db.$connect();
        const end = Date.now();

        console.log(">>> [DB TEST] Connected successfully in", end - start, "ms");

        return new Response(JSON.stringify({
            status: "Success",
            timeMs: end - start
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (e: any) {
        console.error(">>> [DB TEST] Connection failed!", e);
        return new Response("Failed: " + e.message, { status: 500 });
    }
};
