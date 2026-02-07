'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ bookingId }: { bookingId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError('');

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message || 'Payment failed');
                setProcessing(false);
                return;
            }

            const { error: confirmError } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/dashboard?payment=success`,
                },
            });

            if (confirmError) {
                setError(confirmError.message || 'Payment failed');
                setProcessing(false);
            }
        } catch (err: any) {
            setError('Payment processing failed');
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <PaymentElement />

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50"
            >
                {processing ? 'Processing...' : 'Pay Now'}
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
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Payment</h1>

                        {booking && (
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                <h2 className="font-semibold text-lg mb-2">Booking Summary</h2>
                                <p className="text-gray-600">Booking Reference: <span className="font-mono font-semibold">{booking.reference}</span></p>
                                <p className="text-gray-600">Total Amount: <span className="font-bold text-2xl text-indigo-600">${booking.total_price}</span></p>
                            </div>
                        )}

                        {clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm bookingId={bookingId || ''} />
                            </Elements>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}