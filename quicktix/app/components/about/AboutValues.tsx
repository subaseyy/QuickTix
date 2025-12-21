'use client'

import { Shield, Users, Zap, Heart, Award, Globe } from 'lucide-react'

export default function AboutValues() {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'We prioritize the security of your data and transactions. Every booking is protected with industry-leading encryption and fraud prevention.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority. We provide 24/7 support and guarantee fair pricing with no hidden fees.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously improve our platform with cutting-edge technology to make event booking faster, easier, and more enjoyable.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'We believe in bringing people together. Every event we support helps build stronger, more connected communities.',
      color: 'from-pink-500 to-red-500',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from user experience to customer service, ensuring the best possible outcomes.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Events should be accessible to everyone. We work to ensure fair access and inclusive experiences for all our users.',
      color: 'from-indigo-500 to-purple-600',
    },
  ]

  return (
    <section className="section bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Core <span className="gradient-text">Values</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            These principles guide everything we do and shape how we serve our community
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <div
              key={index}
              className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-primary-200 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <value.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-200">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="mt-16 max-w-4xl mx-auto text-center animate-fade-in">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 sm:p-12">
            <div className="text-6xl text-primary-600 mb-4">"</div>
            <blockquote className="text-2xl sm:text-3xl font-medium text-gray-900 mb-6 leading-relaxed">
              We don't just sell tickets. We create opportunities for people to experience 
              moments that matter, memories that last, and connections that endure.
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                JD
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">John Doe</div>
                <div className="text-gray-600">CEO & Founder, QuickTix</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}