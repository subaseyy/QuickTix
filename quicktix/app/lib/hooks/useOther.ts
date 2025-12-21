'use client'

import { useState, useEffect, useCallback } from 'react'
import { paymentsService, organizerService, statisticsService } from '../services'
import type {
    Payment,
    PaymentCreate,
    OrganizerApplication,
    OrganizerApplicationCreate,
    OrganizerApplicationReview,
    PlatformStatistics,
    OrganizerStatistics,
    UserStatistics,
} from '../types/index'
import toast from 'react-hot-toast'

// ============================================
// PAYMENTS HOOKS
// ============================================

export function useMyPayments() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPayments = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await paymentsService.getMyPayments()
            setPayments(data)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch payments')
            toast.error('Failed to load payment history')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPayments()
    }, [fetchPayments])

    return {
        payments,
        loading,
        error,
        refresh: fetchPayments,
    }
}

export function usePaymentMutations() {
    const [loading, setLoading] = useState(false)

    const createPayment = async (data: PaymentCreate): Promise<Payment | null> => {
        try {
            setLoading(true)
            const payment = await paymentsService.createPayment(data)
            toast.success('Payment initiated successfully!')
            return payment
        } catch (error: any) {
            toast.error(error.message || 'Failed to create payment')
            return null
        } finally {
            setLoading(false)
        }
    }

    const processPayment = async (id: number): Promise<boolean> => {
        try {
            setLoading(true)
            const response = await paymentsService.processPayment(id)
            toast.success('Payment processed successfully!')
            return true
        } catch (error: any) {
            toast.error(error.message || 'Payment processing failed')
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        createPayment,
        processPayment,
        loading,
    }
}

// ============================================
// ORGANIZER APPLICATION HOOKS
// ============================================

export function useMyApplications() {
    const [applications, setApplications] = useState<OrganizerApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await organizerService.getMyApplications()
            setApplications(data)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch applications')
            toast.error('Failed to load your applications')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])

    return {
        applications,
        loading,
        error,
        refresh: fetchApplications,
    }
}

export function usePendingApplications() {
    const [applications, setApplications] = useState<OrganizerApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPendingApplications = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await organizerService.getPendingApplications()
            setApplications(data)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch pending applications')
            toast.error('Failed to load pending applications')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPendingApplications()
    }, [fetchPendingApplications])

    return {
        applications,
        loading,
        error,
        refresh: fetchPendingApplications,
    }
}

export function useOrganizerMutations() {
    const [loading, setLoading] = useState(false)

    const applyForOrganizer = async (
        data: OrganizerApplicationCreate
    ): Promise<OrganizerApplication | null> => {
        try {
            setLoading(true)
            const application = await organizerService.createApplication(data)
            toast.success('Application submitted successfully!')
            return application
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit application')
            return null
        } finally {
            setLoading(false)
        }
    }

    const reviewApplication = async (
        id: number,
        data: OrganizerApplicationReview
    ): Promise<OrganizerApplication | null> => {
        try {
            setLoading(true)
            const application = await organizerService.reviewApplication(id, data)
            toast.success('Application reviewed successfully!')
            return application
        } catch (error: any) {
            toast.error(error.message || 'Failed to review application')
            return null
        } finally {
            setLoading(false)
        }
    }

    const approveApplication = async (id: number, notes?: string): Promise<boolean> => {
        try {
            setLoading(true)
            await organizerService.approveApplication(id, notes)
            toast.success('Application approved!')
            return true
        } catch (error: any) {
            toast.error(error.message || 'Failed to approve application')
            return false
        } finally {
            setLoading(false)
        }
    }

    const rejectApplication = async (id: number, notes?: string): Promise<boolean> => {
        try {
            setLoading(true)
            await organizerService.rejectApplication(id, notes)
            toast.success('Application rejected')
            return true
        } catch (error: any) {
            toast.error(error.message || 'Failed to reject application')
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        applyForOrganizer,
        reviewApplication,
        approveApplication,
        rejectApplication,
        loading,
    }
}

// ============================================
// STATISTICS HOOKS
// ============================================

export function usePlatformStatistics() {
    const [statistics, setStatistics] = useState<PlatformStatistics | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await statisticsService.getPlatformStatistics()
                setStatistics(data)
            } catch (err: any) {
                setError(err.message || 'Failed to fetch statistics')
                toast.error('Failed to load platform statistics')
            } finally {
                setLoading(false)
            }
        }

        fetchStatistics()
    }, [])

    return {
        statistics,
        loading,
        error,
    }
}

export function useOrganizerStatistics() {
    const [statistics, setStatistics] = useState<OrganizerStatistics | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await statisticsService.getOrganizerStatistics()
                setStatistics(data)
            } catch (err: any) {
                setError(err.message || 'Failed to fetch statistics')
                toast.error('Failed to load your statistics')
            } finally {
                setLoading(false)
            }
        }

        fetchStatistics()
    }, [])

    return {
        statistics,
        loading,
        error,
    }
}

export function useUserStatistics() {
    const [statistics, setStatistics] = useState<UserStatistics | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await statisticsService.getUserStatistics()
                setStatistics(data)
            } catch (err: any) {
                setError(err.message || 'Failed to fetch statistics')
                toast.error('Failed to load your statistics')
            } finally {
                setLoading(false)
            }
        }

        fetchStatistics()
    }, [])

    return {
        statistics,
        loading,
        error,
    }
}