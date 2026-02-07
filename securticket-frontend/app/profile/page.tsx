'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    // Profile form
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');

    // Password form
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        console.log('Profile page mounted, checking auth...');
        if (!isAuthenticated()) {
            console.log('Not authenticated, redirecting to login');
            router.push('/login');
            return;
        }
        console.log('Authenticated, fetching profile...');
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            console.log('Calling /auth/profile/ endpoint...');
            const response = await api.get('/auth/profile/');
            console.log('Profile response:', response.data);

            setUser(response.data);
            setProfileData({
                first_name: response.data.first_name || '',
                last_name: response.data.last_name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
            });
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            console.error('Error response:', error.response?.data);
            setProfileError('Failed to load profile. Please try refreshing the page.');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        setProfileSuccess('');

        try {
            const response = await api.put('/auth/profile/update/', profileData);
            setUser(response.data);
            setProfileSuccess('Profile updated successfully!');

            // Update user in cookies
            const currentUser = getUser();
            if (currentUser) {
                import('js-cookie').then(Cookies => {
                    Cookies.default.set('user', JSON.stringify(response.data), { expires: 7 });
                });
            }

            setTimeout(() => setProfileSuccess(''), 3000);
        } catch (error: any) {
            const errors = error.response?.data;
            const errorMessage = errors?.detail
                || errors?.email?.[0]
                || errors?.phone?.[0]
                || 'Failed to update profile';
            setProfileError(errorMessage);
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');

        try {
            await api.post('/auth/change-password/', passwordData);
            setPasswordSuccess('Password changed successfully!');
            setPasswordData({ old_password: '', new_password: '' });
            setTimeout(() => setPasswordSuccess(''), 3000);
        } catch (error: any) {
            const errors = error.response?.data;
            const errorMessage = errors?.old_password?.[0]
                || errors?.new_password?.[0]
                || errors?.detail
                || 'Failed to change password';
            setPasswordError(errorMessage);
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading profile...</p>
                    </div>
                </div>
            </>
        );
    }

    if (profileError && !user) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
                            <p className="font-semibold mb-2">Error Loading Profile</p>
                            <p className="text-sm">{profileError}</p>
                            <button
                                onClick={fetchProfile}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

                    {/* User Info Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center">
                                <span className="text-3xl font-bold text-indigo-600">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user?.username || 'User'}</h2>
                                <p className="text-gray-600 text-lg">{user?.email || 'No email'}</p>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${user?.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {user?.role === 'admin' ? 'Admin' : 'Customer'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`px-6 py-4 text-base font-semibold ${activeTab === 'profile'
                                            ? 'border-b-2 border-indigo-600 text-indigo-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Profile Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`px-6 py-4 text-base font-semibold ${activeTab === 'password'
                                            ? 'border-b-2 border-indigo-600 text-indigo-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Change Password
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    {profileSuccess && (
                                        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg font-medium">
                                            ✓ {profileSuccess}
                                        </div>
                                    )}
                                    {profileError && (
                                        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg font-medium">
                                            ✗ {profileError}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.first_name}
                                                onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
                                                placeholder="Enter first name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.last_name}
                                                onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={profileLoading}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {profileLoading ? 'Updating...' : 'Update Profile'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Password Tab */}
                            {activeTab === 'password' && (
                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    {passwordSuccess && (
                                        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg font-medium">
                                            ✓ {passwordSuccess}
                                        </div>
                                    )}
                                    {passwordError && (
                                        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg font-medium">
                                            ✗ {passwordError}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.old_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
                                            placeholder="Enter new password"
                                        />
                                        <PasswordStrengthMeter password={passwordData.new_password} />
                                    </div>

                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                                        <h4 className="font-bold text-blue-900 mb-3 text-base">Password Requirements:</h4>
                                        <ul className="text-sm text-blue-800 space-y-2 font-medium">
                                            <li className="flex items-center">
                                                <span className="mr-2">✓</span> At least 8 characters long
                                            </li>
                                            <li className="flex items-center">
                                                <span className="mr-2">✓</span> Contains uppercase and lowercase letters
                                            </li>
                                            <li className="flex items-center">
                                                <span className="mr-2">✓</span> Contains at least one number
                                            </li>
                                            <li className="flex items-center">
                                                <span className="mr-2">✓</span> Contains at least one special character
                                            </li>
                                            <li className="flex items-center">
                                                <span className="mr-2">✓</span> Cannot reuse your last 5 passwords
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={passwordLoading}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {passwordLoading ? 'Changing Password...' : 'Change Password'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}