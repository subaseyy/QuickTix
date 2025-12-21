'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/lib/hooks'
import {
    Calendar,
    Users,
    DollarSign,
    TrendingUp,
    Plus,
    Eye,
    Edit,
    Trash2,
    BarChart3,
    Ticket,
    Clock,
    MapPin,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function OrganizerDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        total_events: 0,
        total_bookings: 0,
        total_tickets_sold: 0,
        total_revenue: 0,
    })
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all')

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // TODO: Replace with actual API calls
            // Mock data for now
            setStats({
                total_events: 15,
                total_bookings: 247,
                total_tickets_sold: 589,
                total_revenue: 34567.50,
            })

            setEvents([
                {
                    id: 1,
                    title: 'Summer Music Festival 2025',
                    event_date_time: '2025-06-20T18:00:00Z',
                    venue: 'Central Park, New York',
                    ticket_price: 149.00,
                    total_capacity: 500,
                    available_tickets: 450,
                    tickets_sold: 50,
                    status: 'active',
                    image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
                    created_at: '2024-12-01T10:00:00Z'
                },
                {
                    id: 2,
                    title: 'Tech Conference 2025',
                    event_date_time: '2025-03-15T09:00:00Z',
                    venue: 'San Francisco Convention Center',
                    ticket_price: 299.00,
                    total_capacity: 200,
                    available_tickets: 125,
                    tickets_sold: 75,
                    status: 'active',
                    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
                    created_at: '2024-11-15T14:00:00Z'
                },
                {
                    id: 3,
                    title: 'Art Exhibition: Modern Visions',
                    event_date_time: '2024-11-10T14:00:00Z',
                    venue: 'Gallery 42, New York',
                    ticket_price: 45.00,
                    total_capacity: 100,
                    available_tickets: 0,
                    tickets_sold: 100,
                    status: 'completed',
                    image_url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400',
                    created_at: '2024-10-01T09:00:00Z'
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
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Active
                    </span>
                )
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                    </span>
                )
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" />
                        Cancelled
                    </span>
                )
            case 'draft':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        <AlertCircle className="w-3 h-3" />
                        Draft
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

    const calculateRevenue = (event: any) => {
        return (event.tickets_sold * event.ticket_price).toFixed(2)
    }

    const calculateOccupancy = (event: any) => {
        return ((event.tickets_sold / event.total_capacity) * 100).toFixed(0)
    }

    const filteredEvents = events.filter(event => {
        if (filter === 'all') return true
        return event.status === filter
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
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome back, {user?.first_name || user?.username}! 👋
                        </h2>
                        <p className="text-gray-600">
                            Here's your event management overview
                        </p>
                    </div>
                    <Link href="/organizer/events/create" className="btn btn-primary btn-lg flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Create Event
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/80 mb-1">Total Events</p>
                    <p className="text-3xl font-bold">{stats.total_events}</p>
                    <p className="text-xs text-white/60 mt-2">+3 from last month</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/80 mb-1">Tickets Sold</p>
                    <p className="text-3xl font-bold">{stats.total_tickets_sold}</p>
                    <p className="text-xs text-white/60 mt-2">+125 from last month</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/80 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold">${stats.total_revenue.toLocaleString()}</p>
                    <p className="text-xs text-white/60 mt-2">+$5,234 from last month</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/80 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold">{stats.total_bookings}</p>
                    <p className="text-xs text-white/60 mt-2">+42 from last month</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/organizer/events/create"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Create Event</span>
                    </Link>
                    <Link
                        href="/organizer/events"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">My Events</span>
                    </Link>
                    <Link
                        href="/organizer/analytics"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <BarChart3 className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Analytics</span>
                    </Link>
                    <Link
                        href="/organizer/profile"
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all duration-200"
                    >
                        <Users className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Profile</span>
                    </Link>
                </div>
            </div>

            {/* My Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">My Events</h3>
                    <Link href="/organizer/events" className="text-primary-600 font-semibold hover:text-primary-700">
                        View All
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
                        All Events
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'active'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'completed'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Completed
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

                {/* Events List */}
                <div className="space-y-4">
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">No events found</p>
                            <p className="text-gray-400 mb-6">Create your first event to get started!</p>
                            <Link href="/organizer/events/create" className="btn btn-primary btn-md">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Event
                            </Link>
                        </div>
                    ) : (
                        filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex flex-col lg:flex-row gap-4 p-6 border-2 border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all duration-200"
                            >
                                {/* Event Image */}
                                <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${event.image_url})` }}
                                    />
                                </div>

                                {/* Event Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">
                                                {event.title}
                                            </h4>
                                            {getStatusBadge(event.status)}
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                                            {formatDate(event.event_date_time)}
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                                            {event.venue}
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Ticket className="w-4 h-4 mr-2 text-primary-600" />
                                            {event.tickets_sold} / {event.total_capacity} sold ({calculateOccupancy(event)}%)
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <DollarSign className="w-4 h-4 mr-2 text-primary-600" />
                                            Revenue: ${calculateRevenue(event)}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gray-600">Tickets Sold</span>
                                            <span className="font-semibold text-gray-900">{calculateOccupancy(event)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-600 to-secondary-600"
                                                style={{ width: `${calculateOccupancy(event)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href={`/events/${event.id}`}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Link>
                                        <Link
                                            href={`/organizer/events/${event.id}/edit`}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Link>
                                        <Link
                                            href={`/organizer/events/${event.id}/analytics`}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            Analytics
                                        </Link>
                                        {event.status === 'active' && (
                                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                                                <Trash2 className="w-4 h-4" />
                                                Cancel
                                            </button>
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