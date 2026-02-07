'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ bookingId, booking }: { bookingId: string; booking: any }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError('');
        setMessage('Processing payment...');

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message || 'Payment failed');
                setProcessing(false);
                setMessage('');
                return;
            }

            const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/dashboard?payment=success`,
                },
                redirect: 'if_required', // Don't redirect, handle it manually
            });

            if (confirmError) {
                setError(confirmError.message || 'Payment failed');
                setProcessing(false);
                setMessage('');
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Payment succeeded - manually confirm booking
                setMessage('Payment successful! Confirming booking...');

                try {
                    await api.post('/payments/confirm-manual/', {
                        booking_id: bookingId
                    });

                    setMessage('✅ Payment confirmed! Redirecting to dashboard...');

                    setTimeout(() => {
                        router.push('/dashboard?payment=success');
                    }, 2000);
                } catch (err) {
                    console.error('Auto-confirm failed:', err);
                    setError('Payment succeeded but booking confirmation failed. Please contact support.');
                    setProcessing(false);
                }
            }
        } catch (err: any) {
            setError('Payment processing failed');
            setProcessing(false);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg font-semibold">
                    ✗ {error}
                </div>
            )}

            {message && (
                <div className="bg-blue-100 border-2 border-blue-400 text-blue-800 px-4 py-3 rounded-lg font-semibold">
                    {message}
                </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Payment Details</h3>
                <PaymentElement />
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-semibold">
                    💳 <strong>Test Card:</strong> Use card number <code className="bg-white px-2 py-1 rounded font-mono">4242 4242 4242 4242</code>
                </p>
                <p className="text-sm text-blue-900 font-semibold mt-2">
                    📅 Any future expiry date (e.g., 12/34)
                </p>
                <p className="text-sm text-blue-900 font-semibold mt-2">
                    🔒 Any 3-digit CVC (e.g., 123)
                </p>
            </div>

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {processing ? (
                    <>
                        <svg className="animate-spin h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    `Pay $${booking?.total_price || '0.00'}`
                )}
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('booking_id');

    const [clientSecret, setClientSecret] = useState('');
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) {
            router.push('/events');
            return;
        }
        createPaymentIntent();
    }, [bookingId]);

    const createPaymentIntent = async () => {
        try {
            const response = await api.post('/payments/create-payment-intent/', {
                booking_id: bookingId,
            });
            setClientSecret(response.data.clientSecret);
            setBooking(response.data.booking);
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to initialize payment');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-900 font-semibold">Initializing payment...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Payment</h1>

                        {booking && (
                            <div className="mb-8 p-5 bg-indigo-50 rounded-lg border-2 border-indigo-300">
                                <h2 className="font-bold text-gray-900 text-lg mb-3">Booking Summary</h2>
                                <div className="space-y-2">
                                    <p className="text-gray-900 font-semibold">
                                        Reference: <span className="font-mono font-bold text-indigo-600">{booking.reference}</span>
                                    </p>
                                    <p className="text-3xl font-bold text-indigo-600 mt-4">
                                        Total: ${booking.total_price}
                                    </p>
                                </div>
                            </div>
                        )}

                        {clientSecret && (
                            <Elements
                                stripe={stripePromise}
                                options={{
                                    clientSecret,
                                    appearance: {
                                        theme: 'stripe',
                                        variables: {
                                            colorPrimary: '#4f46e5',
                                        }
                                    }
                                }}
                            >
                                <CheckoutForm bookingId={bookingId || ''} booking={booking} />
                            </Elements>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}