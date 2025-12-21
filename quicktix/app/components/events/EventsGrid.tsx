'use client'

import { Calendar, MapPin, Users, Heart, Share2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function EventsGrid() {
    const [likedEvents, setLikedEvents] = useState<number[]>([])

    const events = [
        {
            id: 1,
            title: 'Summer Music Festival 2025',
            category: 'Music',
            date: 'June 20, 2025',
            time: '6:00 PM',
            location: 'Central Park, New York',
            venue: 'Main Stage',
            price: 149,
            originalPrice: 199,
            attendees: 2500,
            image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
            badge: 'Hot',
            badgeColor: 'bg-red-500',
            organizer: 'MusicEvents Inc.',
            availableTickets: 450,
        },
        {
            id: 2,
            title: 'Tech Conference 2025',
            category: 'Conference',
            date: 'March 15, 2025',
            time: '9:00 AM',
            location: 'San Francisco, CA',
            venue: 'Convention Center',
            price: 299,
            attendees: 1200,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            badge: 'Featured',
            badgeColor: 'bg-purple-500',
            organizer: 'TechWorld',
            availableTickets: 200,
        },
        {
            id: 3,
            title: 'Art Exhibition: Modern Visions',
            category: 'Art',
            date: 'April 10, 2025',
            time: '2:00 PM',
            location: 'New York, NY',
            venue: 'Gallery 42',
            price: 45,
            attendees: 180,
            image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800',
            organizer: 'Art House',
            availableTickets: 80,
        },
        {
            id: 4,
            title: 'Food & Wine Tasting Experience',
            category: 'Food',
            date: 'May 5, 2025',
            time: '7:00 PM',
            location: 'Chicago, IL',
            venue: 'Grand Hotel',
            price: 89,
            attendees: 120,
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
            organizer: 'Gourmet Events',
            availableTickets: 35,
        },
        {
            id: 5,
            title: 'Startup Networking Mixer',
            category: 'Networking',
            date: 'March 25, 2025',
            time: '6:30 PM',
            location: 'Austin, TX',
            venue: 'Innovation Hub',
            price: 0,
            attendees: 300,
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
            badge: 'Free',
            badgeColor: 'bg-green-500',
            organizer: 'Startup Austin',
            availableTickets: 150,
        },
        {
            id: 6,
            title: 'Jazz Night Under the Stars',
            category: 'Music',
            date: 'July 15, 2025',
            time: '8:00 PM',
            location: 'Nashville, TN',
            venue: 'Outdoor Amphitheater',
            price: 65,
            attendees: 850,
            image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
            organizer: 'Jazz Society',
            availableTickets: 320,
        },
        {
            id: 7,
            title: 'Digital Marketing Summit',
            category: 'Business',
            date: 'April 20, 2025',
            time: '10:00 AM',
            location: 'Los Angeles, CA',
            venue: 'Downtown Conference Center',
            price: 199,
            attendees: 500,
            image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
            organizer: 'Marketing Pro',
            availableTickets: 125,
        },
        {
            id: 8,
            title: 'Comedy Night Special',
            category: 'Comedy',
            date: 'March 30, 2025',
            time: '9:00 PM',
            location: 'Boston, MA',
            venue: 'Laugh Factory',
            price: 55,
            attendees: 200,
            image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
            organizer: 'Comedy Central',
            availableTickets: 60,
        },
        {
            id: 9,
            title: 'Yoga & Wellness Retreat',
            category: 'Wellness',
            date: 'May 12, 2025',
            time: '7:00 AM',
            location: 'Miami, FL',
            venue: 'Beachside Resort',
            price: 120,
            attendees: 80,
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
            organizer: 'Wellness Co.',
            availableTickets: 25,
        },
    ]

    const toggleLike = (eventId: number) => {
        if (likedEvents.includes(eventId)) {
            setLikedEvents(likedEvents.filter((id) => id !== eventId))
        } else {
            setLikedEvents([...likedEvents, eventId])
        }
    }

    return (
        <div className="space-y-6">
            {/* Results Count */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    All Events <span className="text-gray-500 font-normal">({events.length})</span>
                </h2>
            </div>

            {/* Events Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                    <div
                        key={event.id}
                        className="card group animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Event Image */}
                        <div className="relative h-48 overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${event.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Badge */}
                            {event.badge && (
                                <div className={`absolute top-4 right-4 ${event.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                                    {event.badge}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => toggleLike(event.id)}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${likedEvents.includes(event.id)
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/90 text-gray-700 hover:bg-white'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${likedEvents.includes(event.id) ? 'fill-current' : ''}`} />
                                </button>
                                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors duration-200">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Category */}
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900">
                                    {event.category}
                                </span>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-5">
                            <Link href={`/events/${event.id}`}>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                                    {event.title}
                                </h3>
                            </Link>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Calendar className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                                    <span>{event.date} • {event.time}</span>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Users className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                                    <span>{event.attendees} attending • {event.availableTickets} left</span>
                                </div>
                            </div>

                            {/* Price & CTA */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div>
                                    {event.price === 0 ? (
                                        <span className="text-xl font-bold text-green-600">Free</span>
                                    ) : (
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-gray-900">
                                                    ${event.price}
                                                </span>
                                                {event.originalPrice && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ${event.originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">per ticket</span>
                                        </div>
                                    )}
                                </div>
                                <Link
                                    href={`/events/${event.id}`}
                                    className="flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200 text-sm"
                                >
                                    View
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {events.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                    <button className="btn btn-primary btn-md">Clear All Filters</button>
                </div>
            )}
        </div>
    )
}