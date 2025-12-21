'use client'

import { Mail, Users, Calendar, Star, CheckCircle } from 'lucide-react'

export default function OrganizerInfo() {
    const stats = [
        { label: 'Events Organized', value: '127' },
        { label: 'Total Attendees', value: '250K+' },
        { label: 'Average Rating', value: '4.8/5' },
    ]

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Organized By</h2>

            {/* Organizer Profile */}
            <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">ME</span>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">MusicEvents Inc.</h3>
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                    </div>

                    <p className="text-gray-600 mb-4">
                        Leading event management company specializing in music festivals and concerts.
                        We've been creating unforgettable experiences for music lovers since 2010.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                                <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Contact & Follow */}
                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200">
                            <Users className="w-4 h-4" />
                            Follow
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-primary-600 hover:text-primary-600 transition-all duration-200">
                            <Mail className="w-4 h-4" />
                            Contact
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-primary-600 hover:text-primary-600 transition-all duration-200">
                            <Calendar className="w-4 h-4" />
                            View All Events
                        </button>
                    </div>
                </div>
            </div>

            {/* Ratings */}
            <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-bold text-gray-900">4.8 out of 5</span>
                    <span className="text-gray-500">(2,847 reviews)</span>
                </div>

                {/* Rating Bars */}
                <div className="space-y-2">
                    {[
                        { stars: 5, percentage: 75 },
                        { stars: 4, percentage: 15 },
                        { stars: 3, percentage: 7 },
                        { stars: 2, percentage: 2 },
                        { stars: 1, percentage: 1 },
                    ].map((rating) => (
                        <div key={rating.stars} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-12">{rating.stars} star</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400"
                                    style={{ width: `${rating.percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">{rating.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}