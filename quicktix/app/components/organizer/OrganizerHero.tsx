'use client'

import { TrendingUp, Users, DollarSign } from 'lucide-react'

export default function OrganizerHero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
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
                        <span className="text-sm font-medium">Start Hosting Today</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        Become an Event
                        <br />
                        <span className="text-secondary-300">Organizer</span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Host your events on QuickTix and reach thousands of potential attendees.
                        Simple setup, powerful tools, and competitive pricing.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold shadow-2xl transition-all duration-200 hover:scale-105">
                            Apply Now - It's Free
                        </button>
                        <button className="btn btn-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-lg font-semibold border-2 border-white/30 transition-all duration-200 hover:scale-105">
                            See How It Works
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold mb-2">5,000+</div>
                            <div className="text-white/80">Active Organizers</div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold mb-2">10M+</div>
                            <div className="text-white/80">Annual Attendees</div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold mb-2">$100M+</div>
                            <div className="text-white/80">Revenue Generated</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}