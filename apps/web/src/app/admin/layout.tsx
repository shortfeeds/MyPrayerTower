import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Bell, Search, Menu } from 'lucide-react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

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

// Check if the current path is the login page
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
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Top Header Bar */}
                <AdminHeader user={session} />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
