
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Event, EventCreate, EventFilters } from '@/app/lib/types/index'
import toast from 'react-hot-toast'
import eventsService from '../services/events.service'

export function useEvents(filters?: EventFilters) {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState({
        count: 0,
        next: null as string | null,
        previous: null as string | null,
    })

    // Fetch events
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await eventsService.getEvents(filters)
            setEvents(response.results)
            setPagination({
                count: response.count,
                next: response.next,
                previous: response.previous,
            })
        } catch (err: any) {
            setError(err.message || 'Failed to fetch events')
            toast.error('Failed to load events')
        } finally {
            setLoading(false)
        }
    }, [filters])

    // Initial fetch
    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    // Refresh events
    const refresh = useCallback(() => {
        fetchEvents()
    }, [fetchEvents])

    return {
        events,
        loading,
        error,
        pagination,
        refresh,
    }
}

export function useEvent(id: number | null) {
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) {
            setLoading(false)
            return
        }

        const fetchEvent = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await eventsService.getEvent(id)
                setEvent(data)
            } catch (err: any) {
                setError(err.message || 'Failed to fetch event')
                toast.error('Failed to load event details')
            } finally {
                setLoading(false)
            }
        }

        fetchEvent()
    }, [id])

    return {
        event,
        loading,
        error,
    }
}

export function useEventMutations() {
    const [loading, setLoading] = useState(false)

    const createEvent = async (data: EventCreate): Promise<Event | null> => {
        try {
            setLoading(true)
            const event = await eventsService.createEvent(data)
            toast.success('Event created successfully!')
            return event
        } catch (error: any) {
            toast.error(error.message || 'Failed to create event')
            return null
        } finally {
            setLoading(false)
        }
    }

    const updateEvent = async (id: number, data: Partial<EventCreate>): Promise<Event | null> => {
        try {
            setLoading(true)
            const event = await eventsService.updateEvent(id, data)
            toast.success('Event updated successfully!')
            return event
        } catch (error: any) {
            toast.error(error.message || 'Failed to update event')
            return null
        } finally {
            setLoading(false)
        }
    }

    const deleteEvent = async (id: number): Promise<boolean> => {
        try {
            setLoading(true)
            await eventsService.deleteEvent(id)
            toast.success('Event deleted successfully!')
            return true
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete event')
            return false
        } finally {
            setLoading(false)
        }
    }

    const cancelEvent = async (id: number): Promise<boolean> => {
        try {
            setLoading(true)
            await eventsService.cancelEvent(id)
            toast.success('Event cancelled successfully!')
            return true
        } catch (error: any) {
            toast.error(error.message || 'Failed to cancel event')
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        createEvent,
        updateEvent,
        deleteEvent,
        cancelEvent,
        loading,
    }
}

export function useMyEvents() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchMyEvents = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await eventsService.getMyEvents()
            setEvents(data)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch your events')
            toast.error('Failed to load your events')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchMyEvents()
    }, [fetchMyEvents])

    return {
        events,
        loading,
        error,
        refresh: fetchMyEvents,
    }
}

export function useEventStatistics(eventId: number | null) {
    const [statistics, setStatistics] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!eventId) {
            setLoading(false)
            return
        }

        const fetchStatistics = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await eventsService.getEventStatistics(eventId)
                setStatistics(data)
            } catch (err: any) {
                setError(err.message || 'Failed to fetch statistics')
            } finally {
                setLoading(false)
            }
        }

        fetchStatistics()
    }, [eventId])

    return {
        statistics,
        loading,
        error,
    }
}