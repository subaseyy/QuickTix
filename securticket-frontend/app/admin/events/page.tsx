'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAdmin } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function AdminEventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'movie',
        venue: '',
        date: '',
        time: '',
        total_seats: 100,
        available_seats: 100,  // Add this field
        price: 0,
    });

    useEffect(() => {
        if (!isAdmin()) {
            router.push('/events');
            return;
        }
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events/');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                // When editing, send available_seats from the form
                await api.put(`/events/${editingEvent.id}/`, formData);
                alert('Event updated successfully');
            } else {
                // When creating, available_seats will equal total_seats
                const createData = { ...formData, available_seats: formData.total_seats };
                await api.post('/events/', createData);
                alert('Event created successfully');
            }
            setShowForm(false);
            setEditingEvent(null);
            resetForm();
            fetchEvents();
        } catch (error: any) {
            console.error('Error saving event:', error.response?.data);
            const errorMsg = error.response?.data?.detail
                || JSON.stringify(error.response?.data)
                || 'Failed to save event';
            alert(errorMsg);
        }
    };

    const handleEdit = (event: any) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            category: event.category,
            venue: event.venue,
            date: event.date,
            time: event.time,
            total_seats: event.total_seats,
            available_seats: event.available_seats,  // Include this
            price: parseFloat(event.price),
        });
        setShowForm(true);
    };

    const handleDelete = async (eventId: number) => {
        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }
        try {
            await api.delete(`/events/${eventId}/`);
            alert('Event deleted successfully');
            fetchEvents();
        } catch (error) {
            alert('Failed to delete event');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'movie',
            venue: '',
            date: '',
            time: '',
            total_seats: 100,
            available_seats: 100,
            price: 0,
        });
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditingEvent(null);
                                resetForm();
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-bold"
                        >
                            {showForm ? 'Cancel' : 'Create Event'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-200">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-900 font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-900 font-semibold"
                                        >
                                            <option value="movie">Movie</option>
                                            <option value="concert">Concert</option>
                                            <option value="sports">Sports</option>
                                            <option value="theater">Theater</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-900 font-semibold"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Venue</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.venue}
                                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-900 font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Total Seats</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.total_seats}
                                            onChange={(e) => {
                                                const newTotal = parseInt(e.target.value);
                                                setFormData({
                                                    ...formData,
                                                    total_seats: newTotal,
                                                    // When creating new event, available = total
                                                    available_seats: editingEvent ? formData.available_seats : newTotal
                                                });
                                            }}
                                            className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-900 font-semibold"
                                        />
                                    </div>
                                </div>

                                {editingEvent && (
                                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-md p-4">
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Available Seats (Current: {formData.available_seats})
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max={formData.total_seats}
                                            value={formData.available_seats}
                                            onChange={(e) => setFormData({ ...formData, available_seats: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-900 font-semibold"
                                        />
                                        <p className="mt-2 text-sm text-yellow-800 font-semibold">
                                            ⚠️ Booked seats: {formData.total_seats - formData.available_seats}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-900 font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Time</label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-900 font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Price ($)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-md text-gray-900 font-semibold"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md font-bold text-base"
                                >
                                    {editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden border-2 border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Seats</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events.map((event: any) => (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{event.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{event.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                                                {new Date(event.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                                                {event.available_seats}/{event.total_seats}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-600">${event.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                <button
                                                    onClick={() => handleEdit(event)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-bold"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id)}
                                                    className="text-red-600 hover:text-red-900 font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}