'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export default function OrganizerCTA() {
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
                <div className="max-w-4xl mx-auto text-center animate-fade-in">
                    {/* Heading */}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Start Hosting Events
                        <br />
                        <span className="text-secondary-300">Today</span>
                    </h2>

                    {/* Description */}
                    <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Join 5,000+ successful event organizers and grow your business with QuickTix.
                    </p>

                    {/* Benefits List */}
                    <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
                        {[
                            'Free to get started',
                            'No upfront costs',
                            'Instant approval available',
                            '24/7 support included',
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 text-white/90 text-lg animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Link
                            href="/register"
                            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center shadow-2xl transition-all duration-200 hover:scale-105 group"
                        >
                            Apply Now - It's Free
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center border-2 border-white/30 transition-all duration-200 hover:scale-105"
                        >
                            Talk to Sales
                        </Link>
                    </div>

                    {/* Trust Badge */}
                    <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full px-6 py-3">
                        <span className="text-white/90 font-medium">
                            ⚡ Most applications approved within 24 hours
                        </span>
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center text-white animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <div>
                        <div className="text-3xl font-bold mb-2">$100M+</div>
                        <div className="text-white/80 text-sm">Revenue Generated</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold mb-2">10M+</div>
                        <div className="text-white/80 text-sm">Tickets Sold</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold mb-2">4.9/5</div>
                        <div className="text-white/80 text-sm">Organizer Rating</div>
                    </div>
                </div>
            </div>
        </section>
    )
}