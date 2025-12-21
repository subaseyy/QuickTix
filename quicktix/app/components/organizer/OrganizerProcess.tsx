'use client'

import { UserPlus, FileText, CheckCircle, Rocket } from 'lucide-react'

export default function OrganizerProcess() {
    const steps = [
        {
            number: '01',
            icon: UserPlus,
            title: 'Create Account',
            description: 'Sign up and complete your organizer profile with business details and contact information.',
            time: '2 minutes',
        },
        {
            number: '02',
            icon: FileText,
            title: 'Submit Application',
            description: 'Fill out a simple application form. Tell us about your events and organization.',
            time: '3 minutes',
        },
        {
            number: '03',
            icon: CheckCircle,
            title: 'Get Approved',
            description: 'Our team reviews your application within 24-48 hours. Most applications are approved instantly.',
            time: '24-48 hours',
        },
        {
            number: '04',
            icon: Rocket,
            title: 'Start Hosting',
            description: 'Create your first event, set up tickets, and start selling! It\'s that simple.',
            time: '5 minutes',
        },
    ]

    return (
        <section className="section bg-gradient-to-br from-gray-50 to-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Getting Started is <span className="gradient-text">Easy</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Follow these 4 simple steps to become an organizer
                    </p>
                </div>

                {/* Steps */}
                <div className="max-w-5xl mx-auto">
                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden lg:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600" />

                        {/* Steps Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="relative animate-fade-in"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    {/* Card */}
                                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary-200">
                                        {/* Icon Container */}
                                        <div className="relative mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto">
                                                <step.icon className="w-8 h-8 text-white" />
                                            </div>
                                            {/* Step Number Badge */}
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-primary-600 flex items-center justify-center">
                                                <span className="text-xs font-bold text-primary-600">{step.number}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                                            {step.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 text-center mb-4 leading-relaxed">
                                            {step.description}
                                        </p>

                                        {/* Time Badge */}
                                        <div className="text-center">
                                            <span className="inline-flex items-center bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                ⏱️ {step.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Total Time */}
                <div className="mt-12 text-center animate-fade-in">
                    <div className="inline-flex items-center bg-gradient-to-r from-primary-50 to-secondary-50 rounded-full px-6 py-3 border-2 border-primary-200">
                        <span className="text-gray-700">
                            <strong className="text-primary-600">Total setup time:</strong> Less than 15 minutes
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}