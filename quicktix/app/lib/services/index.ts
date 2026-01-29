import api, { handleApiError, ApiError } from '../api'

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'user' | 'organizer' | 'admin'
  status: 'active' | 'pending' | 'suspended'
  phone_number?: string
  date_of_birth?: string
  gender?: string
  bio?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  profile_picture?: string
  email_notifications: boolean
  sms_notifications: boolean
  date_joined: string
  age?: number
  is_adult?: boolean
  full_address?: string
}

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

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

export interface ChangePasswordData {
  old_password: string
  new_password: string
  new_password2: string
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  username?: string
  email?: string
  phone_number?: string
  date_of_birth?: string
  gender?: string
  bio?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  email_notifications?: boolean
  sms_notifications?: boolean
}

// ============================================
// AUTHENTICATION SERVICES
// ============================================

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/token/', credentials)

      // Save tokens and user to localStorage
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<User> {
    try {
      const response = await api.post<User>('/users/', data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    try {
      const response = await api.post<{ access: string }>('/auth/token/refresh/', {
        refresh: refreshToken,
      })

      localStorage.setItem('accessToken', response.data.access)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Verify if token is valid
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      await api.post('/auth/token/verify/', { token })
      return true
    } catch (error) {
      return false
    }
  },
}

// ============================================
// USER/PROFILE SERVICES
// ============================================

export const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/users/profile/')

      // Update localStorage with latest user data
      localStorage.setItem('user', JSON.stringify(response.data))

      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await api.patch<User>('/users/profile/update/', data)

      // Update localStorage with updated user data
      localStorage.setItem('user', JSON.stringify(response.data))

      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await api.patch<{ message: string }>('/users/change-password/', data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Check password strength
   */
  async checkPasswordStrength(password: string): Promise<{
    is_valid: boolean
    strength: string
    score: number
    feedback: string[]
    requirements: {
      min_length: boolean
      has_uppercase: boolean
      has_lowercase: boolean
      has_digit: boolean
      has_special: boolean
    }
  }> {
    try {
      const response = await api.post('/users/check-password-strength/', { password })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get user by ID (admin only)
   */
  async getUserById(id: number): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${id}/`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Update user by ID (admin only)
   */
  async updateUserById(id: number, data: Partial<User>): Promise<User> {
    try {
      const response = await api.patch<User>(`/users/${id}/`, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Delete user by ID (admin only)
   */
  async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/users/${id}/`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers(params?: {
    page?: number
    search?: string
    role?: string
    status?: string
  }): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: User[]
  }> {
    try {
      const response = await api.get('/users/', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

// ============================================
// STATISTICS SERVICES
// ============================================

export const statsService = {
  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    total_bookings: number
    total_tickets: number
    total_spent: number
    upcoming_events: number
  }> {
    try {
      const response = await api.get('/statistics/user/')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get organizer statistics
   */
  async getOrganizerStats(): Promise<{
    total_events: number
    active_events: number
    total_bookings: number
    total_tickets_sold: number
    total_revenue: number
  }> {
    try {
      const response = await api.get('/statistics/organizer/')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get platform statistics (admin only)
   */
  async getPlatformStats(): Promise<{
    total_users: number
    total_organizers: number
    total_events: number
    active_events: number
    total_bookings: number
    total_revenue: number
    pending_applications: number
  }> {
    try {
      const response = await api.get('/statistics/platform/')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null

  const userStr = localStorage.getItem('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('accessToken')
}

/**
 * Get access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refreshToken')
}

// Export everything as a single object
const apiService = {
  auth: authService,
  user: userService,
  stats: statsService,
  getCurrentUser,
  isAuthenticated,
  getAccessToken,
  getRefreshToken,
}

export default apiService