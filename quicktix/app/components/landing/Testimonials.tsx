'use client'

import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Music Enthusiast',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            content: 'QuickTix made booking concert tickets so easy! The interface is intuitive, and I got my tickets instantly. Highly recommended!',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            role: 'Event Organizer',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            content: 'As an organizer, QuickTix has been a game-changer. Managing events and tracking sales is seamless. Great platform!',
            rating: 5,
        },
        {
            name: 'Emily Rodriguez',
            role: 'Festival Goer',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            content: 'Ive used QuickTix for multiple festivals this year.The app is reliable, and customer support is excellent.Never had any issues!',
            rating: 5,
        },
        {
            name: 'David Thompson',
            role: 'Conference Attendee',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            content: 'Booking conference tickets through QuickTix was straightforward. Love the QR code feature for quick entry!',
            rating: 5,
        },
        {
            name: 'Lisa Martinez',
            role: 'Theater Lover',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
            content: 'The best ticket booking platform Ive used.Great selection of events and competitive prices.Will definitely use again!',
            rating: 5,
        },
        {
            name: 'James Wilson',
            role: 'Sports Fan',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
            content: 'Got tickets to my favorite teams game through QuickTix.Super fast checkout and great seat selection options!',
            rating: 5,
        },
    ]

    return (
        <section className="section bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        What Our <span className="gradient-text">Users Say</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our community has to say about QuickTix.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-xl transition-all duration-300 animate-fade-in border-2 border-transparent hover:border-primary-200"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-10">
                                <Quote className="w-12 h-12 text-primary-600" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                                "{testimonial.content}"
                            </p>

                            {/* User Info */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-primary-200"
                                    style={{ backgroundImage: `url(${testimonial.image})` }}
                                />
                                <div>
                                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-50 animate-fade-in" style={{ animationDelay: '800ms' }}>
                    <div className="text-gray-600 font-semibold">Trusted by</div>
                    <div className="h-8 w-32 bg-gray-300 rounded" />
                    <div className="h-8 w-32 bg-gray-300 rounded" />
                    <div className="h-8 w-32 bg-gray-300 rounded" />
                    <div className="h-8 w-32 bg-gray-300 rounded" />
                </div>
            </div>
        </section>
    )
}