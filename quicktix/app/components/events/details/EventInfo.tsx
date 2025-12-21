'use client'

import { Calendar, Clock, MapPin, Users, Tag, Share2, Download } from 'lucide-react'

export default function EventInfo() {
    const eventDetails = [
        {
            icon: Calendar,
            label: 'Date',
            value: 'Saturday, June 20, 2025',
        },
        {
            icon: Clock,
            label: 'Time',
            value: '6:00 PM - 11:00 PM (EST)',
        },
        {
            icon: MapPin,
            label: 'Venue',
            value: 'Central Park Main Stage',
            subValue: '123 Park Ave, New York, NY 10001',
        },
        {
            icon: Users,
            label: 'Attendees',
            value: '2,500 people going',
            subValue: '450 tickets remaining',
        },
        {
            icon: Tag,
            label: 'Category',
            value: 'Music Festival',
        },
    ]

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>

            <div className="space-y-6">
                {eventDetails.map((detail, index) => (
                    <div key={index} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <detail.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-500 mb-1">{detail.label}</div>
                            <div className="text-lg font-semibold text-gray-900">{detail.value}</div>
                            {detail.subValue && (
                                <div className="text-sm text-gray-600 mt-1">{detail.subValue}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:border-primary-600 hover:text-primary-600 transition-all duration-200">
                    <Share2 className="w-5 h-5" />
                    Share Event
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:border-primary-600 hover:text-primary-600 transition-all duration-200">
                    <Download className="w-5 h-5" />
                    Add to Calendar
                </button>
            </div>
        </div>
    )
}