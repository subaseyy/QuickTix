from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import Event
from .serializers import EventSerializer
from authentication.permissions import IsAdminUser
from logs.models import ActivityLog

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        event = serializer.save(created_by=self.request.user)
        
        # Log event creation
        ActivityLog.objects.create(
            user=self.request.user,
            action=f'Event Created: {event.title}',
            ip_address=get_client_ip(self.request),
            user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
            metadata={'event_id': event.id}
        )
    
    def perform_update(self, serializer):
        event = serializer.save()
        
        # Log event update
        ActivityLog.objects.create(
            user=self.request.user,
            action=f'Event Updated: {event.title}',
            ip_address=get_client_ip(self.request),
            user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
            metadata={'event_id': event.id}
        )
    
    def perform_destroy(self, instance):
        # Log event deletion
        ActivityLog.objects.create(
            user=self.request.user,
            action=f'Event Deleted: {instance.title}',
            ip_address=get_client_ip(self.request),
            user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
            metadata={'event_id': instance.id}
        )
        
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        from django.utils import timezone
        upcoming_events = Event.objects.filter(date__gte=timezone.now().date())
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get events by category"""
        category = request.query_params.get('category')
        if category:
            events = Event.objects.filter(category=category)
            serializer = self.get_serializer(events, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category parameter required'}, status=400)