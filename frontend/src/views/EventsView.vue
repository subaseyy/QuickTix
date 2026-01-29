<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">Discover Events</h1>
                <p class="text-gray-600">Find and book tickets for amazing events</p>
            </div>

            <!-- Search and Filters -->
            <div class="mb-8 flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <input v-model="searchQuery" type="text" placeholder="Search events..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        @input="debouncedSearch" />
                </div>
                <select v-model="statusFilter"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    @change="fetchEvents">
                    <option value="">All Events</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>

            <!-- Events Grid -->
            <div v-else-if="events.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="event in events" :key="event.id"
                    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    @click="goToEvent(event.id)">
                    <!-- Event Image -->
                    <div class="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                        <img v-if="event.image_url" :src="event.image_url" :alt="event.title"
                            class="w-full h-full object-cover" />
                        <div v-else class="text-white text-4xl font-bold">
                            {{ event.title.charAt(0) }}
                        </div>
                    </div>

                    <!-- Event Details -->
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-2 truncate">
                            {{ event.title }}
                        </h3>

                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                            {{ event.description }}
                        </p>

                        <!-- Event Info -->
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center text-gray-700">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {{ formatDate(event.event_date_time) }}
                            </div>

                            <div class="flex items-center text-gray-700">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {{ event.venue }}
                            </div>

                            <div class="flex items-center text-gray-700">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                                {{ event.available_tickets }} / {{ event.total_capacity }} tickets available
                            </div>
                        </div>

                        <!-- Price and Status -->
                        <div class="mt-4 flex items-center justify-between">
                            <span class="text-2xl font-bold text-indigo-600">
                                ${{ parseFloat(event.ticket_price).toFixed(2) }}
                            </span>
                            <span :class="[
                                'px-3 py-1 rounded-full text-xs font-semibold',
                                getStatusClass(event.status)
                            ]">
                                {{ event.status }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
                <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 class="mt-4 text-xl font-medium text-gray-900">No events found</h3>
                <p class="mt-2 text-gray-500">Try adjusting your search or filters</p>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.count > pagination.pageSize" class="mt-8 flex justify-center">
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button :disabled="!pagination.previous" @click="goToPage(pagination.currentPage - 1)"
                        class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <span
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
                    </span>
                    <button :disabled="!pagination.next" @click="goToPage(pagination.currentPage + 1)"
                        class="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { toast } from 'vue3-toastify'

const router = useRouter()

const events = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')

const pagination = ref({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 9,
    totalPages: 1,
})

let searchTimeout = null

const fetchEvents = async (page = 1) => {
    loading.value = true
    try {
        const params = {
            page,
            page_size: pagination.value.pageSize,
        }

        if (searchQuery.value) {
            params.search = searchQuery.value
        }

        if (statusFilter.value) {
            params.status = statusFilter.value
        }

        const response = await api.get('/events/', { params })

        events.value = response.data.results || response.data
        pagination.value = {
            count: response.data.count || events.value.length,
            next: response.data.next,
            previous: response.data.previous,
            currentPage: page,
            pageSize: pagination.value.pageSize,
            totalPages: response.data.count ? Math.ceil(response.data.count / pagination.value.pageSize) : 1,
        }
    } catch (error) {
        console.error('Failed to fetch events:', error)
        toast.error('Failed to load events. Please try again.')
    } finally {
        loading.value = false
    }
}

const debouncedSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchEvents(1)
    }, 500)
}

const goToPage = (page) => {
    fetchEvents(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToEvent = (eventId) => {
    router.push(`/events/${eventId}`)
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
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
    fetchEvents()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>