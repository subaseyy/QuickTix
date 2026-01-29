// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '@/api/axios'
import { toast } from 'vue3-toastify'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        accessToken: localStorage.getItem('access_token') || null,
        refreshToken: localStorage.getItem('refresh_token') || null,
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken && !!state.user,
        userRole: (state) => state.user?.role || 'guest',
        isAdmin: (state) => state.user?.role === 'admin',
        isOrganizer: (state) => state.user?.role === 'organizer',
        isUser: (state) => state.user?.role === 'user',
        fullName: (state) => {
            if (!state.user) return ''
            const { first_name, last_name } = state.user
            return [first_name, last_name].filter(Boolean).join(' ') || state.user.username
        },
    },

    actions: {
        /**
         * Login user with email and password
         */
        async login(credentials) {
            this.loading = true
            this.loginError = null

            try {
                const res = await api.post('/auth/token/', {
                    email: credentials.email,
                    password: credentials.password,
                })

                // Save both tokens
                this.token = res.data.access
                localStorage.setItem('access_token', res.data.access)

                if (res.data.refresh) {
                    localStorage.setItem('refresh_token', res.data.refresh)
                }

                // Fetch user profile
                await this.fetchUser()

                this.loading = false
                return true
            } catch (err) {
                this.loading = false
                this.loginError = err.response?.data?.detail || 'Login failed'
                console.error('Login error:', err)
                return false
            }
        },

        /**
         * Register new user
         */
        async register(userData) {
            this.loading = true
            try {
                await api.post('/users/', userData)
                toast.success('Registration successful! Please log in.')
                return true
            } catch (err) {
                // Handle validation errors
                if (err.response?.data) {
                    const errors = err.response.data

                    // Handle email errors
                    if (errors.email) {
                        toast.error(Array.isArray(errors.email) ? errors.email[0] : errors.email)
                    }
                    // Handle username errors
                    else if (errors.username) {
                        toast.error(Array.isArray(errors.username) ? errors.username[0] : errors.username)
                    }
                    // Handle password errors
                    else if (errors.password) {
                        toast.error(Array.isArray(errors.password) ? errors.password[0] : errors.password)
                    }
                    // Generic error
                    else {
                        toast.error('Registration failed. Please check your information.')
                    }
                } else {
                    toast.error('Registration failed. Please try again.')
                }
                return false
            } finally {
                this.loading = false
            }
        },

        /**
         * Fetch current user profile
         */
        async fetchUser() {
            if (!this.accessToken) return

            try {
                const res = await api.get('/users/profile/')
                this.user = res.data
            } catch (err) {
                console.error('Failed to fetch user:', err)
                // If fetching user fails, logout
                this.logout()
            }
        },

        /**
         * Update user profile
         */
        async updateProfile(userData) {
            this.loading = true
            try {
                const res = await api.patch('/users/profile/update/', userData)
                this.user = res.data
                toast.success('Profile updated successfully!')
                return true
            } catch (err) {
                const errorMsg = err.response?.data?.detail || 'Failed to update profile'
                toast.error(errorMsg)
                return false
            } finally {
                this.loading = false
            }
        },

        /**
         * Change password
         */
        async changePassword(passwordData) {
            this.loading = true
            try {
                await api.post('/users/change-password/', passwordData)
                toast.success('Password changed successfully!')
                return true
            } catch (err) {
                const errors = err.response?.data
                if (errors?.old_password) {
                    toast.error('Current password is incorrect')
                } else if (errors?.new_password) {
                    toast.error(Array.isArray(errors.new_password) ? errors.new_password[0] : errors.new_password)
                } else {
                    toast.error('Failed to change password')
                }
                return false
            } finally {
                this.loading = false
            }
        },

        /**
         * Logout user
         */
        logout() {
            this.user = null
            this.accessToken = null
            this.refreshToken = null

            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')

            delete api.defaults.headers.common['Authorization']

            toast.info('Logged out successfully')
        },

        /**
         * Initialize auth state (call on app mount)
         */
        async initialize() {
            if (this.accessToken) {
                await this.fetchUser()
            }
        },

        /**
         * Verify if token is still valid
         */
        async verifyToken() {
            if (!this.accessToken) return false

            try {
                await api.post('/auth/token/verify/', { token: this.accessToken })
                return true
            } catch (err) {
                return false
            }
        },
    },
})