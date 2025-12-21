'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Ticket, Search, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react'
import { useAuth } from '@/app/lib/hooks'


export default function Navbar() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen])

    const handleLogout = () => {
        logout()
        setIsDropdownOpen(false)
        router.push('/')
    }

    const getDashboardLink = () => {
        if (!user) return '/dashboard'

        switch (user.role) {
            case 'admin':
                return '/admin/dashboard'
            case 'organizer':
                return '/organizer/dashboard'
            default:
                return '/dashboard'
        }
    }

    const getProfileLink = () => {
        if (!user) return '/dashboard'

        switch (user.role) {
            case 'admin':
                return '/admin/dashboard/profile'
            case 'organizer':
                return '/organizer/dashboard/profile'
            default:
                return '/dashboard/profile'
        }
    }

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

                        {user ? (
                            // Authenticated User Dropdown
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${isScrolled
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <span>Hi, {user.first_name || user.username}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-slide-down">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.first_name} {user.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                                                {user.role === 'admin' ? 'Admin' : user.role === 'organizer' ? 'Organizer' : 'User'}
                                            </span>
                                        </div>

                                        <Link
                                            href={getDashboardLink()}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            href={getProfileLink()}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Unauthenticated Actions
                            <>
                                <Link
                                    href="/auth/login"
                                    className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${isScrolled
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="btn btn-primary btn-md"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
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
                                href="/auth/login"
                                className="block w-full text-center btn btn-outline btn-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/register"
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