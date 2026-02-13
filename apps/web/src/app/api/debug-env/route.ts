import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log(">>> [DEBUG] Debug route hit");
    const token = process.env.BOT_TOKEN;
    return NextResponse.json({
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
}
