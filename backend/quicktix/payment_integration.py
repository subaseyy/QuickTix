"""
QuickTix Payment Integration Examples
Payment gateway integration code for Stripe and Razorpay
"""
import stripe
import razorpay
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Payment, Booking


# ============================================
# STRIPE INTEGRATION
# ============================================

def init_stripe():
    """Initialize Stripe with API key"""
    stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_stripe_payment_intent(request):
    """
    Create Stripe Payment Intent
    
    Request body:
    {
        "booking_id": 1
    }
    """
    try:
        init_stripe()
        
        booking_id = request.data.get('booking_id')
        booking = Booking.objects.get(id=booking_id, user=request.user)
        
        if hasattr(booking, 'payment'):
            return Response(
                {'error': 'Payment already exists for this booking'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create Stripe Payment Intent
        intent = stripe.PaymentIntent.create(
            amount=int(booking.total_amount * 100),  # Convert to cents
            currency='usd',
            metadata={
                'booking_id': booking.id,
                'booking_reference': booking.booking_reference,
                'user_email': booking.user.email
            },
            automatic_payment_methods={
                'enabled': True,
            },
        )
        
        # Create Payment record
        payment = Payment.objects.create(
            booking=booking,
            amount=booking.total_amount,
            payment_method='stripe',
            transaction_id=intent.id,
            payment_status='pending'
        )
        
        return Response({
            'client_secret': intent.client_secret,
            'payment_id': payment.id,
            'amount': booking.total_amount
        })
        
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def stripe_webhook(request):
    """
    Handle Stripe webhook events
    
    Configure this URL in Stripe Dashboard:
    https://yourdomain.com/api/payments/stripe/webhook/
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        init_stripe()
        
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        
        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            
            # Update payment status
            payment = Payment.objects.get(transaction_id=payment_intent.id)
            payment.payment_status = 'completed'
            payment.save()
            
            # Update booking
            booking = payment.booking
            booking.status = 'confirmed'
            booking.save()
            
            # Update event tickets
            booking.event.available_tickets -= booking.tickets_count
            booking.event.save()
            
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            
            payment = Payment.objects.get(transaction_id=payment_intent.id)
            payment.payment_status = 'failed'
            payment.save()
        
        return Response({'status': 'success'})
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


# ============================================
# RAZORPAY INTEGRATION
# ============================================

def init_razorpay():
    """Initialize Razorpay client"""
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_razorpay_order(request):
    """
    Create Razorpay Order
    
    Request body:
    {
        "booking_id": 1
    }
    """
    try:
        client = init_razorpay()
        
        booking_id = request.data.get('booking_id')
        booking = Booking.objects.get(id=booking_id, user=request.user)
        
        if hasattr(booking, 'payment'):
            return Response(
                {'error': 'Payment already exists for this booking'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create Razorpay Order
        order_data = {
            'amount': int(booking.total_amount * 100),  # Convert to paise
            'currency': 'INR',
            'receipt': booking.booking_reference,
            'notes': {
                'booking_id': booking.id,
                'user_email': booking.user.email
            }
        }
        
        order = client.order.create(data=order_data)
        
        # Create Payment record
        payment = Payment.objects.create(
            booking=booking,
            amount=booking.total_amount,
            payment_method='razorpay',
            transaction_id=order['id'],
            payment_status='pending',
            payment_details=order
        )
        
        return Response({
            'order_id': order['id'],
            'payment_id': payment.id,
            'amount': booking.total_amount,
            'currency': 'INR',
            'key_id': settings.RAZORPAY_KEY_ID
        })
        
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_razorpay_payment(request):
    """
    Verify Razorpay payment signature
    
    Request body:
    {
        "razorpay_order_id": "order_xxx",
        "razorpay_payment_id": "pay_xxx",
        "razorpay_signature": "signature_xxx"
    }
    """
    try:
        client = init_razorpay()
        
        order_id = request.data.get('razorpay_order_id')
        payment_id = request.data.get('razorpay_payment_id')
        signature = request.data.get('razorpay_signature')
        
        # Verify signature
        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        
        client.utility.verify_payment_signature(params_dict)
        
        # Update payment status
        payment = Payment.objects.get(transaction_id=order_id)
        payment.payment_status = 'completed'
        payment.transaction_id = payment_id
        payment.save()
        
        # Update booking
        booking = payment.booking
        booking.status = 'confirmed'
        booking.save()
        
        # Update event tickets
        booking.event.available_tickets -= booking.tickets_count
        booking.event.save()
        
        return Response({
            'status': 'success',
            'message': 'Payment verified successfully'
        })
        
    except Payment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except razorpay.errors.SignatureVerificationError:
        return Response(
            {'error': 'Invalid payment signature'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def razorpay_webhook(request):
    """
    Handle Razorpay webhook events
    
    Configure this URL in Razorpay Dashboard:
    https://yourdomain.com/api/payments/razorpay/webhook/
    """
    try:
        client = init_razorpay()
        
        # Verify webhook signature
        webhook_signature = request.META.get('HTTP_X_RAZORPAY_SIGNATURE')
        webhook_body = request.body.decode('utf-8')
        
        client.utility.verify_webhook_signature(
            webhook_body,
            webhook_signature,
            settings.RAZORPAY_WEBHOOK_SECRET
        )
        
        # Process webhook event
        event_data = request.data
        event_type = event_data.get('event')
        
        if event_type == 'payment.captured':
            payment_entity = event_data['payload']['payment']['entity']
            order_id = payment_entity['order_id']
            
            payment = Payment.objects.get(transaction_id=order_id)
            payment.payment_status = 'completed'
            payment.transaction_id = payment_entity['id']
            payment.save()
            
            booking = payment.booking
            booking.status = 'confirmed'
            booking.save()
            
            booking.event.available_tickets -= booking.tickets_count
            booking.event.save()
        
        elif event_type == 'payment.failed':
            payment_entity = event_data['payload']['payment']['entity']
            order_id = payment_entity['order_id']
            
            payment = Payment.objects.get(transaction_id=order_id)
            payment.payment_status = 'failed'
            payment.save()
        
        return Response({'status': 'success'})
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


# ============================================
# URL CONFIGURATION
# ============================================
"""
Add these URLs to your urls.py:

from .payment_integration import (
    create_stripe_payment_intent,
    stripe_webhook,
    create_razorpay_order,
    verify_razorpay_payment,
    razorpay_webhook
)

urlpatterns = [
    # Stripe
    path('payments/stripe/create-intent/', create_stripe_payment_intent),
    path('payments/stripe/webhook/', stripe_webhook),
    
    # Razorpay
    path('payments/razorpay/create-order/', create_razorpay_order),
    path('payments/razorpay/verify/', verify_razorpay_payment),
    path('payments/razorpay/webhook/', razorpay_webhook),
]
"""

# ============================================
# FRONTEND INTEGRATION EXAMPLE (React)
# ============================================
"""
// Stripe Integration Example

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your_publishable_key');

function CheckoutForm({ bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create payment intent
    const response = await fetch('/api/payments/stripe/create-intent/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ booking_id: bookingId })
    });
    
    const { client_secret } = await response.json();
    
    // Confirm payment
    const result = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });
    
    if (result.error) {
      console.error(result.error.message);
    } else {
      console.log('Payment successful!');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay Now</button>
    </form>
  );
}

// Razorpay Integration Example

function RazorpayCheckout({ bookingId }) {
  const handlePayment = async () => {
    // Create order
    const response = await fetch('/api/payments/razorpay/create-order/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ booking_id: bookingId })
    });
    
    const { order_id, amount, currency, key_id } = await response.json();
    
    // Open Razorpay checkout
    const options = {
      key: key_id,
      amount: amount * 100,
      currency: currency,
      order_id: order_id,
      handler: async function(response) {
        // Verify payment
        await fetch('/api/payments/razorpay/verify/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        });
      }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  
  return <button onClick={handlePayment}>Pay with Razorpay</button>;
}
"""