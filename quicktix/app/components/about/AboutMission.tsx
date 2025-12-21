'use client'

import { Target, Eye, Heart } from 'lucide-react'

export default function AboutMission() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        {/* Main Story */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our Story
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Founded in 2019, QuickTix was born from a simple idea: finding and booking event 
            tickets shouldn't be complicated. We noticed people were missing out on amazing 
            experiences because the ticketing process was too difficult or unreliable.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed">
            Today, we've grown into a trusted platform that connects millions of people with 
            unforgettable events worldwide. From intimate local gatherings to massive international 
            festivals, we make it easy for everyone to discover and attend the events they love.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Mission */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To democratize access to live events by providing a seamless, secure, and 
              user-friendly platform that connects people with experiences they'll never forget.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center animate-fade-in animation-delay-200">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become the world's most trusted event ticketing platform, where every person 
              can easily discover and attend events that inspire, entertain, and connect communities.
            </p>
          </div>

          {/* Purpose */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 text-center animate-fade-in animation-delay-400">
            <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Purpose</h3>
            <p className="text-gray-700 leading-relaxed">
              To bring people together through shared experiences, creating memories that last 
              a lifetime and fostering connections that transcend the events themselves.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}