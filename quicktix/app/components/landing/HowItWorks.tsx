'use client'

import { Search, Ticket, CreditCard, PartyPopper } from 'lucide-react'

export default function HowItWorks() {
    const steps = [
        {
            icon: Search,
            title: 'Discover Events',
            description: 'Browse through thousands of events happening near you or around the world.',
            color: 'from-blue-500 to-cyan-500',
            delay: '0ms',
        },
        {
            icon: Ticket,
            title: 'Select Tickets',
            description: 'Choose your preferred date, seat, and ticket type that fits your budget.',
            color: 'from-purple-500 to-pink-500',
            delay: '200ms',
        },
        {
            icon: CreditCard,
            title: 'Secure Payment',
            description: 'Complete your purchase with our secure payment system in just a few clicks.',
            color: 'from-orange-500 to-red-500',
            delay: '400ms',
        },
        {
            icon: PartyPopper,
            title: 'Enjoy the Event',
            description: 'Receive your tickets instantly and get ready for an amazing experience!',
            color: 'from-green-500 to-emerald-500',
            delay: '600ms',
        },
    ]

    return (
        <section className="section bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Book your tickets in four simple steps. It's fast, easy, and secure!
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 via-orange-200 to-green-200" />

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative animate-fade-in"
                            style={{ animationDelay: step.delay }}
                        >
                            {/* Step Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary-200 group">
                                {/* Step Number */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Arrow (Mobile) */}
                            {index < steps.length - 1 && (
                                <div className="flex justify-center my-4 lg:hidden">
                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Get Started?
                        </h3>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of happy users and start booking amazing events today!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-primary btn-lg">
                                Browse Events
                            </button>
                            <button className="btn btn-outline btn-lg">
                                Become an Organizer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}