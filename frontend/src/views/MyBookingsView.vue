<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
                <p class="text-gray-600">View and manage your event bookings</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>

            <!-- Bookings List -->
            <div v-else-if="bookings.length > 0" class="space-y-4">
                <div v-for="booking in bookings" :key="booking.id"
                    class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                        <!-- Booking Info -->
                        <div class="flex-1">
                            <div class="flex items-start justify-between mb-2">
                                <div>
                                    <h3 class="text-xl font-bold text-gray-900">
                                        {{ booking.event.title }}
                                    </h3>
                                    <p class="text-sm text-gray-500">
                                        Booking Reference: <span class="font-mono font-semibold">{{
                                            booking.booking_reference }}</span>
                                    </p>
                                </div>
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-semibold',
                                    getStatusClass(booking.status)
                                ]">
                                    {{ booking.status }}
                                </span>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <!-- Event Date -->
                                <div class="flex items-center text-gray-700">
                                    <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p class="text-sm font-medium">Event Date</p>
                                        <p class="text-sm">{{ formatDate(booking.event.event_date_time) }}</p>
                                    </div>
                                </div>

                                <!-- Booking Date -->
                                <div class="flex items-center text-gray-700">
                                    <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p class="text-sm font-medium">Booked On</p>
                                        <p class="text-sm">{{ formatDate(booking.booking_date) }}</p>
                                    </div>
                                </div>

                                <!-- Tickets -->
                                <div class="flex items-center text-gray-700">
                                    <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                    <div>
                                        <p class="text-sm font-medium">Tickets</p>
                                        <p class="text-sm">{{ booking.tickets_count }} ticket(s)</p>
                                    </div>
                                </div>

                                <!-- Total Amount -->
                                <div class="flex items-center text-gray-700">
                                    <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p class="text-sm font-medium">Total Amount</p>
                                        <p class="text-lg font-bold text-indigo-600">
                                            ${{ parseFloat(booking.total_amount).toFixed(2) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                            <router-link :to="`/events/${booking.event.id}`"
                                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center text-sm">
                                View Event
                            </router-link>

                            <button v-if="booking.status === 'pending' || booking.status === 'confirmed'"
                                @click="cancelBooking(booking.id)" :disabled="cancellingBookingId === booking.id"
                                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-center text-sm disabled:opacity-50">
                                <span v-if="cancellingBookingId !== booking.id">Cancel Booking</span>
                                <span v-else>Cancelling...</span>
                            </button>

                            <button v-if="booking.status === 'pending'" @click="proceedToPayment(booking)"
                                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center text-sm">
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
                <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 class="mt-4 text-xl font-medium text-gray-900">No bookings yet</h3>
                <p class="mt-2 text-gray-500">Start exploring events and make your first booking!</p>
                <router-link to="/events"
                    class="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                    Browse Events
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()

const bookings = ref([])
const loading = ref(false)
const cancellingBookingId = ref(null)

const fetchBookings = async () => {
    loading.value = true
    try {
        const response = await api.get('/bookings/my-bookings/')
        bookings.value = response.data.results || response.data
    } catch (error) {
        console.error('Failed to fetch bookings:', error)
        toast.error('Failed to load your bookings')
    } finally {
        loading.value = false
    }
}

const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return
    }

    cancellingBookingId.value = bookingId
    try {
        await api.delete(`/bookings/${bookingId}/`)
        toast.success('Booking cancelled successfully')

        // Remove booking from list or refetch
        bookings.value = bookings.value.filter(b => b.id !== bookingId)
    } catch (error) {
        console.error('Failed to cancel booking:', error)
        const errorMsg = error.response?.data?.detail || 'Failed to cancel booking'
        toast.error(errorMsg)
    } finally {
        cancellingBookingId.value = null
    }
}

const proceedToPayment = (booking) => {
    // TODO: Implement payment flow
    toast.info('Payment integration coming soon!')
    console.log('Proceeding to payment for booking:', booking)
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const getStatusClass = (status) => {
    const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
    // Ensure user is authenticated
    if (!authStore.isAuthenticated) {
        router.push('/auth/login')
        return
    }

    await fetchBookings()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>