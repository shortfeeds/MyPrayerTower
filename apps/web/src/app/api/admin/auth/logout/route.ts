import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Clear the admin session cookie
        cookieStore.delete('admin_session');

        return NextResponse.json({ success: true, message: 'Logged out successfully' });
    } catch (error: any) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }
}
