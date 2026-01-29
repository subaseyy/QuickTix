"""
QuickTix Views
Django REST Framework ViewSets for all models
"""
import re
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Sum, Count
from django.utils import timezone

from .models import User, Event, Booking, Payment, OrganizerApplication
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserProfileSerializer,
    EventListSerializer,
    EventDetailSerializer,
    EventCreateUpdateSerializer,
    BookingListSerializer,
    BookingDetailSerializer,
    BookingCreateSerializer,
    PaymentSerializer,
    PaymentCreateSerializer,
    OrganizerApplicationSerializer,
    OrganizerApplicationCreateSerializer,
    OrganizerApplicationReviewSerializer,
    EventStatisticsSerializer,
    OrganizerStatisticsSerializer,
    UserStatisticsSerializer,
    PasswordStrengthSerializer,
    PasswordChangeSerializer,
)
from .permissions import (
    IsAdmin,
    IsOrganizer,
    IsOrganizerOrAdmin,
    IsOwnerOrAdmin,
    IsEventOrganizer,
    CanCreateEvent,
    CanBookEvent,
    IsBookingOwnerOrEventOrganizer,
    CanApplyForOrganizer,
    CanReviewApplication,
    IsAuthenticatedOrReadOnly,
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User management
    """
    queryset = User.objects.all()
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    filterset_fields = ['role', 'status']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        if self.action == 'profile':
            return UserProfileSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        if self.action in ['list', 'destroy']:
            return [IsAdmin()]
        if self.action == 'profile':
            return [IsAuthenticated()]
        return [IsOwnerOrAdmin()]
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = UserSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def check_password_strength(self, request):
        """
        Check password strength without creating account
        Useful for real-time password validation in frontend
        """
        from .validators import check_password_strength
        
        password = request.data.get('password', '')
        if not password:
            return Response(
                {'error': 'Password field is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        strength_result = check_password_strength(password)
        
        return Response({
            'is_valid': strength_result['is_valid'],
            'strength': strength_result['strength'],
            'score': strength_result['score'],
            'max_score': strength_result['max_score'],
            'feedback': strength_result['feedback'],
            'requirements': {
                'min_length': len(password) >= 8,
                'has_uppercase': bool(re.search(r'[A-Z]', password)),
                'has_lowercase': bool(re.search(r'[a-z]', password)),
                'has_digit': bool(re.search(r'\d', password)),
                'has_special': bool(re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]', password))
            }
        })
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """Change user password"""
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Password changed successfully',
            'detail': 'Please login again with your new password'
        })


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Event management
    """
    queryset = Event.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'description', 'venue']
    ordering_fields = ['event_date_time', 'ticket_price', 'created_at']
    filterset_fields = ['status', 'organizer']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return EventCreateUpdateSerializer
        return EventDetailSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        if self.action == 'create':
            return [CanCreateEvent()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsEventOrganizer()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filter events based on user role and query params"""
        queryset = Event.objects.all()
        
        # For organizers, show their events by default unless specified
        if self.request.user.is_authenticated:
            if self.action == 'my_events':
                return queryset.filter(organizer=self.request.user)
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Show only active events for public listing
        if self.action == 'list' and not status_param:
            queryset = queryset.filter(
                status='active',
                event_date_time__gt=timezone.now()
            )
        
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[IsOrganizer])
    def my_events(self, request):
        """Get events organized by current user"""
        events = self.get_queryset()
        serializer = EventListSerializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[IsEventOrganizer])
    def attendees(self, request, pk=None):
        """Get list of attendees for an event (organizer/admin only)"""
        event = self.get_object()
        bookings = event.bookings.filter(status='confirmed')
        serializer = BookingListSerializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[IsEventOrganizer])
    def statistics(self, request, pk=None):
        """Get statistics for a specific event"""
        event = self.get_object()
        
        confirmed_bookings = event.bookings.filter(status='confirmed')
        
        stats = {
            'total_bookings': confirmed_bookings.count(),
            'tickets_sold': event.tickets_sold,
            'available_tickets': event.available_tickets,
            'total_revenue': float(event.total_revenue),
            'occupancy_rate': (event.tickets_sold / event.total_capacity * 100) 
                             if event.total_capacity > 0 else 0,
        }
        return Response(stats)
    
    @action(detail=True, methods=['post'], permission_classes=[IsEventOrganizer])
    def cancel(self, request, pk=None):
        """Cancel an event"""
        event = self.get_object()
        
        if event.status == 'cancelled':
            return Response(
                {'error': 'Event is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cancel all confirmed bookings and process refunds
        confirmed_bookings = event.bookings.filter(status='confirmed')
        for booking in confirmed_bookings:
            booking.status = 'cancelled'
            booking.save()
            
            # Mark payment as refunded
            if hasattr(booking, 'payment'):
                booking.payment.payment_status = 'refunded'
                booking.payment.save()
        
        event.status = 'cancelled'
        event.save()
        
        return Response({'message': 'Event cancelled successfully'})


class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Booking management
    """
    queryset = Booking.objects.all()
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['booking_date', 'total_amount']
    filterset_fields = ['status', 'event']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        if self.action == 'list':
            return BookingListSerializer
        return BookingDetailSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        if self.action in ['update', 'partial_update', 'destroy', 'cancel']:
            return [IsBookingOwnerOrEventOrganizer()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filter bookings based on user role"""
        user = self.request.user
        
        if user.role == 'admin':
            return Booking.objects.all()
        
        if user.role == 'organizer':
            # Show bookings for organizer's events + their own bookings
            return Booking.objects.filter(
                Q(user=user) | Q(event__organizer=user)
            )
        
        # Regular users see only their bookings
        return Booking.objects.filter(user=user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_bookings(self, request):
        """Get bookings made by current user"""
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingListSerializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        # Only booking owner can cancel
        if booking.user != request.user:
            return Response(
                {'error': 'You can only cancel your own bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if booking.status != 'confirmed':
            return Response(
                {'error': 'Only confirmed bookings can be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check cancellation policy (e.g., 24 hours before event)
        time_until_event = booking.event.event_date_time - timezone.now()
        if time_until_event.total_seconds() < 24 * 3600:
            return Response(
                {'error': 'Cannot cancel within 24 hours of event'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cancel booking
        booking.status = 'cancelled'
        booking.save()
        
        # Restore tickets
        booking.event.available_tickets += booking.tickets_count
        booking.event.save()
        
        # Process refund
        if hasattr(booking, 'payment'):
            booking.payment.payment_status = 'refunded'
            booking.payment.save()
        
        return Response({'message': 'Booking cancelled successfully'})


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Payment management
    """
    queryset = Payment.objects.all()
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['payment_date', 'amount']
    filterset_fields = ['payment_status', 'payment_method']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        if self.action == 'list':
            return [IsAdmin()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filter payments based on user role"""
        user = self.request.user
        
        if user.role == 'admin':
            return Payment.objects.all()
        
        if user.role == 'organizer':
            # Show payments for organizer's events
            return Payment.objects.filter(booking__event__organizer=user)
        
        # Regular users see only their payments
        return Payment.objects.filter(booking__user=user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_payments(self, request):
        """Get payments made by current user"""
        payments = Payment.objects.filter(booking__user=request.user)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def process(self, request, pk=None):
        """
        Process payment using payment gateway
        This is a placeholder for actual payment processing
        """
        payment = self.get_object()
        
        if payment.payment_status != 'pending':
            return Response(
                {'error': 'Payment already processed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # TODO: Integrate with actual payment gateway (Stripe, Razorpay, etc.)
        # For now, simulate successful payment
        
        payment.payment_status = 'completed'
        payment.payment_date = timezone.now()
        payment.transaction_id = f"TXN-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        payment.save()
        
        # Update booking status
        booking = payment.booking
        booking.status = 'confirmed'
        booking.save()
        
        # Update event tickets
        booking.event.available_tickets -= booking.tickets_count
        booking.event.save()
        
        return Response({
            'message': 'Payment processed successfully',
            'transaction_id': payment.transaction_id
        })


class OrganizerApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Organizer Application management
    """
    queryset = OrganizerApplication.objects.all()
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['applied_at', 'reviewed_at']
    filterset_fields = ['status']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrganizerApplicationCreateSerializer
        if self.action in ['review', 'approve', 'reject']:
            return OrganizerApplicationReviewSerializer
        return OrganizerApplicationSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [CanApplyForOrganizer()]
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        if self.action in ['review', 'approve', 'reject']:
            return [CanReviewApplication()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filter applications based on user role"""
        user = self.request.user
        
        if user.role == 'admin':
            return OrganizerApplication.objects.all()
        
        # Users see only their own applications
        return OrganizerApplication.objects.filter(user=user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_applications(self, request):
        """Get applications submitted by current user"""
        applications = OrganizerApplication.objects.filter(user=request.user)
        serializer = OrganizerApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def pending(self, request):
        """Get all pending applications (admin only)"""
        applications = OrganizerApplication.objects.filter(status='pending')
        serializer = OrganizerApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[CanReviewApplication])
    def review(self, request, pk=None):
        """Review an application (approve or reject)"""
        application = self.get_object()
        serializer = self.get_serializer(application, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[CanReviewApplication])
    def approve(self, request, pk=None):
        """Approve an application"""
        application = self.get_object()
        
        if application.status != 'pending':
            return Response(
                {'error': 'Only pending applications can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = 'approved'
        application.reviewed_by = request.user
        application.reviewed_at = timezone.now()
        application.admin_notes = request.data.get('admin_notes', '')
        application.save()
        
        return Response({'message': 'Application approved successfully'})
    
    @action(detail=True, methods=['post'], permission_classes=[CanReviewApplication])
    def reject(self, request, pk=None):
        """Reject an application"""
        application = self.get_object()
        
        if application.status != 'pending':
            return Response(
                {'error': 'Only pending applications can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = 'rejected'
        application.reviewed_by = request.user
        application.reviewed_at = timezone.now()
        application.admin_notes = request.data.get('admin_notes', '')
        application.save()
        
        return Response({'message': 'Application rejected'})


# Statistics and Analytics Views
class StatisticsViewSet(viewsets.ViewSet):
    """
    ViewSet for system statistics and analytics
    """
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def platform(self, request):
        """Get platform-wide statistics (admin only)"""
        stats = {
            'total_users': User.objects.count(),
            'total_organizers': User.objects.filter(role='organizer').count(),
            'total_events': Event.objects.count(),
            'active_events': Event.objects.filter(status='active').count(),
            'total_bookings': Booking.objects.filter(status='confirmed').count(),
            'total_revenue': Payment.objects.filter(
                payment_status='completed'
            ).aggregate(total=Sum('amount'))['total'] or 0,
            'pending_applications': OrganizerApplication.objects.filter(
                status='pending'
            ).count(),
        }
        return Response(stats)
    
    @action(detail=False, methods=['get'], permission_classes=[IsOrganizer])
    def organizer(self, request):
        """Get statistics for current organizer"""
        user = request.user
        events = Event.objects.filter(organizer=user)
        
        confirmed_bookings = Booking.objects.filter(
            event__organizer=user,
            status='confirmed'
        )
        
        stats = {
            'total_events': events.count(),
            'active_events': events.filter(status='active').count(),
            'total_bookings': confirmed_bookings.count(),
            'total_tickets_sold': confirmed_bookings.aggregate(
                total=Sum('tickets_count')
            )['total'] or 0,
            'total_revenue': confirmed_bookings.aggregate(
                total=Sum('total_amount')
            )['total'] or 0,
        }
        
        serializer = OrganizerStatisticsSerializer(stats)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def user(self, request):
        """Get statistics for current user"""
        user = request.user
        bookings = Booking.objects.filter(user=user, status='confirmed')
        
        stats = {
            'total_bookings': bookings.count(),
            'total_tickets': bookings.aggregate(
                total=Sum('tickets_count')
            )['total'] or 0,
            'total_spent': bookings.aggregate(
                total=Sum('total_amount')
            )['total'] or 0,
            'upcoming_events': bookings.filter(
                event__event_date_time__gt=timezone.now()
            ).count(),
        }
        
        serializer = UserStatisticsSerializer(stats)
        return Response(serializer.data)