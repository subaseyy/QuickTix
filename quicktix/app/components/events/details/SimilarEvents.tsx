'use client'

import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function SimilarEvents() {
    const similarEvents = [
        {
            id: 2,
            title: 'Jazz Under the Stars',
            category: 'Music',
            date: 'July 15, 2025',
            location: 'Nashville, TN',
            price: 65,
            image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400',
        },
        {
            id: 3,
            title: 'Electronic Music Festival',
            category: 'Music',
            date: 'August 5, 2025',
            location: 'Miami, FL',
            price: 129,
            image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
        },
        {
            id: 4,
            title: 'Rock Legends Tour',
            category: 'Concert',
            date: 'September 10, 2025',
            location: 'Los Angeles, CA',
            price: 199,
            image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
        },
        {
            id: 5,
            title: 'Indie Music Showcase',
            category: 'Music',
            date: 'June 30, 2025',
            location: 'Austin, TX',
            price: 45,
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        },
    ]

    return (
        <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Similar Events</h2>
                <Link
                    href="/events?category=music"
                    className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
                >
                    View All
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarEvents.map((event, index) => (
                    <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="card group animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Event Image */}
                        <div className="relative h-48 overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${event.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Category */}
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900">
                                    {event.category}
                                </span>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                                {event.title}
                            </h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Calendar className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div>
                                    <div className="text-xl font-bold text-gray-900">
                                        ${event.price}
                                    </div>
                                    <span className="text-xs text-gray-500">per ticket</span>
                                </div>
                                <span className="text-primary-600 font-semibold text-sm flex items-center">
                                    View
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}