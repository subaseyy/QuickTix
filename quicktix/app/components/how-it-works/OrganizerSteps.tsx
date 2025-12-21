'use client'

import { UserPlus, Calendar, Users, TrendingUp } from 'lucide-react'

export default function OrganizerSteps() {
    const steps = [
        {
            number: '01',
            icon: UserPlus,
            title: 'Sign Up as Organizer',
            description: 'Create your organizer account and complete the verification process. It takes less than 5 minutes.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            number: '02',
            icon: Calendar,
            title: 'Create Your Event',
            description: 'Add event details, upload images, set ticket prices, and configure seating arrangements.',
            color: 'from-purple-500 to-pink-500',
        },
        {
            number: '03',
            icon: Users,
            title: 'Promote & Sell',
            description: 'Share your event on our platform. Reach thousands of potential attendees instantly.',
            color: 'from-orange-500 to-red-500',
        },
        {
            number: '04',
            icon: TrendingUp,
            title: 'Track & Manage',
            description: 'Monitor ticket sales, manage attendees, and track revenue in real-time with our dashboard.',
            color: 'from-green-500 to-emerald-500',
        },
    ]

    return (
        <section className="section bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        For Event <span className="gradient-text">Organizers</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Host successful events with our powerful platform
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative animate-fade-in"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Connection Line (Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent -z-10" />
                            )}

                            {/* Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary-200 h-full">
                                {/* Step Number */}
                                <div className="text-5xl font-bold text-gray-100 mb-4">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center animate-fade-in">
                    <button className="btn btn-primary btn-lg">
                        Become an Organizer
                    </button>
                    <p className="text-gray-600 mt-4">
                        Already an organizer? <a href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign In</a>
                    </p>
                </div>
            </div>
        </section>
    )
}