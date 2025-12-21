"""
QuickTix Serializers
Django REST Framework Serializers for all models
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, Event, Booking, Payment, OrganizerApplication, PasswordHistory
from .validators import check_password_strength


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2', 
                  'first_name', 'last_name', 'date_of_birth', 'gender',
                  'phone_number', 'city', 'country')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        
        # Validate age if date_of_birth is provided
        if attrs.get('date_of_birth'):
            from datetime import date
            today = date.today()
            age = today.year - attrs['date_of_birth'].year
            if today.month < attrs['date_of_birth'].month or \
               (today.month == attrs['date_of_birth'].month and today.day < attrs['date_of_birth'].day):
                age -= 1
            
            if age < 13:
                raise serializers.ValidationError(
                    {"date_of_birth": "You must be at least 13 years old to register."}
                )
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        
        # Add initial password to history
        PasswordHistory.add_password_to_history(user, user.password)
        
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    age = serializers.IntegerField(read_only=True)
    is_adult = serializers.BooleanField(read_only=True)
    full_address = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'status', 'date_of_birth', 'age', 'is_adult',
                  'gender', 'phone_number', 'profile_picture', 'bio',
                  'address_line1', 'address_line2', 'city', 'state', 
                  'country', 'postal_code', 'full_address',
                  'email_notifications', 'sms_notifications', 'date_joined')
        read_only_fields = ('id', 'role', 'status', 'date_joined', 'age', 
                           'is_adult', 'full_address')


class UserProfileSerializer(serializers.ModelSerializer):
    """Detailed user profile serializer"""
    total_bookings = serializers.SerializerMethodField()
    total_events_organized = serializers.SerializerMethodField()
    age = serializers.IntegerField(read_only=True)
    is_adult = serializers.BooleanField(read_only=True)
    full_address = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'status', 'date_of_birth', 'age', 'is_adult',
                  'gender', 'phone_number', 'profile_picture', 'bio',
                  'address_line1', 'address_line2', 'city', 'state',
                  'country', 'postal_code', 'full_address',
                  'email_notifications', 'sms_notifications',
                  'date_joined', 'total_bookings', 'total_events_organized')
        read_only_fields = ('id', 'role', 'status', 'date_joined', 'age',
                           'is_adult', 'full_address')
    
    def get_total_bookings(self, obj):
        return obj.bookings.filter(status='confirmed').count()
    
    def get_total_events_organized(self, obj):
        if obj.role == 'organizer':
            return obj.organized_events.count()
        return 0


class EventListSerializer(serializers.ModelSerializer):
    """Serializer for event list view"""
    organizer_name = serializers.CharField(
        source='organizer.get_full_name',
        read_only=True
    )
    tickets_sold = serializers.IntegerField(read_only=True)
    is_sold_out = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Event
        fields = ('id', 'title', 'event_date_time', 'venue', 'ticket_price',
                  'total_capacity', 'available_tickets', 'organizer_name',
                  'tickets_sold', 'is_sold_out', 'status', 'image_url')


class EventDetailSerializer(serializers.ModelSerializer):
    """Serializer for event detail view"""
    organizer = UserSerializer(read_only=True)
    tickets_sold = serializers.IntegerField(read_only=True)
    is_sold_out = serializers.BooleanField(read_only=True)
    total_revenue = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    total_bookings = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = ('id', 'organizer', 'title', 'description', 'event_date_time',
                  'venue', 'ticket_price', 'total_capacity', 'available_tickets',
                  'tickets_sold', 'is_sold_out', 'total_revenue', 'total_bookings',
                  'image_url', 'status', 'created_at', 'updated_at')
    
    def get_total_bookings(self, obj):
        return obj.bookings.filter(status='confirmed').count()


class EventCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating events"""
    class Meta:
        model = Event
        fields = ('title', 'description', 'event_date_time', 'venue',
                  'ticket_price', 'total_capacity', 'image_url', 'status')
    
    def validate_event_date_time(self, value):
        """Ensure event date is in the future"""
        from django.utils import timezone
        if value <= timezone.now():
            raise serializers.ValidationError(
                "Event date must be in the future"
            )
        return value
    
    def create(self, validated_data):
        # Set organizer from request user
        validated_data['organizer'] = self.context['request'].user
        return super().create(validated_data)


