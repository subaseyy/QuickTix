'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/lib/hooks'
import {
    Ticket,
    Calendar,
    DollarSign,
    TrendingUp,
    Clock,
    MapPin,
    Search,
    Filter,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function UserDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        total_bookings: 0,
        total_tickets: 0,
        total_spent: 0,
        upcoming_events: 0,
    })
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all')

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // TODO: Replace with actual API calls
            // Mock data for now
            setStats({
                total_bookings: 12,
                total_tickets: 24,
                total_spent: 1847.50,
                upcoming_events: 3,
            })

            setBookings([
                {
                    id: 1,
                    booking_reference: 'BK-20231215-A1B2',
                    event: {
                        id: 1,
                        title: 'Summer Music Festival 2025',
                        event_date_time: '2025-06-20T18:00:00Z',
                        venue: 'Central Park, New York',
                        image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400'
                    },
                    tickets_count: 2,
                    total_amount: 298.00,
                    status: 'confirmed',
                    booking_date: '2024-12-15T10:30:00Z'
                },
                {
                    id: 2,
                    booking_reference: 'BK-20231210-C3D4',
                    event: {
                        id: 2,
                        title: 'Tech Conference 2025',
                        event_date_time: '2025-03-15T09:00:00Z',
                        venue: 'San Francisco Convention Center',
                        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
                    },
                    tickets_count: 1,
                    total_amount: 299.00,
                    status: 'confirmed',
                    booking_date: '2024-12-10T14:20:00Z'
                },
                {
                    id: 3,
                    booking_reference: 'BK-20231201-E5F6',
                    event: {
                        id: 3,
                        title: 'Art Exhibition: Modern Visions',
                        event_date_time: '2024-11-10T14:00:00Z',
                        venue: 'Gallery 42, New York',
                        image_url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400'
                    },
                    tickets_count: 2,
                    total_amount: 90.00,
                    status: 'cancelled',
                    booking_date: '2024-12-01T09:15:00Z'
                },
            ])

            setLoading(false)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                    </span>
                )
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" />
                        Cancelled
                    </span>
                )
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        <AlertCircle className="w-3 h-3" />
                        Pending
                    </span>
                )
            default:
                return null
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

    const isUpcoming = (dateString: string) => {
        return new Date(dateString) > new Date()
    }

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'upcoming') return booking.status === 'confirmed' && isUpcoming(booking.event.event_date_time)
        if (filter === 'past') return !isUpcoming(booking.event.event_date_time)
        if (filter === 'cancelled') return booking.status === 'cancelled'
        return true
    })

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
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.first_name || user?.username}! 👋
                </h2>
                <p className="text-gray-600">
                    Here's what's happening with your events
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-blue-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total_bookings}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Tickets Purchased</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total_tickets}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">${stats.total_spent.toFixed(2)}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Upcoming Events</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.upcoming_events}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/events"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <Search className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Browse Events</span>
                    </Link>
                    <Link
                        href="/dashboard/bookings"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <Ticket className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">My Bookings</span>
                    </Link>
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <Filter className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Edit Profile</span>
                    </Link>
                    <Link
                        href="/support"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <AlertCircle className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Get Help</span>
                    </Link>
                </div>
            </div>

            {/* My Bookings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">My Bookings</h3>
                    <Link href="/dashboard/bookings" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'all'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All Bookings
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'upcoming'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'past'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Past Events
                    </button>
                    <button
                        onClick={() => setFilter('cancelled')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'cancelled'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Cancelled
                    </button>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">No bookings found</p>
                            <p className="text-gray-400 mb-6">Start exploring events and book your first ticket!</p>
                            <Link href="/events" className="btn btn-primary btn-md">
                                Browse Events
                            </Link>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex flex-col sm:flex-row gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all duration-200"
                            >
                                {/* Event Image */}
                                <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${booking.event.image_url})` }}
                                    />
                                </div>

                                {/* Booking Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">
                                                {booking.event.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">Ref: {booking.booking_reference}</p>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                                            {formatDate(booking.event.event_date_time)}
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                                            {booking.event.venue}
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Ticket className="w-4 h-4 mr-2 text-primary-600" />
                                            {booking.tickets_count} {booking.tickets_count === 1 ? 'ticket' : 'tickets'} • ${booking.total_amount.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href={`/events/${booking.event.id}`}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                        >
                                            View Event
                                        </Link>
                                        <span className="text-gray-300">•</span>
                                        <Link
                                            href={`/dashboard/bookings/${booking.id}`}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                        >
                                            View Booking
                                        </Link>
                                        {booking.status === 'confirmed' && isUpcoming(booking.event.event_date_time) && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <button className="text-sm font-medium text-red-600 hover:text-red-700">
                                                    Cancel Booking
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}