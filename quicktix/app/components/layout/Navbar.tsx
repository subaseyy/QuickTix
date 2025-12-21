'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Ticket, User, Search } from 'lucide-react'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { href: '/events', label: 'Browse Events' },
        { href: '/how-it-works', label: 'How It Works' },
        { href: '/become-organizer', label: 'Become an Organizer' },
        { href: '/about', label: 'About' },
    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-md'
                    : 'bg-transparent'
                }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                            <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">QuickTix</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`font-medium transition-colors duration-200 ${isScrolled
                                        ? 'text-gray-700 hover:text-primary-600'
                                        : 'text-white hover:text-primary-200'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <button
                            className={`p-2 rounded-lg transition-colors duration-200 ${isScrolled
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-white hover:bg-white/10'
                                }`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <Link
                            href="/login"
                            className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${isScrolled
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-white hover:bg-white/10'
                                }`}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="btn btn-primary btn-md"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${isScrolled
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-white hover:bg-white/10'
                            }`}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t animate-slide-down">
                    <div className="container-custom py-4 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 space-y-3 border-t">
                            <Link
                                href="/login"
                                className="block w-full text-center btn btn-outline btn-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full text-center btn btn-primary btn-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}