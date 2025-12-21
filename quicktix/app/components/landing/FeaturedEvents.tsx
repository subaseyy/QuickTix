'use client'

import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedEvents() {
    const events = [
        {
            id: 1,
            title: 'Tech Conference 2025',
            category: 'Conference',
            date: 'March 15, 2025',
            location: 'San Francisco, CA',
            price: 299,
            attendees: 450,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            badge: 'Hot',
            badgeColor: 'bg-red-500',
        },
        {
            id: 2,
            title: 'Summer Music Festival',
            category: 'Music',
            date: 'June 20, 2025',
            location: 'Los Angeles, CA',
            price: 149,
            attendees: 2500,
            image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
            badge: 'Featured',
            badgeColor: 'bg-purple-500',
        },
        {
            id: 3,
            title: 'Art Exhibition: Modern Visions',
            category: 'Art',
            date: 'April 10, 2025',
            location: 'New York, NY',
            price: 45,
            attendees: 180,
            image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800',
        },
        {
            id: 4,
            title: 'Food & Wine Tasting',
            category: 'Food',
            date: 'May 5, 2025',
            location: 'Chicago, IL',
            price: 89,
            attendees: 120,
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        },
        {
            id: 5,
            title: 'Startup Networking Event',
            category: 'Networking',
            date: 'March 25, 2025',
            location: 'Austin, TX',
            price: 0,
            attendees: 300,
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
            badge: 'Free',
            badgeColor: 'bg-green-500',
        },
        {
            id: 6,
            title: 'Jazz Night Under Stars',
            category: 'Music',
            date: 'July 15, 2025',
            location: 'Nashville, TN',
            price: 65,
            attendees: 850,
            image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
        },
    ]

    return (
        <section className="section bg-gray-50">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Featured <span className="gradient-text">Events</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover the hottest events happening around you. From concerts to conferences,
                        we've got something for everyone.
                    </p>
                </div>

                {/* Events Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            className="card group cursor-pointer animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Event Image */}
                            <div className="relative h-56 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${event.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Badge */}
                                {event.badge && (
                                    <div className={`absolute top-4 right-4 ${event.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                                        {event.badge}
                                    </div>
                                )}

                                {/* Category */}
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                                        {event.category}
                                    </span>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                                    {event.title}
                                </h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                                        <span className="text-sm">{event.date}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                                        <span className="text-sm">{event.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Users className="w-4 h-4 mr-2 text-primary-600" />
                                        <span className="text-sm">{event.attendees} attending</span>
                                    </div>
                                </div>

                                {/* Price & CTA */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        {event.price === 0 ? (
                                            <span className="text-2xl font-bold text-green-600">Free</span>
                                        ) : (
                                            <>
                                                <span className="text-sm text-gray-500">From</span>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    ${event.price}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <button className="flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200">
                                        View Details
                                        <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center animate-fade-in">
                    <Link href="/events" className="btn btn-primary btn-lg">
                        View All Events
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    )
}