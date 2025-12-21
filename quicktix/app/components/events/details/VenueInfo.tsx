'use client'

import { MapPin, Navigation, Phone, Globe, ParkingMeter, Train, Bus } from 'lucide-react'

export default function VenueInfo() {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Venue Information</h2>

            {/* Venue Details */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Central Park Main Stage</h3>
                <p className="text-gray-700 mb-4">
                    Located in the heart of New York City, Central Park offers a stunning outdoor venue
                    with beautiful scenery and excellent facilities. The Main Stage area can accommodate
                    up to 5,000 guests and features state-of-the-art sound and lighting equipment.
                </p>

                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-gray-900">Address</p>
                            <p className="text-gray-600">123 Park Ave</p>
                            <p className="text-gray-600">New York, NY 10001</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-gray-900">Contact</p>
                            <p className="text-gray-600">(555) 123-4567</p>
                            <p className="text-gray-600">info@centralpark.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-gray-900">Website</p>
                            <a href="#" className="text-primary-600 hover:text-primary-700 hover:underline">
                                www.centralpark.com
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Navigation className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-gray-900">Directions</p>
                            <a href="#" className="text-primary-600 hover:text-primary-700 hover:underline">
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="mb-6 rounded-xl overflow-hidden border-2 border-gray-200">
                <div className="relative h-64 bg-gray-100">
                    {/* Map placeholder - replace with actual map component */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Interactive Map</p>
                            <p className="text-sm text-gray-400">Central Park, New York</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Getting There */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Getting There</h3>

                <div className="space-y-4">
                    {/* Public Transit */}
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Train className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Subway</h4>
                            <p className="text-gray-700 text-sm">
                                Take the A, C, or B lines to 59th Street-Columbus Circle.
                                The venue is a 10-minute walk from the station.
                            </p>
                        </div>
                    </div>

                    {/* Bus */}
                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Bus</h4>
                            <p className="text-gray-700 text-sm">
                                Multiple bus lines stop nearby including M10, M20, and M104.
                                Check MTA website for schedules.
                            </p>
                        </div>
                    </div>

                    {/* Parking */}
                    <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <ParkingMeter className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Parking</h4>
                            <p className="text-gray-700 text-sm">
                                Limited parking available at Central Parking Garage ($30/day).
                                We recommend using public transportation or rideshare services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accessibility */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Accessibility</h4>
                <p className="text-gray-700 text-sm">
                    This venue is wheelchair accessible. Accessible parking and seating are available.
                    Please contact the venue in advance if you require special accommodations.
                </p>
            </div>
        </div>
    )
}