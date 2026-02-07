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