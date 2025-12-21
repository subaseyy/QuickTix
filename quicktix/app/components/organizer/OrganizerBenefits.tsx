'use client'

import { TrendingUp, Users, Globe, BarChart, Shield, Zap } from 'lucide-react'

export default function OrganizerBenefits() {
    const benefits = [
        {
            icon: TrendingUp,
            title: 'Increase Revenue',
            description: 'Reach thousands of potential attendees and maximize ticket sales with our powerful marketing tools.',
            stats: 'Up to 300% more reach',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Users,
            title: 'Grow Your Audience',
            description: 'Build your brand and attract loyal followers with our engaged community of event-goers.',
            stats: '500K+ active users',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Globe,
            title: 'Global Exposure',
            description: 'List your events on our platform and get discovered by attendees from around the world.',
            stats: '50+ cities covered',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: BarChart,
            title: 'Real-Time Analytics',
            description: 'Track ticket sales, revenue, and attendee demographics with detailed insights and reports.',
            stats: 'Live dashboards',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: Shield,
            title: 'Secure Payments',
            description: 'Get paid fast and securely. We handle all payment processing with bank-level security.',
            stats: '24-hour payouts',
            color: 'from-red-500 to-pink-500',
        },
        {
            icon: Zap,
            title: 'Easy Setup',
            description: 'Create and publish your event in minutes with our intuitive event management tools.',
            stats: '5-minute setup',
            color: 'from-indigo-500 to-purple-500',
        },
    ]

    return (
        <section className="section bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="gradient-text">QuickTix?</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to host successful events and grow your business
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-primary-200 hover:shadow-xl transition-all duration-300 group animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <benefit.icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                                {benefit.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed mb-4">
                                {benefit.description}
                            </p>

                            {/* Stats Badge */}
                            <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                                {benefit.stats}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center animate-fade-in">
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Join 5,000+ Successful Organizers
                        </h3>
                        <p className="text-xl text-gray-600 mb-6">
                            Start hosting events today and grow your business with QuickTix
                        </p>
                        <button className="btn btn-primary btn-lg">
                            Get Started for Free
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}