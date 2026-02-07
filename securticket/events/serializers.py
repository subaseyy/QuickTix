from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        # Set available_seats to total_seats initially
        validated_data['available_seats'] = validated_data['total_seats']
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # When updating total_seats, adjust available_seats proportionally
        if 'total_seats' in validated_data:
            old_total = instance.total_seats
            new_total = validated_data['total_seats']
            old_available = instance.available_seats
            
            # If total seats changed, adjust available seats
            if old_total != new_total:
                booked = old_total - old_available
                validated_data['available_seats'] = new_total - booked
        
        return super().update(instance, validated_data)