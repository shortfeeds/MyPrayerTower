import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Bell, Search, Menu } from 'lucide-react';
import { cookies } from 'next/headers';
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

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4 lg:hidden">
                        {/* Space for mobile menu button which is in sidebar */}
                        <div className="w-10" />
                    </div>

                    <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {(session.name as string)?.[0] || 'A'}
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{session.name as string || 'Admin'}</p>
                                <p className="text-xs text-gray-500">{session.role as string || 'Administrator'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
