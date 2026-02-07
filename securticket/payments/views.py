from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
import stripe
import json
from bookings.models import Booking
from logs.models import ActivityLog

stripe.api_key = settings.STRIPE_SECRET_KEY

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """Create a Stripe payment intent for a booking"""
    try:
        booking_id = request.data.get('booking_id')
        
        if not booking_id:
            return Response({
                'error': 'Booking ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get booking
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({
                'error': 'Booking not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if booking is already confirmed
        if booking.status == 'confirmed':
            return Response({
                'error': 'Booking already confirmed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=int(booking.total_price * 100),  # Convert to cents
            currency='usd',
            metadata={
                'booking_id': booking.id,
                'booking_reference': booking.booking_reference,
                'user_id': request.user.id,
                'event_title': booking.event.title
            },
            description=f'Booking for {booking.event.title}'
        )
        
        # Save payment intent ID to booking
        booking.payment_intent_id = intent.id
        booking.save()
        
        # Log payment intent creation
        ActivityLog.objects.create(
            user=request.user,
            action=f'Payment Intent Created: {booking.booking_reference}',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            metadata={
                'booking_id': booking.id,
                'payment_intent_id': intent.id,
                'amount': float(booking.total_price)
            }
        )
        
        return Response({
            'clientSecret': intent.client_secret,
            'booking': {
                'id': booking.id,
                'reference': booking.booking_reference,
                'total_price': str(booking.total_price)
            }
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def stripe_webhook(request):
    """Handle Stripe webhooks"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        # Get booking from metadata
        booking_id = payment_intent['metadata'].get('booking_id')
        
        if booking_id:
            try:
                booking = Booking.objects.get(id=booking_id)
                booking.status = 'confirmed'
                booking.save()
                
                # Log successful payment
                ActivityLog.objects.create(
                    user=booking.user,
                    action=f'Payment Successful: {booking.booking_reference}',
                    ip_address='webhook',
                    metadata={
                        'booking_id': booking.id,
                        'payment_intent_id': payment_intent['id'],
                        'amount': payment_intent['amount'] / 100
                    }
                )
            except Booking.DoesNotExist:
                pass
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        
        # Get booking from metadata
        booking_id = payment_intent['metadata'].get('booking_id')
        
        if booking_id:
            try:
                booking = Booking.objects.get(id=booking_id)
                
                # Log failed payment
                ActivityLog.objects.create(
                    user=booking.user,
                    action=f'Payment Failed: {booking.booking_reference}',
                    ip_address='webhook',
                    metadata={
                        'booking_id': booking.id,
                        'payment_intent_id': payment_intent['id']
                    }
                )
            except Booking.DoesNotExist:
                pass
    
    return HttpResponse(status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_status(request, booking_id):
    """Get payment status for a booking"""
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
        
        if not booking.payment_intent_id:
            return Response({
                'status': 'pending',
                'message': 'No payment initiated'
            })
        
        # Retrieve payment intent from Stripe
        intent = stripe.PaymentIntent.retrieve(booking.payment_intent_id)
        
        return Response({
            'status': intent.status,
            'booking_status': booking.status,
            'amount': intent.amount / 100
        })
    
    except Booking.DoesNotExist:
        return Response({
            'error': 'Booking not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)