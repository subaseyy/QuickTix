'use client'

import { Star, Quote } from 'lucide-react'

export default function OrganizerTestimonials() {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Music Festival Organizer',
            company: 'SoundWave Events',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            content: 'QuickTix transformed how we sell tickets. We saw a 250% increase in sales within the first month. The analytics dashboard is invaluable!',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            role: 'Conference Director',
            company: 'TechCon Global',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            content: 'Managing our annual tech conference has never been easier. The attendee management tools save us countless hours. Highly recommended!',
            rating: 5,
        },
        {
            name: 'Emily Rodriguez',
            role: 'Event Coordinator',
            company: 'Downtown Arts Center',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            content: 'The customer support team is amazing! They helped us set up our first event and were available 24/7. We couldn\'t be happier with QuickTix.',
            rating: 5,
        },
        {
            name: 'David Thompson',
            role: 'Sports Event Organizer',
            company: 'Champion Sports',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            content: 'The mobile app lets me manage events on the go. Real-time notifications keep me updated on ticket sales. It\'s a game-changer!',
            rating: 5,
        },
        {
            name: 'Lisa Martinez',
            role: 'Theatre Producer',
            company: 'Broadway Dreams',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
            content: 'Custom branding options helped us maintain our identity. Our audience loves the seamless booking experience. Revenue is up 180%!',
            rating: 5,
        },
        {
            name: 'James Wilson',
            role: 'Comedy Club Owner',
            company: 'Laugh Factory',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
            content: 'QuickTix made it easy to manage multiple shows per week. The automated reminders reduced no-shows by 40%. Absolutely worth it!',
            rating: 5,
        },
    ]

    return (
        <section className="section bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Loved by <span className="gradient-text">Organizers</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        See what successful event organizers are saying about QuickTix
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                                    <div className="text-sm text-primary-600">{testimonial.company}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Bar */}
                <div className="mt-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 sm:p-12 animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold mb-2">4.9/5</div>
                            <div className="text-white/90">Average Rating</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold mb-2">5,000+</div>
                            <div className="text-white/90">Happy Organizers</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold mb-2">98%</div>
                            <div className="text-white/90">Would Recommend</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
                            <div className="text-white/90">Support Available</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}