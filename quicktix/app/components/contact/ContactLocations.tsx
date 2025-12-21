'use client'

import { MapPin, Phone, Mail } from 'lucide-react'

export default function ContactLocations() {
    const offices = [
        {
            city: 'San Francisco',
            type: 'Headquarters',
            address: '123 Market Street, Suite 500',
            city_state: 'San Francisco, CA 94103',
            phone: '+1 (415) 555-0100',
            email: 'sf@quicktix.com',
            hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
            image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=600',
        },
        {
            city: 'New York',
            type: 'Regional Office',
            address: '456 Broadway, Floor 12',
            city_state: 'New York, NY 10013',
            phone: '+1 (212) 555-0200',
            email: 'ny@quicktix.com',
            hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',
        },
        {
            city: 'Los Angeles',
            type: 'Regional Office',
            address: '789 Sunset Boulevard, Suite 300',
            city_state: 'Los Angeles, CA 90028',
            phone: '+1 (323) 555-0300',
            email: 'la@quicktix.com',
            hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
            image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600',
        },
    ]

    return (
        <section id="locations" className="section bg-gradient-to-br from-gray-50 to-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Our <span className="gradient-text">Locations</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Visit us at one of our offices or contact us remotely
                    </p>
                </div>

                {/* Offices Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {offices.map((office, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary-200 animate-fade-in"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Office Image */}
                            <div className="relative h-48 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                                    style={{ backgroundImage: `url(${office.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Type Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-900">
                                        {office.type}
                                    </span>
                                </div>

                                {/* City Name */}
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-2xl font-bold text-white">{office.city}</h3>
                                </div>
                            </div>

                            {/* Office Details */}
                            <div className="p-6 space-y-4">
                                {/* Address */}
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-gray-700">{office.address}</p>
                                        <p className="text-gray-700">{office.city_state}</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                    <a
                                        href={`tel:${office.phone}`}
                                        className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                                    >
                                        {office.phone}
                                    </a>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                    <a
                                        href={`mailto:${office.email}`}
                                        className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                                    >
                                        {office.email}
                                    </a>
                                </div>

                                {/* Hours */}
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        <strong className="text-gray-900">Hours:</strong> {office.hours}
                                    </p>
                                </div>

                                {/* Get Directions */}
                                <button className="w-full btn btn-outline btn-md">
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map Placeholder */}
                <div className="mt-16 bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 animate-fade-in">
                    <div className="relative h-96 bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg font-semibold">Interactive Map</p>
                                <p className="text-gray-400">Map integration coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}