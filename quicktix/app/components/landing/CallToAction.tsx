'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CallToAction() {
    return (
        <section className="section bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

            <div className="container-custom relative">
                <div className="max-w-4xl mx-auto text-center animate-fade-in">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Ready to Experience
                        <br />
                        <span className="text-secondary-300">Amazing Events?</span>
                    </h2>

                    {/* Description */}
                    <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Join over 500,000 users who trust QuickTix for their event ticketing needs.
                        Start booking today!
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <Link
                            href="/register"
                            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center shadow-2xl transition-all duration-200 hover:scale-105 group"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <Link
                            href="/events"
                            className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center border-2 border-white/30 transition-all duration-200 hover:scale-105"
                        >
                            Browse Events
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Instant confirmation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>24/7 customer support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}