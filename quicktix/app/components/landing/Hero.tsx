'use client'

import Link from 'next/link'
import { Search, Calendar, MapPin, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
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

            <div className="relative container-custom">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20">
                    {/* Left Content */}
                    <div className="text-white animate-fade-in">
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">#1 Event Ticketing Platform</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Discover Amazing
                            <span className="block text-secondary-300">Events Near You</span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
                            Book tickets instantly for concerts, conferences, festivals, and more.
                            Your next unforgettable experience is just a click away.
                        </p>

                        {/* Search Bar */}
                        <div className="bg-white rounded-2xl shadow-2xl p-2 mb-8 max-w-2xl animate-slide-up">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 flex items-center px-4 py-3 sm:py-0">
                                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                                    <input
                                        type="text"
                                        placeholder="Search events, artists, venues..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full text-gray-900 placeholder-gray-400 focus:outline-none"
                                    />
                                </div>
                                <button className="btn btn-primary btn-lg whitespace-nowrap">
                                    Find Events
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-6 max-w-2xl animate-slide-up animation-delay-200">
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold mb-1">10K+</div>
                                <div className="text-white/80 text-sm">Events Listed</div>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold mb-1">500K+</div>
                                <div className="text-white/80 text-sm">Happy Users</div>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold mb-1">50+</div>
                                <div className="text-white/80 text-sm">Cities Covered</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Featured Card */}
                    <div className="hidden lg:block animate-fade-in animation-delay-400">
                        <div className="relative">
                            {/* Floating Cards */}
                            <div className="relative space-y-6">
                                {/* Main Featured Event Card */}
                                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                    <div className="h-64 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 relative">
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-purple-600 mb-2">
                                                Featured Event
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            Summer Music Festival 2025
                                        </h3>
                                        <div className="flex items-center text-gray-600 mb-4 space-x-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span className="text-sm">Mar 15, 2025</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span className="text-sm">New York</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm text-gray-500">Starting from</span>
                                                <div className="text-2xl font-bold text-primary-600">$99</div>
                                            </div>
                                            <button className="btn btn-primary btn-md">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Small Floating Card */}
                                <div className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition-transform duration-300 absolute -right-4 -top-4 w-48">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">🎭</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">Theater</div>
                                            <div className="text-sm text-gray-500">156 Events</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                </svg>
            </div>
        </section>
    )
}