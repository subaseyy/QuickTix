'use client'

import { Rocket, Users, Globe, Award, TrendingUp, Star } from 'lucide-react'

export default function AboutTimeline() {
  const milestones = [
    {
      year: '2019',
      icon: Rocket,
      title: 'QuickTix Founded',
      description: 'Started with a small team and a big vision to revolutionize event ticketing.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      year: '2020',
      icon: Users,
      title: '10K Users Milestone',
      description: 'Reached our first 10,000 users and hosted over 500 events in our first year.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      year: '2021',
      icon: Globe,
      title: 'National Expansion',
      description: 'Expanded operations to 20+ cities across the country, partnering with major venues.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      year: '2022',
      icon: Award,
      title: 'Industry Recognition',
      description: 'Won "Best Event Platform" award and reached 100K active users milestone.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      year: '2023',
      icon: TrendingUp,
      title: '1M Tickets Sold',
      description: 'Celebrated selling our millionth ticket and processing $50M in transactions.',
      color: 'from-red-500 to-pink-500',
    },
    {
      year: '2024',
      icon: Star,
      title: 'International Launch',
      description: 'Launched in 50+ cities worldwide, becoming a global event ticketing platform.',
      color: 'from-indigo-500 to-purple-500',
    },
  ]

  return (
    <section className="section bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From a startup to a global platform - here's how we've grown
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-600 to-secondary-600" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary-200">
                      {/* Year Badge */}
                      <div className="inline-flex items-center bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                        {milestone.year}
                      </div>

                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-2xl flex items-center justify-center mb-4`}>
                        <milestone.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full border-4 border-white shadow-lg z-10" />

                  {/* Empty Space for Alternating Layout */}
                  <div className="hidden md:block w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Future Vision */}
        <div className="mt-16 max-w-3xl mx-auto text-center animate-fade-in">
          <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-8 sm:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">What's Next?</h3>
            <p className="text-xl text-white/90 leading-relaxed mb-6">
              We're just getting started! Our roadmap includes AI-powered event recommendations, 
              virtual event experiences, blockchain ticketing, and expansion to 100+ cities worldwide.
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-semibold">Stay tuned for more exciting updates!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}