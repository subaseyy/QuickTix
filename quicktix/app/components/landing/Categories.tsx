'use client'

import Link from 'next/link'
import { Music, Briefcase, Palette, Utensils, Trophy, Theater, Dumbbell, Film } from 'lucide-react'

export default function Categories() {
    const categories = [
        {
            icon: Music,
            name: 'Music & Concerts',
            count: 2500,
            color: 'from-pink-500 to-rose-500',
            bgColor: 'bg-pink-50',
        },
        {
            icon: Briefcase,
            name: 'Business & Conferences',
            count: 1800,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
        },
        {
            icon: Palette,
            name: 'Arts & Culture',
            count: 1200,
            color: 'from-purple-500 to-indigo-500',
            bgColor: 'bg-purple-50',
        },
        {
            icon: Utensils,
            name: 'Food & Drink',
            count: 950,
            color: 'from-orange-500 to-amber-500',
            bgColor: 'bg-orange-50',
        },
        {
            icon: Trophy,
            name: 'Sports & Fitness',
            count: 1650,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
        },
        {
            icon: Theater,
            name: 'Theater & Comedy',
            count: 890,
            color: 'from-red-500 to-pink-500',
            bgColor: 'bg-red-50',
        },
        {
            icon: Dumbbell,
            name: 'Health & Wellness',
            count: 720,
            color: 'from-teal-500 to-cyan-500',
            bgColor: 'bg-teal-50',
        },
        {
            icon: Film,
            name: 'Film & Media',
            count: 680,
            color: 'from-violet-500 to-purple-500',
            bgColor: 'bg-violet-50',
        },
    ]

    return (
        <section className="section bg-gray-50">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Browse by <span className="gradient-text">Category</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Find events that match your interests. From music to sports, we have it all!
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={`/events?category=${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                            className={`${category.bgColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer animate-fade-in border-2 border-transparent hover:border-primary-200`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <category.icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Category Name */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                                {category.name}
                            </h3>

                            {/* Event Count */}
                            <p className="text-sm text-gray-600">
                                {category.count.toLocaleString()} events
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Browse All Link */}
                <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
                    <Link
                        href="/categories"
                        className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200 group"
                    >
                        View All Categories
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}