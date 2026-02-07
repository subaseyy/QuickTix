from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import Booking
from .serializers import BookingSerializer
from authentication.permissions import IsOwnerOrAdmin
from logs.models import ActivityLog

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own bookings, admins see all"""
        if self.request.user.role == 'admin':
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)
    
    @method_decorator(ratelimit(key='user', rate='10/m', method='POST'))
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save(user=request.user)
        
        # Log booking creation
        ActivityLog.objects.create(
            user=request.user,
            action=f'Booking Created: {booking.booking_reference}',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            metadata={
                'booking_id': booking.id,
                'event_id': booking.event.id,
                'seats': booking.seats_booked
            }
        )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        # Check permission
        if booking.user != request.user and request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=403)
        
        if booking.status == 'cancelled':
            return Response({'error': 'Booking already cancelled'}, status=400)
        
        # Update booking status
        booking.status = 'cancelled'
        booking.save()
        
        # Return seats to event
        event = booking.event
        event.available_seats += booking.seats_booked
        event.save()
        
        # Log cancellation
        ActivityLog.objects.create(
            user=request.user,
            action=f'Booking Cancelled: {booking.booking_reference}',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            metadata={'booking_id': booking.id}
        )
        
        return Response({'message': 'Booking cancelled successfully'})
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """Get current user's bookings"""
        bookings = Booking.objects.filter(user=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)