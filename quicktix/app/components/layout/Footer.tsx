'use client'

import Link from 'next/link'
import { Ticket, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    const footerLinks = {
        product: [
            { label: 'Browse Events', href: '/events' },
            { label: 'How It Works', href: '/how-it-works' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Mobile App', href: '/mobile' },
        ],
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
            { label: 'Blog', href: '/blog' },
        ],
        support: [
            { label: 'Help Center', href: '/help' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'FAQs', href: '/faqs' },
            { label: 'Safety', href: '/safety' },
        ],
        organizers: [
            { label: 'Become an Organizer', href: '/become-organizer' },
            { label: 'Organizer Resources', href: '/resources' },
            { label: 'Success Stories', href: '/stories' },
            { label: 'Partner Program', href: '/partners' },
        ],
    }

    const socialLinks = [
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    ]

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer Content */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-6">
                            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-lg">
                                <Ticket className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">QuickTix</span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your trusted platform for discovering and booking amazing events.
                            From concerts to conferences, we make ticketing simple and secure.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-primary-500" />
                                <a href="mailto:support@quicktix.com" className="hover:text-white transition-colors duration-200">
                                    support@quicktix.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-primary-500" />
                                <a href="tel:+1234567890" className="hover:text-white transition-colors duration-200">
                                    +1 (234) 567-890
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-primary-500" />
                                <span>San Francisco, CA 94102</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Organizers Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">For Organizers</h3>
                        <ul className="space-y-3">
                            {footerLinks.organizers.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="border-t border-gray-800 pt-8 mb-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="text-white font-bold text-xl mb-2">Stay Updated</h3>
                        <p className="text-gray-400 mb-6">
                            Subscribe to our newsletter for the latest events and exclusive offers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <button className="btn btn-primary btn-md whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Links & Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200 group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                                </a>
                            ))}
                        </div>

                        {/* Copyright & Legal Links */}
                        <div className="text-center md:text-right">
                            <div className="flex flex-wrap justify-center md:justify-end gap-4 mb-2 text-sm">
                                <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms" className="hover:text-white transition-colors duration-200">
                                    Terms of Service
                                </Link>
                                <Link href="/cookies" className="hover:text-white transition-colors duration-200">
                                    Cookie Policy
                                </Link>
                            </div>
                            <p className="text-sm text-gray-500">
                                © {new Date().getFullYear()} QuickTix. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}