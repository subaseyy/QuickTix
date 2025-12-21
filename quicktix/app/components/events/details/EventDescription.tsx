'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Music, Star, Shield, Clock } from 'lucide-react'

export default function EventDescription() {
    const [showFullDescription, setShowFullDescription] = useState(false)

    const highlights = [
        {
            icon: Music,
            title: '20+ Artists',
            description: 'Top international and local talent',
        },
        {
            icon: Star,
            title: 'Premium Experience',
            description: 'World-class sound and lighting',
        },
        {
            icon: Shield,
            title: 'Safe & Secure',
            description: '24/7 security and medical staff',
        },
        {
            icon: Clock,
            title: '5-Hour Show',
            description: 'Non-stop entertainment',
        },
    ]

    const lineup = [
        { name: 'The Electric Dreams', time: '6:00 PM - 7:00 PM', stage: 'Main Stage' },
        { name: 'DJ Sunset', time: '7:15 PM - 8:00 PM', stage: 'Main Stage' },
        { name: 'Urban Legends', time: '8:15 PM - 9:15 PM', stage: 'Main Stage' },
        { name: 'The Midnight Echo', time: '9:30 PM - 11:00 PM', stage: 'Main Stage' },
    ]

    return (
        <div className="space-y-8">
            {/* About This Event */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>

                <div className={`prose prose-lg max-w-none ${!showFullDescription ? 'line-clamp-6' : ''}`}>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Get ready for the most anticipated music festival of 2025! Join us at Central Park for an unforgettable
                        evening featuring some of the biggest names in music. This year's lineup includes over 20 incredible
                        artists across multiple genres, from electronic dance music to indie rock.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        The Summer Music Festival is more than just a concert – it's an experience. Enjoy state-of-the-art
                        sound systems, stunning visual effects, and a vibrant atmosphere that brings together music lovers
                        from all over the world. Whether you're dancing with friends or discovering new artists, this is
                        an event you won't want to miss.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Our festival grounds feature multiple stages, food trucks offering diverse cuisines, craft beer gardens,
                        merchandise stands, and plenty of chill-out zones. VIP ticket holders will enjoy exclusive access to
                        premium viewing areas, complimentary drinks, and private restrooms.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Come early to secure the best spots and stay late for the epic closing performance. Gates open at 5:00 PM,
                        and the music starts at 6:00 PM sharp. Don't forget to bring your ID, some cash, and your dancing shoes!
                    </p>
                </div>

                <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-4 flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200"
                >
                    {showFullDescription ? (
                        <>
                            Show Less <ChevronUp className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            Read More <ChevronDown className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>

            {/* Event Highlights */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Highlights</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {highlights.map((highlight, index) => (
                        <div key={index} className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <highlight.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{highlight.title}</h3>
                            <p className="text-sm text-gray-600">{highlight.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lineup Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Artist Lineup</h2>

                <div className="space-y-4">
                    {lineup.map((artist, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{artist.name}</h3>
                                    <p className="text-sm text-gray-600">{artist.stage}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">{artist.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* What to Bring */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Bring</h2>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-green-600 mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                            Allowed Items
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">•</span>
                                Valid ID (18+ event)
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">•</span>
                                Mobile phone & charger
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">•</span>
                                Cash and credit cards
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">•</span>
                                Small bag or backpack
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">•</span>
                                Sunscreen and hat
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-red-600 mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm">✗</span>
                            Prohibited Items
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                Outside food and drinks
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                Professional cameras
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                Weapons of any kind
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                Illegal substances
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                Large umbrellas
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}