'use client'

import { useState } from 'react'
import { Heart, Share2, Calendar, MapPin, ChevronLeft, X } from 'lucide-react'
import Link from 'next/link'

export default function EventHero({ eventId }: { eventId: string }) {
    const [isLiked, setIsLiked] = useState(false)
    const [showGallery, setShowGallery] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)

    const images = [
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200',
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200',
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200',
    ]

    return (
        <>
            {/* Hero Section */}
            <div className="relative h-[500px] overflow-hidden bg-black">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${images[0]})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative h-full container-custom flex flex-col justify-end pb-12">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <div className="flex items-center text-white/80 text-sm mb-4">
                            <Link href="/" className="hover:text-white transition-colors">
                                Home
                            </Link>
                            <ChevronLeft className="w-4 h-4 mx-2 rotate-180" />
                            <Link href="/events" className="hover:text-white transition-colors">
                                Events
                            </Link>
                            <ChevronLeft className="w-4 h-4 mx-2 rotate-180" />
                            <span className="text-white">Event Details</span>
                        </div>
                    </div>

                    {/* Event Title & Quick Info */}
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                                Music Festival
                            </span>
                            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                                Hot Event
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Summer Music Festival 2025
                        </h1>

                        <div className="flex flex-wrap gap-6 text-white/90 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span className="text-lg">June 20, 2025 • 6:00 PM</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <span className="text-lg">Central Park, New York</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${isLiked
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                {isLiked ? 'Liked' : 'Save Event'}
                            </button>

                            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white font-semibold hover:bg-white/20 transition-all duration-200">
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>

                            <button
                                onClick={() => setShowGallery(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white font-semibold hover:bg-white/20 transition-all duration-200"
                            >
                                View Photos ({images.length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Image Thumbnails */}
                <div className="absolute bottom-0 right-0 p-6 hidden lg:flex gap-2">
                    {images.slice(0, 4).map((image, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentImage(index)
                                setShowGallery(true)
                            }}
                            className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white/50 hover:border-white transition-colors duration-200"
                        >
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${image})` }}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Full Screen Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                    {/* Close Button */}
                    <button
                        onClick={() => setShowGallery(false)}
                        className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-200 z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        className="absolute left-6 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-200 z-10"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Image */}
                    <div className="max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center p-6">
                        <img
                            src={images[currentImage]}
                            alt={`Event image ${currentImage + 1}`}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-6 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-200 z-10"
                    >
                        <ChevronLeft className="w-6 h-6 rotate-180" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white font-semibold">
                        {currentImage + 1} / {images.length}
                    </div>

                    {/* Thumbnails */}
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImage(index)}
                                className={`w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${currentImage === index
                                        ? 'border-2 border-white scale-110'
                                        : 'border-2 border-white/30 opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${image})` }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}