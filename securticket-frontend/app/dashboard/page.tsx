'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings/my_bookings/');
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: number) => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await api.post(`/bookings/${bookingId}/cancel/`);
            alert('Booking cancelled successfully');
            fetchBookings();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to cancel booking');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-600 mb-4">No bookings yet</p>
                            <button
                                onClick={() => router.push('/events')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                            >
                                Browse Events
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking: any) => (
                                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 mr-3">
                                                    {booking.event_details.title}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">
                                                Booking Reference: <span className="font-mono font-semibold">{booking.booking_reference}</span>
                                            </p>
                                            <p className="text-gray-600">
                                                Date: {new Date(booking.event_details.date).toLocaleDateString()} at {booking.event_details.time}
                                            </p>
                                            <p className="text-gray-600">Venue: {booking.event_details.venue}</p>
                                            <p className="text-gray-600">Seats: {booking.seats_booked}</p>
                                            <p className="text-gray-600">
                                                Booked on: {new Date(booking.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-indigo-600 mb-4">
                                                ${booking.total_price}
                                            </p>
                                            {booking.status === 'pending' && (
                                                <button
                                                    onClick={() => router.push(`/checkout?booking_id=${booking.id}`)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md mb-2 w-full"
                                                >
                                                    Complete Payment
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full"
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}