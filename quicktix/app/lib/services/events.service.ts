// import  PaginatedResponse } from ''
import api, { handleApiError, PaginatedResponse } from '@/app/lib/api'
import type { Event, EventCreate, EventFilters } from '../types'

// Events Service
export const eventsService = {
    // Get all events with filters
    async getEvents(filters?: EventFilters): Promise<PaginatedResponse<Event>> {
        try {
            const params = new URLSearchParams()

            if (filters?.status) params.append('status', filters.status)
            if (filters?.organizer) params.append('organizer', filters.organizer.toString())
            if (filters?.search) params.append('search', filters.search)
            if (filters?.ordering) params.append('ordering', filters.ordering)
            if (filters?.page) params.append('page', filters.page.toString())

            const response = await api.get<PaginatedResponse<Event>>('/events/', { params })
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get single event by ID
    async getEvent(id: number): Promise<Event> {
        try {
            const response = await api.get<Event>(`/events/${id}/`)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Create new event
    async createEvent(data: EventCreate): Promise<Event> {
        try {
            const response = await api.post<Event>('/events/', data)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Update event
    async updateEvent(id: number, data: Partial<EventCreate>): Promise<Event> {
        try {
            const response = await api.patch<Event>(`/events/${id}/`, data)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Delete event
    async deleteEvent(id: number): Promise<void> {
        try {
            await api.delete(`/events/${id}/`)
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get my events (organizer)
    async getMyEvents(): Promise<Event[]> {
        try {
            const response = await api.get<Event[]>('/events/my-events/')
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get event attendees
    async getEventAttendees(id: number): Promise<any[]> {
        try {
            const response = await api.get(`/events/${id}/attendees/`)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get event statistics
    async getEventStatistics(id: number): Promise<{
        total_bookings: number
        tickets_sold: number
        available_tickets: number
        total_revenue: number
        occupancy_rate: number
    }> {
        try {
            const response = await api.get(`/events/${id}/statistics/`)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Cancel event
    async cancelEvent(id: number): Promise<{ message: string }> {
        try {
            const response = await api.post<{ message: string }>(`/events/${id}/cancel/`)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },
}

export default eventsService