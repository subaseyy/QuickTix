'use client'

import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactHero() {
    const quickContacts = [
        {
            icon: Phone,
            label: 'Phone',
            value: '+1 (234) 567-890',
            link: 'tel:+1234567890',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Mail,
            label: 'Email',
            value: 'hello@quicktix.com',
            link: 'mailto:hello@quicktix.com',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: MapPin,
            label: 'Office',
            value: 'San Francisco, CA',
            link: '#locations',
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: Clock,
            label: 'Support Hours',
            value: '24/7 Available',
            link: '#',
            color: 'from-green-500 to-emerald-500',
        },
    ]

    return (
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse animation-delay-400" />

            {/* Content */}
            <div className="relative container-custom text-center text-white py-20">
                <div className="animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                        <span className="text-sm font-medium">We're Here to Help</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        Get in
                        <br />
                        <span className="text-secondary-300">Touch</span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Have questions? We'd love to hear from you. Send us a message and
                        we'll respond as soon as possible.
                    </p>

                    {/* Quick Contact Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {quickContacts.map((contact, index) => (
                            <a
                                key={index}
                                href={contact.link}
                                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${contact.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                    <contact.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-sm text-white/80 mb-1">{contact.label}</div>
                                <div className="font-semibold">{contact.value}</div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}