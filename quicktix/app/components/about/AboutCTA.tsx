'use client'

import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

export default function AboutCTA() {
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
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Get Started Card */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 hover:bg-white/15 transition-all duration-300 animate-fade-in">
                            <h3 className="text-3xl font-bold text-white mb-4">
                                Start Booking Events
                            </h3>
                            <p className="text-white/90 text-lg mb-6 leading-relaxed">
                                Join thousands of users discovering and booking amazing events.
                                Create your free account today!
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 group"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                        </div>

                        {/* Become Organizer Card */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 hover:bg-white/15 transition-all duration-300 animate-fade-in animation-delay-200">
                            <h3 className="text-3xl font-bold text-white mb-4">
                                Become an Organizer
                            </h3>
                            <p className="text-white/90 text-lg mb-6 leading-relaxed">
                                Host your events on QuickTix and reach thousands of potential attendees.
                                Start for free today!
                            </p>
                            <Link
                                href="/become-organizer"
                                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3 rounded-lg font-semibold border-2 border-white/30 transition-all duration-200 hover:scale-105 group"
                            >
                                Learn More
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-12 text-center animate-fade-in animation-delay-400">
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full px-6 py-3 mb-6">
                            <Mail className="w-5 h-5 text-white mr-2" />
                            <span className="text-white font-medium">Have questions? We'd love to hear from you</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 text-white/90">
                            <a href="mailto:hello@quicktix.com" className="hover:text-white transition-colors duration-200">
                                hello@quicktix.com
                            </a>
                            <span className="text-white/50">|</span>
                            <a href="tel:+1234567890" className="hover:text-white transition-colors duration-200">
                                +1 (234) 567-890
                            </a>
                            <span className="text-white/50">|</span>
                            <Link href="/contact" className="hover:text-white transition-colors duration-200">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}