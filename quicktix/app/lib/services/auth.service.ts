import api, { handleApiError } from '@/app/lib/api'
import { LoginCredentials, AuthResponse, AuthTokens, RegisterData, User, PasswordChange, PasswordStrength } from '../types'


// Auth Service
export const authService = {
    // Login
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthTokens>('/auth/token/', credentials)

            // Get user profile after login
            const userResponse = await api.get<User>('/users/profile/', {
                headers: {
                    Authorization: `Bearer ${response.data.access}`,
                },
            })

            return {
                ...response.data,
                user: userResponse.data,
            }
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Register
    async register(data: RegisterData): Promise<User> {
        try {
            const response = await api.post<User>('/users/', data)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Refresh token
    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        try {
            const response = await api.post<AuthTokens>('/auth/token/refresh/', {
                refresh: refreshToken,
            })
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Verify token
    async verifyToken(token: string): Promise<boolean> {
        try {
            await api.post('/auth/token/verify/', { token })
            return true
        } catch (error) {
            return false
        }
    },

    // Logout (client-side only)
    logout(): void {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
    },

    // Get current user
    async getCurrentUser(): Promise<User> {
        try {
            const response = await api.get<User>('/users/profile/')
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Update profile
    async updateProfile(data: Partial<User>): Promise<User> {
        try {
            const response = await api.patch<User>('/users/profile/update/', data)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Change password
    async changePassword(data: PasswordChange): Promise<{ message: string }> {
        try {
            const response = await api.post<{ message: string }>('/users/change-password/', data)
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Check password strength
    async checkPasswordStrength(password: string): Promise<PasswordStrength> {
        try {
            const response = await api.post<PasswordStrength>('/users/check-password-strength/', {
                password,
            })
            return response.data
        } catch (error) {
            throw handleApiError(error)
        }
    },

    // Get tokens from storage
    getTokens(): AuthTokens | null {
        if (typeof window === 'undefined') return null

        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (!accessToken || !refreshToken) return null

        return {
            access: accessToken,
            refresh: refreshToken,
        }
    },

    // Save tokens to storage
    saveTokens(tokens: AuthTokens): void {
        localStorage.setItem('accessToken', tokens.access)
        localStorage.setItem('refreshToken', tokens.refresh)
    },

    // Get user from storage
    getUserFromStorage(): User | null {
        if (typeof window === 'undefined') return null

        const userStr = localStorage.getItem('user')
        if (!userStr) return null

        try {
            return JSON.parse(userStr)
        } catch {
            return null
        }
    },

    // Save user to storage
    saveUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user))
    },
}

export default authService