'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser } from '@/lib/auth';
import api from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    categories: 4
  });

  useEffect(() => {
    setUser(getUser());
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await api.get('/events/');
      const events = response.data;
      setFeaturedEvents(events.slice(0, 3)); // Get first 3 events
      setStats({
        totalEvents: events.length,
        upcomingEvents: events.filter((e: any) => new Date(e.date) > new Date()).length,
        categories: 4
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const features = [
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Industry-standard encryption with Stripe integration for safe transactions'
    },
    {
      icon: '🎫',
      title: 'Instant Booking',
      description: 'Book your tickets in seconds with our streamlined checkout process'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Access your bookings anywhere with our responsive design'
    },
    {
      icon: '🛡️',
      title: 'Account Security',
      description: 'Advanced security features including brute-force protection and MFA'
    }
  ];

  const categories = [
    { name: 'Movies', icon: '🎬', color: 'bg-blue-500', count: 'Latest releases' },
    { name: 'Concerts', icon: '🎵', color: 'bg-purple-500', count: 'Live music' },
    { name: 'Sports', icon: '⚽', color: 'bg-green-500', count: 'Major leagues' },
    { name: 'Theater', icon: '🎭', color: 'bg-red-500', count: 'Broadway shows' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🎫 SecureTicket
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/events"
                    className="text-gray-900 hover:text-indigo-600 px-4 py-2 rounded-md text-base font-semibold transition-colors"
                  >
                    Browse Events
                  </Link>
                  <Link
                    href="/dashboard"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-md"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-900 hover:text-indigo-600 px-4 py-2 rounded-md text-base font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6">
              Book Your Next
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Amazing Experience
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto font-medium">
              Discover and book tickets for movies, concerts, sports events, and theater shows.
              Secure, fast, and hassle-free!
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/events"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
              >
                Explore Events →
              </Link>
              {!user && (
                <Link
                  href="/register"
                  className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl border-2 border-indigo-200"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border-2 border-indigo-100">
              <div className="text-5xl font-bold text-indigo-600 mb-2">{stats.totalEvents}+</div>
              <div className="text-gray-700 font-semibold text-lg">Total Events</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border-2 border-purple-100">
              <div className="text-5xl font-bold text-purple-600 mb-2">{stats.upcomingEvents}+</div>
              <div className="text-gray-700 font-semibold text-lg">Upcoming Events</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border-2 border-pink-100">
              <div className="text-5xl font-bold text-pink-600 mb-2">{stats.categories}</div>
              <div className="text-gray-700 font-semibold text-lg">Event Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Find the perfect event for your interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/events?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 hover:border-indigo-300 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${category.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform`}></div>
                <div className="relative">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 font-semibold">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Events
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Don't miss out on these popular events
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <span className="text-8xl">
                      {event.category === 'movie' ? '🎬' :
                        event.category === 'concert' ? '🎵' :
                          event.category === 'sports' ? '⚽' : '🎭'}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800">
                        {event.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 font-medium line-clamp-2">{event.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-indigo-600">${event.price}</span>
                      <Link
                        href={`/events/${event.id}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/events"
                className="inline-block bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg border-2 border-indigo-200"
              >
                View All Events →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose SecureTicket?
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Experience the most secure and convenient way to book tickets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 hover:border-indigo-300 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 font-medium">
            Join thousands of satisfied customers booking tickets with confidence
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <Link
                href="/events"
                className="bg-white hover:bg-gray-100 text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
              >
                Browse Events Now
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-white hover:bg-gray-100 text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl border-2 border-white/20"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                🎫 SecureTicket
              </h3>
              <p className="text-gray-400 font-medium">
                The most secure way to book your entertainment tickets online.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors font-medium">Browse Events</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors font-medium">Sign Up</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors font-medium">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><Link href="/events?category=movie" className="text-gray-400 hover:text-white transition-colors font-medium">Movies</Link></li>
                <li><Link href="/events?category=concert" className="text-gray-400 hover:text-white transition-colors font-medium">Concerts</Link></li>
                <li><Link href="/events?category=sports" className="text-gray-400 hover:text-white transition-colors font-medium">Sports</Link></li>
                <li><Link href="/events?category=theater" className="text-gray-400 hover:text-white transition-colors font-medium">Theater</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Security</h4>
              <ul className="space-y-2">
                <li className="text-gray-400 font-medium">🔒 SSL Encrypted</li>
                <li className="text-gray-400 font-medium">💳 PCI Compliant</li>
                <li className="text-gray-400 font-medium">🛡️ Brute-Force Protection</li>
                <li className="text-gray-400 font-medium">🔐 MFA Enabled</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 font-semibold">
              © 2026 SecureTicket. All rights reserved. Built with Django & Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}