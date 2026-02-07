'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function EventDetailPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id;

    const [event, setEvent] = useState<any>(null);
    const [seats, setSeats] = useState(1);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/events/${eventId}/`);
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        setBooking(true);
        try {
            const response = await api.post('/bookings/', {
                event: parseInt(eventId as string), // Ensure it's a number
                seats_booked: seats,
            });

            const bookingData = response.data;
            router.push(`/checkout?booking_id=${bookingData.id}`);
        } catch (error: any) {
            console.error('Booking error:', error.response?.data); // Debug log
            const errorMsg = error.response?.data?.seats_booked?.[0]
                || error.response?.data?.non_field_errors?.[0]
                || error.response?.data?.event?.[0]
                || JSON.stringify(error.response?.data)
                || 'Booking failed';
            alert(errorMsg);
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </>
        );
    }

    if (!event) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-600">Event not found</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <div className="mb-6">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                                    {event.category}
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {event.title}
                            </h1>

                            <p className="text-gray-600 mb-6">{event.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center text-gray-700">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Venue</p>
                                        <p className="font-semibold">{event.venue}</p>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="font-semibold">
                                            {new Date(event.date).toLocaleDateString()} at {event.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Available Seats</p>
                                        <p className="font-semibold">{event.available_seats} seats</p>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Price per Seat</p>
                                        <p className="font-semibold text-2xl text-indigo-600">${event.price}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Seats
                                </label>
                                <div className="flex items-center space-x-4 mb-4">
                                    <button
                                        onClick={() => setSeats(Math.max(1, seats - 1))}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-semibold w-12 text-center">{seats}</span>
                                    <button
                                        onClick={() => setSeats(Math.min(event.available_seats, seats + 1))}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-medium">Total:</span>
                                    <span className="text-3xl font-bold text-indigo-600">
                                        ${(parseFloat(event.price) * seats).toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    disabled={booking || event.available_seats === 0}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {booking ? 'Processing...' : event.available_seats === 0 ? 'Sold Out' : 'Continue to Payment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}