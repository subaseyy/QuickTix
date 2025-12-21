'use client'

import Link from 'next/link'
import { Headphones, MessageSquare, Mail, Phone } from 'lucide-react'

export default function ContactCTA() {
    const quickActions = [
        {
            icon: MessageSquare,
            title: 'Live Chat',
            description: 'Chat with our team instantly',
            action: 'Start Chat',
            href: '#',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: Phone,
            title: 'Call Us',
            description: 'Speak with a representative',
            action: 'Call Now',
            href: 'tel:+1234567890',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Send us a detailed message',
            action: 'Send Email',
            href: 'mailto:hello@quicktix.com',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Headphones,
            title: 'Help Center',
            description: 'Browse our knowledge base',
            action: 'Visit Help Center',
            href: '/help',
            color: 'from-orange-500 to-red-500',
        },
    ]

    return (
        <section className="section bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

            <div className="container-custom relative">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Still Need Help?
                        </h2>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Our team is here to assist you. Choose the best way to reach us.
                        </p>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {quickActions.map((action, index) => (
                            <a
                                key={index}
                                href={action.href}
                                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 group animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <action.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                                <p className="text-white/80 text-sm mb-4">{action.description}</p>
                                <span className="text-white font-semibold text-sm flex items-center">
                                    {action.action}
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </a>
                        ))}
                    </div>

                    {/* Support Stats */}
                    <div className="grid grid-cols-3 gap-8 text-center text-white animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                            <div className="text-3xl font-bold mb-2">24/7</div>
                            <div className="text-white/80 text-sm">Support Available</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                            <div className="text-3xl font-bold mb-2">&lt;2 min</div>
                            <div className="text-white/80 text-sm">Average Response</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                            <div className="text-3xl font-bold mb-2">98%</div>
                            <div className="text-white/80 text-sm">Satisfaction Rate</div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
                        <p className="text-white/90 mb-4">Connect with us on social media</p>
                        <div className="flex justify-center gap-4">
                            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300"
                                    aria-label={platform}
                                >
                                    <span className="text-white text-sm font-bold">
                                        {platform.charAt(0)}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}