'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/lib/hooks'
import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    Shield,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    UserX,
    FileText,
    Settings,
    BarChart3,
    Activity
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        total_users: 0,
        total_organizers: 0,
        total_events: 0,
        active_events: 0,
        total_bookings: 0,
        total_revenue: 0,
        pending_applications: 0,
    })
    const [applications, setApplications] = useState<any[]>([])
    const [recentUsers, setRecentUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // TODO: Replace with actual API calls
            // Mock data for now
            setStats({
                total_users: 5247,
                total_organizers: 342,
                total_events: 1856,
                active_events: 428,
                total_bookings: 12489,
                total_revenue: 1847562.50,
                pending_applications: 8,
            })

            setApplications([
                {
                    id: 1,
                    user: {
                        id: 123,
                        username: 'johnevents',
                        email: 'john@events.com',
                        first_name: 'John',
                        last_name: 'Smith'
                    },
                    application_reason: 'I have been organizing community events for 5 years and would like to expand my reach through QuickTix.',
                    status: 'pending',
                    applied_at: '2024-12-15T10:00:00Z'
                },
                {
                    id: 2,
                    user: {
                        id: 124,
                        username: 'sarahpro',
                        email: 'sarah@pro.com',
                        first_name: 'Sarah',
                        last_name: 'Johnson'
                    },
                    application_reason: 'Professional event planner with corporate event experience. Want to host tech conferences.',
                    status: 'pending',
                    applied_at: '2024-12-14T15:30:00Z'
                },
            ])

            setRecentUsers([
                {
                    id: 456,
                    username: 'newuser1',
                    email: 'new1@example.com',
                    first_name: 'Mike',
                    last_name: 'Davis',
                    role: 'user',
                    date_joined: '2024-12-20T09:00:00Z'
                },
                {
                    id: 457,
                    username: 'newuser2',
                    email: 'new2@example.com',
                    first_name: 'Emily',
                    last_name: 'Brown',
                    role: 'user',
                    date_joined: '2024-12-19T14:30:00Z'
                },
            ])

            setLoading(false)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleApproveApplication = async (id: number) => {
        // TODO: Implement API call
        console.log('Approve application:', id)
    }

    const handleRejectApplication = async (id: number) => {
        // TODO: Implement API call
        console.log('Reject application:', id)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Admin Dashboard
                        </h2>
                        <p className="text-gray-600">Welcome back, {user?.first_name || user?.username}!</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span>System Status: All systems operational</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/80 mb-1">Total Users</p>
                    <p className="text-3xl font-bold">{stats.total_users.toLocaleString()}</p>
                    <p className="text-xs text-white/60 mt-2">+234 this month</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/80 mb-1">Organizers</p>
                    <p className="text-3xl font-bold">{stats.total_organizers}</p>
                    <p className="text-xs text-white/60 mt-2">+18 this month</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/80 mb-1">Total Events</p>
                    <p className="text-3xl font-bold">{stats.total_events.toLocaleString()}</p>
                    <p className="text-xs text-white/60 mt-2">{stats.active_events} active</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/80 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold">${(stats.total_revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-white/60 mt-2">+$45K this month</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <Users className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Manage Users</span>
                    </Link>
                    <Link
                        href="/admin/events"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Manage Events</span>
                    </Link>
                    <Link
                        href="/admin/applications"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <FileText className="w-5 h-5 text-primary-600" />
                        <div>
                            <div className="font-medium text-gray-900">Applications</div>
                            {stats.pending_applications > 0 && (
                                <span className="text-xs text-red-600">{stats.pending_applications} pending</span>
                            )}
                        </div>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <Settings className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Settings</span>
                    </Link>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Pending Applications */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Pending Applications</h3>
                        </div>
                        <Link href="/admin/applications" className="text-primary-600 font-semibold hover:text-primary-700 text-sm">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No pending applications</p>
                            </div>
                        ) : (
                            applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="p-4 border-2 border-gray-100 rounded-xl hover:border-yellow-200 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                {app.user.first_name} {app.user.last_name}
                                            </h4>
                                            <p className="text-sm text-gray-500">{app.user.email}</p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                            <Clock className="w-3 h-3" />
                                            Pending
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {app.application_reason}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            Applied {formatDate(app.applied_at)}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApproveApplication(app.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectApplication(app.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
                        </div>
                        <Link href="/admin/users" className="text-primary-600 font-semibold hover:text-primary-700 text-sm">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.first_name[0]}{user.last_name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {user.first_name} {user.last_name}
                                        </h4>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 mb-1">
                                        {user.role}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(user.date_joined)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Platform Health */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Platform Health</h3>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-4 border-2 border-gray-100 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Server Status</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">Online</p>
                    </div>

                    <div className="p-4 border-2 border-gray-100 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Database</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">Healthy</p>
                    </div>

                    <div className="p-4 border-2 border-gray-100 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">API Response</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">45ms</p>
                    </div>

                    <div className="p-4 border-2 border-gray-100 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Uptime</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">99.9%</p>
                    </div>
                </div>
            </div>
        </div>
    )
}