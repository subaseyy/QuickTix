<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="container mx-auto px-4">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>

            <!-- Event Details -->
            <div v-else-if="event" class="max-w-6xl mx-auto">
                <!-- Back Button -->
                <button @click="$router.back()" class="mb-6 flex items-center text-indigo-600 hover:text-indigo-800">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Events
                </button>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Main Content -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Event Image -->
                        <div class="bg-white rounded-lg shadow-md overflow-hidden">
                            <div
                                class="h-96 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                <img v-if="event.image_url" :src="event.image_url" :alt="event.title"
                                    class="w-full h-full object-cover" />
                                <div v-else class="text-white text-8xl font-bold">
                                    {{ event.title.charAt(0) }}
                                </div>
                            </div>
                        </div>

                        <!-- Event Info -->
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h1 class="text-3xl font-bold text-gray-900 mb-2">
                                        {{ event.title }}
                                    </h1>
                                    <span :class="[
                                        'inline-block px-3 py-1 rounded-full text-sm font-semibold',
                                        getStatusClass(event.status)
                                    ]">
                                        {{ event.status }}
                                    </span>
                                </div>
                                <div class="text-right">
                                    <p class="text-3xl font-bold text-indigo-600">
                                        ${{ parseFloat(event.ticket_price).toFixed(2) }}
                                    </p>
                                    <p class="text-sm text-gray-500">per ticket</p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <!-- Date & Time -->
                                <div class="flex items-center text-gray-700">
                                    <svg class="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p class="font-semibold">Date & Time</p>
                                        <p class="text-gray-600">{{ formatDate(event.event_date_time) }}</p>
                                    </div>
                                </div>

                                <!-- Venue -->
                                <div class="flex items-center text-gray-700">
                                    <svg class="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <p class="font-semibold">Venue</p>
                                        <p class="text-gray-600">{{ event.venue }}</p>
                                    </div>
                                </div>

                                <!-- Organizer -->
                                <div class="flex items-center text-gray-700">
                                    <svg class="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <p class="font-semibold">Organized by</p>
                                        <p class="text-gray-600">{{ event.organizer?.username || 'Unknown' }}</p>
                                    </div>
                                </div>

                                <!-- Tickets Available -->
                                <div class="flex items-center text-gray-700">
                                    <svg class="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                    <div>
                                        <p class="font-semibold">Tickets Available</p>
                                        <p class="text-gray-600">
                                            {{ event.available_tickets }} / {{ event.total_capacity }}
                                            <span v-if="ticketPercentage < 20" class="text-red-600 font-semibold ml-2">
                                                ({{ ticketPercentage }}% remaining!)
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="mt-6 pt-6 border-t border-gray-200">
                                <h2 class="text-xl font-bold text-gray-900 mb-3">About This Event</h2>
                                <p class="text-gray-700 whitespace-pre-line">{{ event.description }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Booking Card -->
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 class="text-2xl font-bold text-gray-900 mb-4">Book Tickets</h2>

                            <div v-if="!authStore.isAuthenticated" class="text-center py-6">
                                <p class="text-gray-600 mb-4">Please sign in to book tickets</p>
                                <router-link to="/auth/login"
                                    class="block w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                                    Sign In
                                </router-link>
                            </div>

                            <div v-else-if="event.available_tickets === 0" class="text-center py-6">
                                <svg class="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <p class="text-xl font-bold text-red-600 mb-2">Sold Out</p>
                                <p class="text-gray-600">All tickets have been sold</p>
                            </div>

                            <form v-else @submit.prevent="handleBooking" class="space-y-4">
                                <!-- Ticket Count -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Tickets
                                    </label>
                                    <input v-model.number="ticketCount" type="number" min="1"
                                        :max="Math.min(event.available_tickets, 10)"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    <p class="mt-1 text-xs text-gray-500">
                                        Maximum 10 tickets per booking
                                    </p>
                                </div>

                                <!-- Total Price -->
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-gray-700">Ticket Price</span>
                                        <span class="font-semibold">${{ parseFloat(event.ticket_price).toFixed(2)
                                            }}</span>
                                    </div>
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-gray-700">Quantity</span>
                                        <span class="font-semibold">× {{ ticketCount }}</span>
                                    </div>
                                    <div class="border-t border-gray-300 pt-2 mt-2">
                                        <div class="flex justify-between items-center">
                                            <span class="text-lg font-bold text-gray-900">Total</span>
                                            <span class="text-2xl font-bold text-indigo-600">
                                                ${{ totalPrice.toFixed(2) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Book Button -->
                                <button type="submit"
                                    :disabled="bookingLoading || ticketCount < 1 || ticketCount > event.available_tickets"
                                    class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span v-if="!bookingLoading">Book Now</span>
                                    <span v-else class="flex items-center justify-center">
                                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        Processing...
                                    </span>
                                </button>

                                <p class="text-xs text-gray-500 text-center">
                                    By booking, you agree to our terms and conditions
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Error State -->
            <div v-else class="text-center py-20">
                <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-4 text-xl font-medium text-gray-900">Event not found</h3>
                <p class="mt-2 text-gray-500">The event you're looking for doesn't exist or has been removed</p>
                <router-link to="/events"
                    class="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                    Browse Events
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const event = ref(null)
const loading = ref(false)
const bookingLoading = ref(false)
const ticketCount = ref(1)

const totalPrice = computed(() => {
    if (!event.value) return 0
    return parseFloat(event.value.ticket_price) * ticketCount.value
})

const ticketPercentage = computed(() => {
    if (!event.value) return 0
    return Math.round((event.value.available_tickets / event.value.total_capacity) * 100)
})

const fetchEvent = async () => {
    loading.value = true
    try {
        const response = await api.get(`/events/${route.params.id}/`)
        event.value = response.data
    } catch (error) {
        console.error('Failed to fetch event:', error)
        toast.error('Failed to load event details')
    } finally {
        loading.value = false
    }
}

const handleBooking = async () => {
    if (!authStore.isAuthenticated) {
        toast.error('Please sign in to book tickets')
        router.push('/auth/login')
        return
    }

    bookingLoading.value = true
    try {
        const response = await api.post('/bookings/', {
            event: event.value.id,
            tickets_count: ticketCount.value,
        })

        toast.success('Booking created successfully!')

        // Redirect to payment or booking details
        router.push(`/my-bookings`)
    } catch (error) {
        console.error('Booking failed:', error)
        const errorMsg = error.response?.data?.detail ||
            error.response?.data?.non_field_errors?.[0] ||
            'Failed to create booking. Please try again.'
        toast.error(errorMsg)
    } finally {
        bookingLoading.value = false
    }
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const getStatusClass = (status) => {
    const classes = {
        upcoming: 'bg-blue-100 text-blue-800',
        ongoing: 'bg-green-100 text-green-800',
        completed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
    fetchEvent()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>