class BookingListSerializer(serializers.ModelSerializer):
    """Serializer for booking list view"""
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.DateTimeField(
        source='event.event_date_time',
        read_only=True
    )
    user_email = serializers.EmailField(source='user.email', read_only=True)
    payment_status = serializers.CharField(
        source='payment.payment_status',
        read_only=True
    )
    
    class Meta:
        model = Booking
        fields = ('id', 'booking_reference', 'event_title', 'event_date',
                  'user_email', 'tickets_count', 'total_amount', 'booking_date',
                  'status', 'payment_status')


class BookingDetailSerializer(serializers.ModelSerializer):
    """Serializer for booking detail view"""
    event = EventListSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    payment = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = ('id', 'booking_reference', 'event', 'user', 'tickets_count',
                  'total_amount', 'booking_date', 'status', 'payment',
                  'created_at', 'updated_at')
    
    def get_payment(self, obj):
        try:
            return PaymentSerializer(obj.payment).data
        except Payment.DoesNotExist:
            return None


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating bookings"""
    event_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Booking
        fields = ('event_id', 'tickets_count')
    
    def validate(self, attrs):
        event_id = attrs.get('event_id')
        tickets_count = attrs.get('tickets_count')
        user = self.context['request'].user
        
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise serializers.ValidationError("Event not found")
        
        # Check if user is the organizer
        if event.organizer == user:
            raise serializers.ValidationError(
                "You cannot book tickets for your own event"
            )
        
        # Check ticket availability
        if tickets_count > event.available_tickets:
            raise serializers.ValidationError(
                f"Only {event.available_tickets} tickets available"
            )
        
        # Check event status
        if event.status != 'active':
            raise serializers.ValidationError("Event is not available for booking")
        
        attrs['event'] = event
        return attrs
    
    def create(self, validated_data):
        event_id = validated_data.pop('event_id')
        event = validated_data.pop('event')
        user = self.context['request'].user
        
        # Calculate total amount
        total_amount = validated_data['tickets_count'] * event.ticket_price
        
        booking = Booking.objects.create(
            event=event,
            user=user,
            total_amount=total_amount,
            **validated_data
        )
        return booking


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    booking_reference = serializers.CharField(
        source='booking.booking_reference',
        read_only=True
    )
    
    class Meta:
        model = Payment
        fields = ('id', 'booking', 'booking_reference', 'amount',
                  'payment_method', 'transaction_id', 'payment_status',
                  'payment_date', 'created_at')
        read_only_fields = ('id', 'booking', 'transaction_id', 
                           'payment_status', 'payment_date')


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments"""
    booking_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Payment
        fields = ('booking_id', 'payment_method')
    
    def validate_booking_id(self, value):
        """Validate booking exists and belongs to user"""
        user = self.context['request'].user
        try:
            booking = Booking.objects.get(id=value, user=user)
        except Booking.DoesNotExist:
            raise serializers.ValidationError("Booking not found")
        
        # Check if payment already exists
        if hasattr(booking, 'payment'):
            raise serializers.ValidationError(
                "Payment already exists for this booking"
            )
        
        return value
    
    def create(self, validated_data):
        booking_id = validated_data.pop('booking_id')
        booking = Booking.objects.get(id=booking_id)
        
        payment = Payment.objects.create(
            booking=booking,
            amount=booking.total_amount,
            **validated_data
        )
        return payment


class OrganizerApplicationSerializer(serializers.ModelSerializer):
    """Serializer for organizer applications"""
    user = UserSerializer(read_only=True)
    reviewed_by_name = serializers.CharField(
        source='reviewed_by.get_full_name',
        read_only=True
    )
    
    class Meta:
        model = OrganizerApplication
        fields = ('id', 'user', 'application_reason', 'status',
                  'reviewed_by_name', 'admin_notes', 'applied_at', 'reviewed_at')
        read_only_fields = ('id', 'user', 'status', 'reviewed_by_name',
                           'admin_notes', 'applied_at', 'reviewed_at')


class OrganizerApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating organizer applications"""
    class Meta:
        model = OrganizerApplication
        fields = ('application_reason',)
    
    def validate(self, attrs):
        user = self.context['request'].user
        
        # Check if user is already an organizer
        if user.role == 'organizer':
            raise serializers.ValidationError(
                "You are already an event organizer"
            )
        
        # Check for pending application
        pending_exists = OrganizerApplication.objects.filter(
            user=user,
            status='pending'
        ).exists()
        
        if pending_exists:
            raise serializers.ValidationError(
                "You already have a pending application"
            )
        
        return attrs
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class OrganizerApplicationReviewSerializer(serializers.ModelSerializer):
    """Serializer for reviewing applications (admin only)"""
    class Meta:
        model = OrganizerApplication
        fields = ('status', 'admin_notes')
    
    def validate_status(self, value):
        if value not in ['approved', 'rejected']:
            raise serializers.ValidationError(
                "Status must be 'approved' or 'rejected'"
            )
        return value
    
    def update(self, instance, validated_data):
        # Set reviewed_by to current admin user
        instance.reviewed_by = self.context['request'].user
        return super().update(instance, validated_data)


# Statistics Serializers
class EventStatisticsSerializer(serializers.Serializer):
    """Serializer for event statistics"""
    total_events = serializers.IntegerField()
    active_events = serializers.IntegerField()
    completed_events = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)


class OrganizerStatisticsSerializer(serializers.Serializer):
    """Serializer for organizer statistics"""
    total_events = serializers.IntegerField()
    total_bookings = serializers.IntegerField()
    total_tickets_sold = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)


class UserStatisticsSerializer(serializers.Serializer):
    """Serializer for user statistics"""
    total_bookings = serializers.IntegerField()
    total_tickets = serializers.IntegerField()
    total_spent = serializers.DecimalField(max_digits=15, decimal_places=2)
    upcoming_events = serializers.IntegerField()


class PasswordStrengthSerializer(serializers.Serializer):
    """Serializer for checking password strength"""
    password = serializers.CharField(write_only=True, required=True)
    
    def validate_password(self, value):
        """Check password strength and return feedback"""
        strength_check = check_password_strength(value)
        
        if not strength_check['is_valid']:
            error_message = "Password is too weak. " + "; ".join(strength_check['feedback'])
            raise serializers.ValidationError(error_message)
        
        return value


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True, 
        required=True,
        validators=[validate_password]
    )
    new_password2 = serializers.CharField(write_only=True, required=True)
    
    # Configuration: Number of previous passwords to check
    PASSWORD_HISTORY_COUNT = 5
    
    def validate_old_password(self, value):
        """Verify old password is correct"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
    def validate_new_password(self, value):
        """Validate new password is not reused"""
        user = self.context['request'].user
        
        # Check if new password is same as old password
        if user.check_password(value):
            raise serializers.ValidationError(
                "New password cannot be the same as your current password."
            )
        
        # Check password history
        is_reused, message = PasswordHistory.check_password_reuse(
            user, 
            value, 
            history_count=self.PASSWORD_HISTORY_COUNT
        )
        
        if is_reused:
            raise serializers.ValidationError(message)
        
        return value
    
    def validate(self, attrs):
        """Validate passwords match and meet requirements"""
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError(
                {"new_password": "New password fields didn't match."}
            )
        
        # Check password strength
        strength_check = check_password_strength(attrs['new_password'])
        if not strength_check['is_valid']:
            raise serializers.ValidationError(
                {"new_password": "Password is too weak. " + "; ".join(strength_check['feedback'])}
            )
        
        return attrs
    
    def save(self):
        """Update user password and save to history"""
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        
        # Set new password (this hashes it)
        user.set_password(new_password)
        user.save()
        
        # Add new password to history
        PasswordHistory.add_password_to_history(user, user.password)
        
        return user