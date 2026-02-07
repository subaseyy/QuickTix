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
                await api.put(`/events/${editingEvent.id}/`, formData);
                alert('Event updated successfully');
            } else {
                await api.post('/events/', formData);
                alert('Event created successfully');
            }
            setShowForm(false);
            setEditingEvent(null);
            resetForm();
            fetchEvents();
        } catch (error: any) {
            alert(error.response?.data?.detail || 'Failed to save event');
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
            price: event.price,
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
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                        >
                            {showForm ? 'Cancel' : 'Create Event'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                            <h2 className="text-xl font-bold mb-4">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="movie">Movie</option>
                                            <option value="concert">Concert</option>
                                            <option value="sports">Sports</option>
                                            <option value="theater">Theater</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Venue</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.venue}
                                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.total_seats}
                                            onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Time</label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
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
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events.map((event: any) => (
                                        <tr key={event.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{event.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{event.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{event.available_seats}/{event.total_seats}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${event.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                <button
                                                    onClick={() => handleEdit(event)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id)}
                                                    className="text-red-600 hover:text-red-900"
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