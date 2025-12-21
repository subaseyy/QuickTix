'use client'

import { ChevronDown } from 'lucide-react'

export default function AboutHero() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

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
      <div className="relative container-custom text-center text-white">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium">About QuickTix</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Making Events
            <br />
            <span className="text-secondary-300">Accessible to Everyone</span>
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to connect people with unforgettable experiences through 
            seamless event discovery and booking.
          </p>

          {/* Stats Quick View */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            <div className="animate-slide-up">
              <div className="text-4xl sm:text-5xl font-bold mb-2">5+</div>
              <div className="text-white/80">Years Running</div>
            </div>
            <div className="animate-slide-up animation-delay-200">
              <div className="text-4xl sm:text-5xl font-bold mb-2">500K+</div>
              <div className="text-white/80">Happy Users</div>
            </div>
            <div className="animate-slide-up animation-delay-400">
              <div className="text-4xl sm:text-5xl font-bold mb-2">10K+</div>
              <div className="text-white/80">Events Hosted</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>
    </section>
  )
}