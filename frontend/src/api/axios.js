// src/api/axios.js
import axios from 'axios'
import { toast } from 'vue3-toastify'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle responses and auto-refresh token on 401
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If error is not 401 or we've already retried, reject
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error)
        }

        // If we're already refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                })
                .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = localStorage.getItem('refresh_token')

        if (!refreshToken) {
            // No refresh token, logout user
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/auth/login'
            return Promise.reject(error)
        }

        try {
            // Attempt to refresh the token
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
                { refresh: refreshToken }
            )

            const newAccessToken = response.data.access
            localStorage.setItem('access_token', newAccessToken)

            // Update the authorization header
            api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

            processQueue(null, newAccessToken)
            isRefreshing = false

            return api(originalRequest)
        } catch (refreshError) {
            // Refresh failed, logout user
            processQueue(refreshError, null)
            isRefreshing = false

            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')

            toast.error('Session expired. Please login again.')
            window.location.href = '/auth/login'

            return Promise.reject(refreshError)
        }
    }
)

export default api