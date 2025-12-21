'use client'

import { Play } from 'lucide-react'

export default function HowItWorksHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
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
            <span className="text-sm font-medium">Simple & Secure</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            How QuickTix
            <br />
            <span className="text-secondary-300">Works</span>
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Booking event tickets has never been easier. Follow our simple 4-step process 
            to discover and attend amazing events.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold shadow-2xl transition-all duration-200 hover:scale-105">
              Get Started Free
            </button>
            <button className="btn btn-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-lg font-semibold border-2 border-white/30 transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
            <div>
              <div className="text-3xl font-bold mb-1">4 Steps</div>
              <div className="text-white/80 text-sm">Simple Process</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">2 Min</div>
              <div className="text-white/80 text-sm">Average Booking</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-white/80 text-sm">Secure</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}