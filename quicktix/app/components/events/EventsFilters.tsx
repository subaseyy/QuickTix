'use client'

import { useState } from 'react'
import { Calendar, MapPin, DollarSign, Tag, X } from 'lucide-react'

export default function EventsFilters() {
    const [activeFilters, setActiveFilters] = useState<string[]>([])

    const categories = [
        { id: 'music', name: 'Music & Concerts', count: 850 },
        { id: 'business', name: 'Business & Conferences', count: 620 },
        { id: 'arts', name: 'Arts & Culture', count: 430 },
        { id: 'food', name: 'Food & Drink', count: 350 },
        { id: 'sports', name: 'Sports & Fitness', count: 540 },
        { id: 'theater', name: 'Theater & Comedy', count: 290 },
        { id: 'health', name: 'Health & Wellness', count: 240 },
        { id: 'film', name: 'Film & Media', count: 220 },
    ]

    const dates = [
        { id: 'today', label: 'Today' },
        { id: 'tomorrow', label: 'Tomorrow' },
        { id: 'this-week', label: 'This Week' },
        { id: 'this-weekend', label: 'This Weekend' },
        { id: 'next-week', label: 'Next Week' },
        { id: 'this-month', label: 'This Month' },
    ]

    const locations = [
        { id: 'san-francisco', name: 'San Francisco', count: 342 },
        { id: 'new-york', name: 'New York', count: 428 },
        { id: 'los-angeles', name: 'Los Angeles', count: 315 },
        { id: 'chicago', name: 'Chicago', count: 267 },
        { id: 'austin', name: 'Austin', count: 198 },
    ]

    const priceRanges = [
        { id: 'free', label: 'Free', min: 0, max: 0 },
        { id: 'under-50', label: 'Under $50', min: 0, max: 50 },
        { id: '50-100', label: '$50 - $100', min: 50, max: 100 },
        { id: '100-200', label: '$100 - $200', min: 100, max: 200 },
        { id: 'over-200', label: 'Over $200', min: 200, max: 999999 },
    ]

    const clearAllFilters = () => {
        setActiveFilters([])
    }

    return (
        <div className="space-y-6">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Active Filters</h3>
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {activeFilters.map((filter) => (
                            <span
                                key={filter}
                                className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                            >
                                {filter}
                                <button
                                    onClick={() =>
                                        setActiveFilters(activeFilters.filter((f) => f !== filter))
                                    }
                                    className="hover:bg-primary-200 rounded-full p-0.5 transition-colors duration-200"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-gray-900">Categories</h3>
                </div>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <label
                            key={category.id}
                            className="flex items-center justify-between cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-gray-700 group-hover:text-primary-600 transition-colors duration-200">
                                    {category.name}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">{category.count}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Date */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-gray-900">Date</h3>
                </div>
                <div className="space-y-3">
                    {dates.map((date) => (
                        <label key={date.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="date"
                                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                            />
                            <span className="text-gray-700 group-hover:text-primary-600 transition-colors duration-200">
                                {date.label}
                            </span>
                        </label>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Custom Date Range
                    </button>
                </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-gray-900">Location</h3>
                </div>
                <div className="space-y-3">
                    {locations.map((location) => (
                        <label
                            key={location.id}
                            className="flex items-center justify-between cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-gray-700 group-hover:text-primary-600 transition-colors duration-200">
                                    {location.name}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">{location.count}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Show More Locations
                    </button>
                </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-gray-900">Price Range</h3>
                </div>
                <div className="space-y-3">
                    {priceRanges.map((range) => (
                        <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-gray-700 group-hover:text-primary-600 transition-colors duration-200">
                                {range.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Apply Filters Button */}
            <button className="w-full btn btn-primary btn-lg">
                Apply Filters
            </button>
        </div>
    )
}