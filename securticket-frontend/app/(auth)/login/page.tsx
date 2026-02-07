'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { setAuth } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [lockInfo, setLockInfo] = useState<any>(null);
    const [countdown, setCountdown] = useState('');
    const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

    // Load lockout info from localStorage on mount
    useEffect(() => {
        const savedLockInfo = localStorage.getItem('lockout_info');
        if (savedLockInfo) {
            try {
                const lockData = JSON.parse(savedLockInfo);
                const lockTime = new Date(lockData.locked_until).getTime();
                const now = new Date().getTime();

                if (lockTime > now) {
                    // Still locked
                    setIsLocked(true);
                    setLockInfo(lockData);
                    setError(lockData.error || 'Account is locked');
                    setFormData({ ...formData, username: lockData.username || '' });
                } else {
                    // Lock expired, clear it
                    localStorage.removeItem('lockout_info');
                }
            } catch (e) {
                localStorage.removeItem('lockout_info');
            }
        }
    }, []);

    // Countdown timer for locked accounts
    useEffect(() => {
        if (lockInfo?.locked_until) {
            const timer = setInterval(() => {
                const now = new Date().getTime();
                const lockTime = new Date(lockInfo.locked_until).getTime();
                const distance = lockTime - now;

                if (distance < 0) {
                    clearInterval(timer);
                    setIsLocked(false);
                    setLockInfo(null);
                    setCountdown('');
                    setError('Account unlocked. You may now try logging in again.');
                    localStorage.removeItem('lockout_info');

                    // Clear success message after 5 seconds
                    setTimeout(() => setError(''), 5000);
                } else {
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setCountdown(`${minutes}m ${seconds}s`);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [lockInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const saveLockoutInfo = (data: any, username: string) => {
        const lockoutData = {
            ...data,
            username: username,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('lockout_info', JSON.stringify(lockoutData));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setAttemptsRemaining(null);

        try {
            const response = await api.post('/auth/login/', formData);
            const { access, refresh, user } = response.data;

            // Clear any lockout info on successful login
            localStorage.removeItem('lockout_info');

            setAuth(access, refresh, user);

            // Redirect based on role
            if (user.role === 'admin') {
                router.push('/admin/events');
            } else {
                router.push('/events');
            }
        } catch (err: any) {
            console.error('Login error:', err.response?.data);

            if (err.response?.status === 403 && err.response?.data?.locked) {
                // Account is locked
                const lockData = err.response.data;
                setIsLocked(true);
                setLockInfo(lockData);
                setError(lockData.error);
                saveLockoutInfo(lockData, formData.username);
            } else if (err.response?.status === 429) {
                setError('Too many login attempts from this IP. Please try again later.');
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);

                // Show attempts remaining if available
                if (err.response.data.attempts_remaining !== undefined) {
                    setAttemptsRemaining(err.response.data.attempts_remaining);
                }
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center mb-4">
                        <div className="bg-indigo-600 rounded-full p-3">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
                        Sign in to SecureTicket
                    </h2>
                    <p className="mt-2 text-center text-base text-gray-700 font-medium">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-500">
                            Register here
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Account Locked Warning - PERSISTENT */}
                    {isLocked && lockInfo && (
                        <div className="bg-red-50 border-4 border-red-600 rounded-xl p-5 shadow-lg">
                            <div className="flex items-center mb-3">
                                <div className="bg-red-600 rounded-full p-2 mr-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <strong className="font-bold text-xl text-red-900">🔒 Account Locked</strong>
                            </div>
                            <p className="font-semibold text-red-900 text-base mb-3">{error}</p>
                            {countdown && (
                                <div className="bg-red-600 rounded-lg px-4 py-3 mt-3 animate-pulse">
                                    <p className="text-center font-bold text-2xl text-white">
                                        ⏱️ {countdown}
                                    </p>
                                    <p className="text-center text-sm text-red-100 font-semibold mt-1">
                                        Time remaining until unlock
                                    </p>
                                </div>
                            )}
                            <div className="mt-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
                                <p className="text-sm text-yellow-900 font-semibold">
                                    💡 <strong>Tip:</strong> This page will automatically unlock when the timer expires. You can leave this page open and come back.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Attempts Remaining Warning */}
                    {attemptsRemaining !== null && attemptsRemaining > 0 && !isLocked && (
                        <div className="bg-yellow-50 border-3 border-yellow-500 text-yellow-900 px-4 py-3 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <strong className="font-bold text-lg">Warning!</strong>
                                    <p className="font-semibold text-base">
                                        <span className="text-2xl font-bold text-yellow-700">{attemptsRemaining}</span> attempts remaining before lockout
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Regular Error Messages */}
                    {error && !isLocked && !error.includes('unlocked') && (
                        <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg">
                            <p className="font-bold text-base">{error}</p>
                        </div>
                    )}

                    {/* Success Message (unlocked) */}
                    {error && error.includes('unlocked') && (
                        <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-lg">
                            <p className="font-bold text-base">✅ {error}</p>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-base font-bold text-gray-900 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLocked}
                                className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base disabled:bg-gray-200 disabled:cursor-not-allowed"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-base font-bold text-gray-900 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLocked}
                                className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base disabled:bg-gray-200 disabled:cursor-not-allowed"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || isLocked}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLocked ? (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Account Locked - Please Wait
                                </>
                            ) : loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                        <p className="font-bold text-blue-900 mb-2 text-base">🔐 Security Features:</p>
                        <ul className="text-sm text-blue-800 space-y-1 font-semibold">
                            <li>✓ Account locks for <strong>30 minutes</strong> after 5 failed attempts</li>
                            <li>✓ Lockout persists even if you refresh the page</li>
                            <li>✓ All login attempts are logged for security</li>
                        </ul>
                    </div>

                    <div className="text-sm text-center text-gray-700 bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                        {/* <p className="font-bold mb-2 text-base">Test Accounts:</p>
                        <p className="font-semibold">Admin: <code className="bg-white px-2 py-1 rounded font-mono text-sm border">subaseyy</code></p>
                        <p className="font-semibold">Customer: <code className="bg-white px-2 py-1 rounded font-mono text-sm border">customer1 / Customer@123</code></p> */}
                    </div>
                </form>
            </div>
        </div>
    );
}