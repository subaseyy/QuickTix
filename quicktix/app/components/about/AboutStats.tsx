'use client'

import { Users, Calendar, Globe, Award, TrendingUp, Shield } from 'lucide-react'

export default function AboutStats() {
  const stats = [
    {
      icon: Users,
      value: '500,000+',
      label: 'Active Users',
      description: 'Trust QuickTix for their event needs',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Calendar,
      value: '10,000+',
      label: 'Events Listed',
      description: 'Every month across all categories',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Globe,
      value: '50+',
      label: 'Cities',
      description: 'Worldwide event coverage',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Award,
      value: '4.9/5',
      label: 'User Rating',
      description: 'Based on 100K+ reviews',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: TrendingUp,
      value: '$50M+',
      label: 'Tickets Sold',
      description: 'Total transaction value',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Shield,
      value: '99.9%',
      label: 'Uptime',
      description: 'Reliable platform performance',
      color: 'from-indigo-500 to-purple-500',
    },
  ]

  return (
    <section className="section bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            QuickTix by the <span className="gradient-text">Numbers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our growth and success is measured by the amazing experiences we help create
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              {/* Value */}
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-xl font-semibold text-gray-700 mb-2">
                {stat.label}
              </div>

              {/* Description */}
              <p className="text-gray-600">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Stats Bar */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 sm:p-12 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">1M+</div>
              <div className="text-white/90">Tickets Sold</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">5,000+</div>
              <div className="text-white/90">Event Organizers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/90">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">100%</div>
              <div className="text-white/90">Secure Payments</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}