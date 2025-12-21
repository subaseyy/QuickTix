'use client'

import { TrendingUp, Users, Calendar, Star } from 'lucide-react'

export default function Stats() {
    const stats = [
        {
            icon: Calendar,
            value: '10,000+',
            label: 'Events Listed',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Users,
            value: '500K+',
            label: 'Happy Users',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: TrendingUp,
            value: '1M+',
            label: 'Tickets Sold',
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: Star,
            value: '4.9/5',
            label: 'Average Rating',
            color: 'from-green-500 to-emerald-500',
        },
    ]

    return (
        <section className="section bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container-custom relative">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Value */}
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                                {stat.value}
                            </div>

                            {/* Label */}
                            <div className="text-lg text-white/90">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}