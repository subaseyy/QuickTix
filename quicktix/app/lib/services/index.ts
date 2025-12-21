import api, { handleApiError, PaginatedResponse } from '../api'
import type {
    Payment,
    PaymentCreate,
    OrganizerApplication,
    OrganizerApplicationCreate,
    OrganizerApplicationReview,
    PlatformStatistics,
    OrganizerStatistics,
    UserStatistics,
} from '../types'

// ============================================
// RE-EXPORT ALL TYPES FOR CONVENIENCE
// ============================================
// Now you can import both services AND types from '@/lib/services'

export type {
    // User & Auth Types
    User,
    UserProfile,
    LoginCredentials,
    RegisterData,
    AuthTokens,
    AuthResponse,
    PasswordChange,
    PasswordStrength,

    // Event Types
    Event,
    EventCreate,
    EventFilters,

    // Booking Types
    Booking,
    BookingCreate,
    BookingFilters,

    // Payment Types
    Payment,
    PaymentCreate,

    // Organizer Application Types
    OrganizerApplication,
    OrganizerApplicationCreate,
    OrganizerApplicationReview,

    // Statistics Types
    PlatformStatistics,
    OrganizerStatistics,
    UserStatistics,

    // API Response Types
    ApiError,
    PaginatedResponse,

    // Form Types
    ContactFormData,
    SearchParams,
} from '../types/index'

// Payments Service
export const paymentsService = {
    // Get all payments
    async getPayments(filters?: { page?: number }): Promise<PaginatedResponse<Payment>> {
        try {
            const params = new URLSearchParams()
            if (filters?.page) params.append('page', filters.page.toString())

            const response = await api.get<PaginatedResponse<Payment>>('/payments/', { params })
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get single payment
    async getPayment(id: number): Promise<Payment> {
        try {
            const response = await api.get<Payment>(`/payments/${id}/`)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Create payment
    async createPayment(data: PaymentCreate): Promise<Payment> {
        try {
            const response = await api.post<Payment>('/payments/', data)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get my payments
    async getMyPayments(): Promise<Payment[]> {
        try {
            const response = await api.get<Payment[]>('/payments/my-payments/')
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Process payment
    async processPayment(id: number): Promise<{ message: string; transaction_id: string }> {
        try {
            const response = await api.post(`/payments/${id}/process/`)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },
}

// Organizer Applications Service
export const organizerService = {
    // Get all applications
    async getApplications(filters?: { page?: number }): Promise<PaginatedResponse<OrganizerApplication>> {
        try {
            const params = new URLSearchParams()
            if (filters?.page) params.append('page', filters.page.toString())

            const response = await api.get<PaginatedResponse<OrganizerApplication>>(
                '/organizer-applications/',
                { params }
            )
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get single application
    async getApplication(id: number): Promise<OrganizerApplication> {
        try {
            const response = await api.get<OrganizerApplication>(`/organizer-applications/${id}/`)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Create application
    async createApplication(data: OrganizerApplicationCreate): Promise<OrganizerApplication> {
        try {
            const response = await api.post<OrganizerApplication>('/organizer-applications/', data)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get my applications
    async getMyApplications(): Promise<OrganizerApplication[]> {
        try {
            const response = await api.get<OrganizerApplication[]>(
                '/organizer-applications/my-applications/'
            )
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get pending applications (admin only)
    async getPendingApplications(): Promise<OrganizerApplication[]> {
        try {
            const response = await api.get<OrganizerApplication[]>(
                '/organizer-applications/pending/'
            )
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Review application (admin only)
    async reviewApplication(
        id: number,
        data: OrganizerApplicationReview
    ): Promise<OrganizerApplication> {
        try {
            const response = await api.post<OrganizerApplication>(
                `/organizer-applications/${id}/review/`,
                data
            )
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Approve application
    async approveApplication(
        id: number,
        adminNotes?: string
    ): Promise<{ message: string }> {
        try {
            const response = await api.post<{ message: string }>(
                `/organizer-applications/${id}/approve/`,
                { admin_notes: adminNotes }
            )
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Reject application
    async rejectApplication(
        id: number,
        adminNotes?: string
    ): Promise<{ message: string }> {
        try {
            const response = await api.post<{ message: string }>(
                `/organizer-applications/${id}/reject/`,
                { admin_notes: adminNotes }
            )
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },
}

// Statistics Service
export const statisticsService = {
    // Get platform statistics (admin only)
    async getPlatformStatistics(): Promise<PlatformStatistics> {
        try {
            const response = await api.get<PlatformStatistics>('/statistics/platform/')
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get organizer statistics
    async getOrganizerStatistics(): Promise<OrganizerStatistics> {
        try {
            const response = await api.get<OrganizerStatistics>('/statistics/organizer/')
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get user statistics
    async getUserStatistics(): Promise<UserStatistics> {
        try {
            const response = await api.get<UserStatistics>('/statistics/user/')
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
    payments: paymentsService,
    organizer: organizerService,
    statistics: statisticsService,
}

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Import services (functions):
import { paymentsService, organizerService, statisticsService } from '@/lib/services'

// Import types (interfaces):
import type { User, Event, Booking, Payment } from '@/lib/services'

// Or import both at once:
import { paymentsService, type User, type Event } from '@/lib/services'

// Or use default import:
import services from '@/lib/services'
services.payments.getMyPayments()
*/