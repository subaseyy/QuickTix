from rest_framework import serializers
from .models import Booking
from events.serializers import EventSerializer
import uuid

class BookingSerializer(serializers.ModelSerializer):
    event_details = EventSerializer(source='event', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'booking_reference', 'created_at', 'updated_at')
    
    def validate(self, attrs):
        event = attrs.get('event')
        seats_booked = attrs.get('seats_booked')
        
        if seats_booked > event.available_seats:
            raise serializers.ValidationError(
                f"Only {event.available_seats} seats available."
            )
        
        if seats_booked <= 0:
            raise serializers.ValidationError("Must book at least 1 seat.")
        
        # Calculate total price
        attrs['total_price'] = event.price * seats_booked
        
        return attrs
    
    def create(self, validated_data):
        # Generate unique booking reference
        validated_data['booking_reference'] = str(uuid.uuid4())[:8].upper()
        
        booking = super().create(validated_data)
        
        # Update available seats
        event = booking.event
        event.available_seats -= booking.seats_booked
        event.save()
        
        return booking