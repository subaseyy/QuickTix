'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, logout, isAdmin } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setUser(getUser());
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) {
        return null;
    }

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-indigo-600">
                            SecureTicket
                        </Link>
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link
                                href="/events"
                                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Events
                            </Link>
                            {user && (
                                <Link
                                    href="/dashboard"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    My Bookings
                                </Link>
                            )}
                            {isAdmin() && (
                                <>
                                    <Link
                                        href="/admin/events"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Manage Events
                                    </Link>
                                    <Link
                                        href="/admin/logs"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Activity Logs
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-700">
                                    Hello, <span className="font-semibold">{user.username}</span>
                                    {user.role === 'admin' && (
                                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded">
                                            Admin
                                        </span>
                                    )}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}