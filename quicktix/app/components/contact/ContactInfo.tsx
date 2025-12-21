'use client'

import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Users } from 'lucide-react'

export default function ContactInfo() {
    const contactMethods = [
        {
            icon: Phone,
            title: 'Call Us',
            description: 'Speak with our support team',
            value: '+1 (234) 567-890',
            link: 'tel:+1234567890',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Mail,
            title: 'Email Us',
            description: 'Send us a detailed message',
            value: 'hello@quicktix.com',
            link: 'mailto:hello@quicktix.com',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: MessageSquare,
            title: 'Live Chat',
            description: 'Chat with us in real-time',
            value: 'Start Chat',
            link: '#',
            color: 'from-green-500 to-emerald-500',
        },
    ]

    const departments = [
        {
            icon: Headphones,
            name: 'Customer Support',
            email: 'support@quicktix.com',
            description: 'For general inquiries and assistance',
        },
        {
            icon: Users,
            name: 'Organizer Support',
            email: 'organizers@quicktix.com',
            description: 'For event organizer inquiries',
        },
        {
            icon: Mail,
            name: 'Business & Partnerships',
            email: 'business@quicktix.com',
            description: 'For partnership opportunities',
        },
    ]

    return (
        <div className="animate-fade-in animation-delay-200">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Other Ways to Reach Us</h2>
                <p className="text-gray-600">
                    Choose the contact method that works best for you
                </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4 mb-8">
                {contactMethods.map((method, index) => (
                    <a
                        key={index}
                        href={method.link}
                        className="block bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                <method.icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-200">
                                    {method.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">{method.description}</p>
                                <p className="text-primary-600 font-semibold">{method.value}</p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 mb-8 border-2 border-primary-100">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Support Hours</h3>
                        <div className="space-y-1 text-gray-700">
                            <p><strong>24/7 Support:</strong> Available anytime</p>
                            <p><strong>Live Chat:</strong> Mon-Fri, 9:00 AM - 6:00 PM EST</p>
                            <p><strong>Phone:</strong> Mon-Sat, 8:00 AM - 8:00 PM EST</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Departments */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Department Contacts</h3>
                <div className="space-y-4">
                    {departments.map((dept, index) => (
                        <div
                            key={index}
                            className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary-200 transition-all duration-200"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <dept.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">{dept.name}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                                    <a
                                        href={`mailto:${dept.email}`}
                                        className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                                    >
                                        {dept.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Response Time */}
            <div className="mt-8 bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">⚡ Average Response Times</h4>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span>Email:</span>
                        <strong>Within 24 hours</strong>
                    </div>
                    <div className="flex justify-between">
                        <span>Live Chat:</span>
                        <strong>2-5 minutes</strong>
                    </div>
                    <div className="flex justify-between">
                        <span>Phone:</span>
                        <strong>Immediate</strong>
                    </div>
                </div>
            </div>
        </div>
    )
}