import api, { handleApiError, PaginatedResponse } from '@/app/lib/api'
import type { Booking, BookingCreate, BookingFilters } from '../types'

// Bookings Service
export const bookingsService = {
    // Get all bookings with filters
    async getBookings(filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
        try {
            const params = new URLSearchParams()

            if (filters?.status) params.append('status', filters.status)
            if (filters?.event) params.append('event', filters.event.toString())
            if (filters?.ordering) params.append('ordering', filters.ordering)
            if (filters?.page) params.append('page', filters.page.toString())

            const response = await api.get<PaginatedResponse<Booking>>('/bookings/', { params })
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get single booking by ID
    async getBooking(id: number): Promise<Booking> {
        try {
            const response = await api.get<Booking>(`/bookings/${id}/`)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Create new booking
    async createBooking(data: BookingCreate): Promise<Booking> {
        try {
            const response = await api.post<Booking>('/bookings/', data)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get my bookings
    async getMyBookings(): Promise<Booking[]> {
        try {
            const response = await api.get<Booking[]>('/bookings/my-bookings/')
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Cancel booking
    async cancelBooking(id: number): Promise<{ message: string }> {
        try {
            const response = await api.post<{ message: string }>(`/bookings/${id}/cancel/`)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },
}

export default bookingsService