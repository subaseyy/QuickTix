<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
            <div class="container mx-auto px-4">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-5xl md:text-6xl font-bold mb-6">
                        Welcome to QuickTix
                    </h1>
                    <p class="text-xl md:text-2xl mb-8">
                        Discover and book tickets for amazing events near you
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <router-link to="/events"
                            class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-center">
                            Browse Events
                        </router-link>
                        <router-link v-if="!authStore.isAuthenticated" to="/auth/register"
                            class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition text-center">
                            Sign Up
                        </router-link>
                        <router-link v-else to="/my-bookings"
                            class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition text-center">
                            My Bookings
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
                    Why Choose QuickTix?
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="bg-white p-6 rounded-lg shadow-md text-center">
                        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Fast Booking</h3>
                        <p class="text-gray-600">
                            Book your tickets in seconds with our streamlined process
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="bg-white p-6 rounded-lg shadow-md text-center">
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Secure Payments</h3>
                        <p class="text-gray-600">
                            Your transactions are protected with enterprise-grade security
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="bg-white p-6 rounded-lg shadow-md text-center">
                        <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Best Events</h3>
                        <p class="text-gray-600">
                            Discover handpicked events curated just for you
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Upcoming Events Section -->
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-3xl font-bold text-gray-900">
                        Upcoming Events
                    </h2>
                    <router-link to="/events" class="text-indigo-600 hover:text-indigo-800 font-semibold">
                        View All →
                    </router-link>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>

                <!-- Events Grid -->
                <div v-else-if="upcomingEvents.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="event in upcomingEvents" :key="event.id"
                        class="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                        @click="goToEvent(event.id)">
                        <!-- Event Image -->
                        <div
                            class="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                            <img v-if="event.image_url" :src="event.image_url" :alt="event.title"
                                class="w-full h-full object-cover" />
                            <div v-else class="text-white text-4xl font-bold">
                                {{ event.title.charAt(0) }}
                            </div>
                        </div>

                        <!-- Event Details -->
                        <div class="p-4">
                            <h3 class="text-lg font-bold text-gray-900 mb-2 truncate">
                                {{ event.title }}
                            </h3>

                            <div class="space-y-1 text-sm text-gray-600 mb-3">
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ formatDate(event.event_date_time) }}
                                </div>
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {{ event.venue }}
                                </div>
                            </div>

                            <div class="flex items-center justify-between">
                                <span class="text-xl font-bold text-indigo-600">
                                    ${{ parseFloat(event.ticket_price).toFixed(2) }}
                                </span>
                                <span class="text-xs text-gray-500">
                                    {{ event.available_tickets }} tickets left
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12">
                    <p class="text-gray-600">No upcoming events at the moment</p>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div class="container mx-auto px-4 text-center">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Get Started?
                </h2>
                <p class="text-xl mb-8">
                    Join thousands of event-goers and start booking today
                </p>
                <router-link v-if="!authStore.isAuthenticated" to="/auth/register"
                    class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                    Create Free Account
                </router-link>
                <router-link v-else to="/events"
                    class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                    Explore Events
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const router = useRouter()
const authStore = useAuthStore()

const upcomingEvents = ref([])
const loading = ref(false)

const fetchUpcomingEvents = async () => {
    loading.value = true
    try {
        const response = await api.get('/events/', {
            params: {
                status: 'upcoming',
                page_size: 6,
            }
        })
        upcomingEvents.value = response.data.results || response.data.slice(0, 6)
    } catch (error) {
        console.error('Failed to fetch events:', error)
    } finally {
        loading.value = false
    }
}

const goToEvent = (eventId) => {
    router.push(`/events/${eventId}`)
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

onMounted(() => {
    fetchUpcomingEvents()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>