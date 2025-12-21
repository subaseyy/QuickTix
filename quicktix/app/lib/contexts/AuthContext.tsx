'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'


import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import authService from '@/app/lib/services/auth.service'
import { LoginCredentials, RegisterData, User } from '../types'
// import { LoginCredentials, RegisterData, User } from '@/app/lib/services/auth.service'

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => void
    updateUser: (data: Partial<User>) => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth()
    }, [])

    // Check authentication status
    const checkAuth = async () => {
        try {
            const tokens = authService.getTokens()
            const storedUser = authService.getUserFromStorage()

            if (tokens && storedUser) {
                // Verify token is still valid
                const isValid = await authService.verifyToken(tokens.access)

                if (isValid) {
                    setUser(storedUser)
                } else {
                    // Try to refresh token
                    try {
                        const newTokens = await authService.refreshToken(tokens.refresh)
                        authService.saveTokens(newTokens)

                        // Get fresh user data
                        const userData = await authService.getCurrentUser()
                        setUser(userData)
                        authService.saveUser(userData)
                    } catch (error) {
                        // Refresh failed, clear auth
                        handleLogout()
                    }
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            handleLogout()
        } finally {
            setIsLoading(false)
        }
    }

    // Login function
    const login = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true)
            const response = await authService.login(credentials)

            // Save tokens and user data
            authService.saveTokens({
                access: response.access,
                refresh: response.refresh,
            })
            authService.saveUser(response.user)

            setUser(response.user)

            toast.success(`Welcome back, ${response.user.first_name || response.user.username}!`)

            // Redirect based on role
            if (response.user.role === 'admin') {
                router.push('/admin/dashboard')
            } else if (response.user.role === 'organizer') {
                router.push('/organizer/dashboard')
            } else {
                router.push('/dashboard')
            }
        } catch (error: any) {
            toast.error(error.message || 'Login failed. Please try again.')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Register function
    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true)
            const newUser = await authService.register(data)

            toast.success('Registration successful! Please log in.')

            // Redirect to login
            router.push('/auth/login')
        } catch (error: any) {
            toast.error(error.message || 'Registration failed. Please try again.')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Logout function
    const logout = useCallback(() => {
        handleLogout()
        toast.success('Logged out successfully')
        router.push('/auth/login')
    }, [router])

    // Helper function to clear auth state
    const handleLogout = () => {
        authService.logout()
        setUser(null)
    }

    // Update user profile
    const updateUser = async (data: Partial<User>) => {
        try {
            const updatedUser = await authService.updateProfile(data)
            setUser(updatedUser)
            authService.saveUser(updatedUser)
            toast.success('Profile updated successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile')
            throw error
        }
    }

    // Refresh user data
    const refreshUser = async () => {
        try {
            const userData = await authService.getCurrentUser()
            setUser(userData)
            authService.saveUser(userData)
        } catch (error) {
            console.error('Failed to refresh user data:', error)
        }
    }

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}

// HOC for protected routes
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    requiredRole?: 'user' | 'organizer' | 'admin'
) {
    return function AuthenticatedComponent(props: P) {
        const { user, isLoading, isAuthenticated } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!isLoading) {
                if (!isAuthenticated) {
                    router.push('/auth/login')
                } else if (requiredRole && user?.role !== requiredRole) {
                    router.push('/unauthorized')
                }
            }
        }, [isLoading, isAuthenticated, user, router])

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
                </div>
            )
        }

        if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
            return null
        }

        return <Component {...props} />
    }
}

export default AuthContext