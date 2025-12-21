// ============================================
// EXPORT ALL CUSTOM HOOKS
// ============================================



export * from './useEvents'
export * from './useBookings'
export * from './useOther'

// Re-export auth hook from context
export { useAuth } from '../contexts/AuthContext'

// ============================================
// RE-EXPORT ALL TYPES FOR CONVENIENCE
// ============================================

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
} from '../types'

// ============================================
// RE-EXPORT ALL SERVICES FOR CONVENIENCE
// ============================================

export {
    paymentsService,
    organizerService,
    statisticsService
} from '../services'

export { authService } from '../services/auth.service'
export { eventsService } from '../services/events.service'
export { bookingsService } from '../services/bookings.service'