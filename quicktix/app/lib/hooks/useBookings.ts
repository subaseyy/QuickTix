'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Booking, BookingCreate, BookingFilters } from '@/app/lib/types/index'
import toast from 'react-hot-toast'
import bookingsService from '../services/bookings.service'

export function useBookings(filters?: BookingFilters) {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState({
        count: 0,
        next: null as string | null,
        previous: null as string | null,
    })

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await bookingsService.getBookings(filters)
            setBookings(response.results)
            setPagination({
                count: response.count,
                next: response.next,
                previous: response.previous,
            })
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bookings')
            toast.error('Failed to load bookings')
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchBookings()
    }, [fetchBookings])

    return {
        bookings,
        loading,
        error,
        pagination,
        refresh: fetchBookings,
    }
}

export function useBooking(id: number | null) {
    const [booking, setBooking] = useState<Booking | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) {
            setLoading(false)
            return
        }

        const fetchBooking = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await bookingsService.getBooking(id)
                setBooking(data)
            } catch (err: any) {
                setError(err.message || 'Failed to fetch booking')
                toast.error('Failed to load booking details')
            } finally {
                setLoading(false)
            }
        }

        fetchBooking()
    }, [id])

    return {
        booking,
        loading,
        error,
    }
}

export function useMyBookings() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchMyBookings = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await bookingsService.getMyBookings()
            setBookings(data)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch your bookings')
            toast.error('Failed to load your bookings')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchMyBookings()
    }, [fetchMyBookings])

    return {
        bookings,
        loading,
        error,
        refresh: fetchMyBookings,
    }
}

export function useBookingMutations() {
    const [loading, setLoading] = useState(false)

    const createBooking = async (data: BookingCreate): Promise<Booking | null> => {
        try {
            setLoading(true)
            const booking = await bookingsService.createBooking(data)
            toast.success('Booking created successfully!')
            return booking
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to create booking'
            toast.error(errorMessage)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const cancelBooking = async (id: number): Promise<boolean> => {
        try {
            setLoading(true)
            await bookingsService.cancelBooking(id)
            toast.success('Booking cancelled successfully!')
            return true
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to cancel booking'
            toast.error(errorMessage)
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        createBooking,
        cancelBooking,
        loading,
    }
}