// User Types
export interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    role: 'user' | 'organizer' | 'admin'
    status: 'active' | 'pending' | 'suspended'
    date_of_birth?: string
    age?: number
    is_adult?: boolean
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
    phone_number?: string
    profile_picture?: string
    bio?: string
    address_line1?: string
    address_line2?: string
    city?: string
    state?: string
    country?: string
    postal_code?: string
    full_address?: string
    email_notifications: boolean
    sms_notifications: boolean
    date_joined: string
}

export interface UserProfile extends User {
    total_bookings?: number
    total_events_organized?: number
}

// Auth Types
export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    username: string
    email: string
    password: string
    password2: string
    first_name: string
    last_name: string
    date_of_birth?: string
    gender?: string
    phone_number?: string
    city?: string
    country?: string
}

export interface AuthTokens {
    access: string
    refresh: string
}

export interface AuthResponse {
    access: string
    refresh: string
    user: User
}

export interface PasswordChange {
    old_password: string
    new_password: string
    new_password2: string
}

export interface PasswordStrength {
    is_valid: boolean
    strength: 'weak' | 'medium' | 'strong'
    score: number
    feedback: string[]
    requirements: {
        min_length: boolean
        has_uppercase: boolean
        has_lowercase: boolean
        has_digit: boolean
        has_special: boolean
    }
}

// Event Types
export interface Event {
    id: number
    title: string
    description?: string
    event_date_time: string
    venue: string
    ticket_price: number
    total_capacity: number
    available_tickets: number
    tickets_sold?: number
    is_sold_out?: boolean
    image_url?: string
    status: 'active' | 'cancelled' | 'completed' | 'draft'
    organizer: User | number
    organizer_name?: string
    created_at: string
    updated_at: string
    total_revenue?: number
    total_bookings?: number
}

export interface EventCreate {
    title: string
    description?: string
    event_date_time: string
    venue: string
    ticket_price: number
    total_capacity: number
    image_url?: string
    status?: 'active' | 'draft'
}

export interface EventFilters {
    status?: string
    organizer?: number
    search?: string
    ordering?: string
    page?: number
}

// Booking Types
export interface Booking {
    id: number
    booking_reference: string
    event: Event | number
    event_title?: string
    event_date?: string
    user: User | number
    user_email?: string
    tickets_count: number
    total_amount: number
    booking_date: string
    status: 'confirmed' | 'cancelled' | 'refunded' | 'pending'
    payment?: Payment
    payment_status?: string
    created_at: string
    updated_at: string
}

export interface BookingCreate {
    event_id: number
    tickets_count: number
}

export interface BookingFilters {
    status?: string
    event?: number
    ordering?: string
    page?: number
}

// Payment Types
export interface Payment {
    id: number
    booking: number
    booking_reference?: string
    amount: number
    payment_method: 'stripe' | 'paypal' | 'razorpay'
    transaction_id?: string
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    payment_date?: string
    created_at: string
}

export interface PaymentCreate {
    booking_id: number
    payment_method: 'stripe' | 'paypal' | 'razorpay'
}

// Organizer Application Types
export interface OrganizerApplication {
    id: number
    user: User
    application_reason: string
    status: 'pending' | 'approved' | 'rejected'
    reviewed_by_name?: string
    admin_notes?: string
    applied_at: string
    reviewed_at?: string
}

export interface OrganizerApplicationCreate {
    application_reason: string
}

export interface OrganizerApplicationReview {
    status: 'approved' | 'rejected'
    admin_notes?: string
}

// Statistics Types
export interface PlatformStatistics {
    total_users: number
    total_organizers: number
    total_events: number
    active_events: number
    total_bookings: number
    total_revenue: number
    pending_applications: number
}

export interface OrganizerStatistics {
    total_events: number
    active_events: number
    total_bookings: number
    total_tickets_sold: number
    total_revenue: number
}

export interface UserStatistics {
    total_bookings: number
    total_tickets: number
    total_spent: number
    upcoming_events: number
}

// API Response Types
export interface ApiError {
    message: string
    status?: number
    errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// Form Types
export interface ContactFormData {
    name: string
    email: string
    subject: string
    category: 'general' | 'support' | 'organizer' | 'billing' | 'partnership' | 'feedback'
    message: string
}

// Search/Filter Types
export interface SearchParams {
    query?: string
    category?: string
    location?: string
    date?: string
    min_price?: number
    max_price?: number
    page?: number
    ordering?: string
}