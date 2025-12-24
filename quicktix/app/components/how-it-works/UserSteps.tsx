'use client'

import { Search, Ticket, CreditCard, PartyPopper } from 'lucide-react'

export default function UserSteps() {
    const steps = [
        {
            number: '01',
            icon: Search,
            title: 'Discover Events',
            description: 'Browse through thousands of events by category, location, or date. Use our smart search to find exactly what you\'re looking for.',
            features: ['Advanced search filters', 'Personalized recommendations', 'Event notifications'],
            color: 'from-blue-500 to-cyan-500',
        },
        {
            number: '02',
            icon: Ticket,
            title: 'Select Tickets',
            description: 'Choose your preferred ticket type, quantity, and seating. View detailed event information and venue maps.',
            features: ['Multiple ticket tiers', 'Interactive seating', 'Real-time availability'],
            color: 'from-purple-500 to-pink-500',
        },
        {
            number: '03',
            icon: CreditCard,
            title: 'Secure Payment',
            description: 'Complete your purchase with our secure payment system. We accept all major credit cards and payment methods.',
            features: ['SSL encryption', 'Multiple payment options', 'Instant confirmation'],
            color: 'from-orange-500 to-red-500',
        },
        {
            number: '04',
            icon: PartyPopper,
            title: 'Enjoy the Event',
            description: 'Receive your tickets instantly via email. Show your QR code at the venue and enjoy the experience!',
            features: ['E-tickets & QR codes', 'Mobile wallet support', 'Easy ticket transfers'],
            color: 'from-green-500 to-emerald-500',
        },
    ]

    return (
        <section className="section bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        For Event <span className="gradient-text">Attendees</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Book your tickets in four simple steps
                    </p>
                </div>

                {/* Steps */}
                <div className="max-w-6xl mx-auto">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                } items-center gap-12 mb-20 last:mb-0 animate-fade-in`}
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            {/* Content */}
                            <div className="flex-1">
                                {/* Step Number */}
                                <div className="text-6xl font-bold text-gray-100 mb-4">
                                    {step.number}
                                </div>

                                {/* Icon & Title */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center`}>
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                                </div>

                                {/* Description */}
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3">
                                    {step.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-700">
                                            <div className={`w-6 h-6 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visual */}
                            <div className="flex-1">
                                <div className={`relative h-80 bg-gradient-to-br ${step.color} rounded-3xl overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <step.icon className="w-32 h-32 text-white opacity-50" />
                                    </div>
                                    {/* Decorative elements */}
                                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
                                    <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/20 rounded-full blur-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}