'use client'

import { Search, SlidersHorizontal, Grid3x3, List } from 'lucide-react'
import { useState } from 'react'

export default function EventsHeader() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)

    return (
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
            <div className="container-custom">
                {/* Title & Breadcrumb */}
                <div className="mb-8">
                    <div className="text-white/80 text-sm mb-2">
                        <span className="hover:underline cursor-pointer">Home</span>
                        <span className="mx-2">/</span>
                        <span>Events</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Discover Events
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl">
                        Find your next experience from thousands of amazing events
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-2xl p-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                        {/* Search Input */}
                        <div className="flex-1 flex items-center px-4 py-3 sm:py-0">
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Search events, artists, venues..."
                                className="w-full text-gray-900 placeholder-gray-400 focus:outline-none"
                            />
                        </div>

                        {/* Filter Toggle (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden btn btn-outline btn-md flex items-center justify-center gap-2"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            Filters
                        </button>

                        {/* Search Button */}
                        <button className="btn btn-primary btn-md whitespace-nowrap">
                            Search Events
                        </button>
                    </div>
                </div>

                {/* Results Info & View Toggle */}
                <div className="flex items-center justify-between mt-6 text-white">
                    <div>
                        <span className="text-lg font-semibold">2,847 events</span>
                        <span className="text-white/80 ml-2">found</span>
                    </div>

                    <div className="hidden sm:flex items-center gap-4">
                        {/* Sort Dropdown */}
                        <select className="bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50">
                            <option value="recommended">Recommended</option>
                            <option value="date">Date</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="popular">Most Popular</option>
                        </select>

                        {/* View Mode Toggle */}
                        <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-colors duration-200 ${viewMode === 'grid'
                                        ? 'bg-white text-primary-600'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition-colors duration-200 ${viewMode === 'list'
                                        ? 'bg-white text-primary-600'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}