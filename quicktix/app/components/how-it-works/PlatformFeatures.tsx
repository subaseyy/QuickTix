'use client'

import { Shield, Zap, Globe, Headphones, QrCode, BarChart } from 'lucide-react'

export default function PlatformFeatures() {
    const features = [
        {
            icon: Shield,
            title: 'Secure Payments',
            description: 'Bank-level encryption and PCI compliance for all transactions',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Zap,
            title: 'Instant Delivery',
            description: 'Receive tickets immediately after purchase via email',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Globe,
            title: 'Global Reach',
            description: 'Access events from 50+ cities worldwide',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: Headphones,
            title: '24/7 Support',
            description: 'Round-the-clock customer service for all your needs',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: QrCode,
            title: 'Digital Tickets',
            description: 'QR codes and mobile wallet integration for easy entry',
            color: 'from-red-500 to-pink-500',
        },
        {
            icon: BarChart,
            title: 'Analytics Dashboard',
            description: 'Real-time insights and reporting for organizers',
            color: 'from-indigo-500 to-purple-500',
        },
    ]

    return (
        <section className="section bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Platform <span className="gradient-text">Features</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need for a seamless event experience
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-primary-200 hover:shadow-xl transition-all duration-300 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}