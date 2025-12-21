import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

// API Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data

          // Save new token
          localStorage.setItem('accessToken', access)

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`
          }

          return api(originalRequest)
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API Error type
export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

// Handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>
    
    return {
      message: axiosError.response?.data?.message || 
               axiosError.response?.data?.detail || 
               axiosError.message || 
               'An error occurred',
      status: axiosError.response?.status,
      errors: axiosError.response?.data?.errors || axiosError.response?.data,
    }
  }

  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  }
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

// Paginated response
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export default api