import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { AdminLayoutContent } from '@/components/admin/AdminLayoutContent';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-key-change-this-in-prod'
);

async function verifyAdminSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session');

    if (!sessionToken?.value) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(sessionToken.value, JWT_SECRET);
        if (payload.isAdmin) {
            return payload;
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function isLoginPage() {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    return pathname === '/admin/login';
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check if we're on the login page first
    const onLoginPage = await isLoginPage();

    // If on login page, render without auth check and without sidebar
    if (onLoginPage) {
        return <>{children}</>;
    }

    // Verify admin session - redirect to login if not authenticated
    const session = await verifyAdminSession();

    if (!session) {
        redirect('/admin/login');
    }

    return (
        <AdminLayoutContent user={session}>
            {children}
        </AdminLayoutContent>
    );
}
