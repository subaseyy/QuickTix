"""
QuickTix URLs
URL Configuration for Django REST Framework API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import (
    UserViewSet,
    EventViewSet,
    BookingViewSet,
    PaymentViewSet,
    OrganizerApplicationViewSet,
    StatisticsViewSet,
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'events', EventViewSet, basename='event')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'organizer-applications', OrganizerApplicationViewSet, basename='organizer-application')
router.register(r'statistics', StatisticsViewSet, basename='statistics')

urlpatterns = [
    # JWT Authentication endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # API endpoints
    path('', include(router.urls)),
]

# Additional custom URL patterns
custom_patterns = [
    # User endpoints
    path('users/profile/', UserViewSet.as_view({'get': 'profile'}), name='user-profile'),
    path('users/profile/update/', UserViewSet.as_view({'patch': 'update_profile'}), name='user-profile-update'),
    
    # Event endpoints
    path('events/my-events/', EventViewSet.as_view({'get': 'my_events'}), name='my-events'),
    
    # Booking endpoints
    path('bookings/my-bookings/', BookingViewSet.as_view({'get': 'my_bookings'}), name='my-bookings'),
    
    # Payment endpoints
    path('payments/my-payments/', PaymentViewSet.as_view({'get': 'my_payments'}), name='my-payments'),
    
    # Organizer Application endpoints
    path('organizer-applications/my-applications/', 
         OrganizerApplicationViewSet.as_view({'get': 'my_applications'}), 
         name='my-applications'),
    path('organizer-applications/pending/', 
         OrganizerApplicationViewSet.as_view({'get': 'pending'}), 
         name='pending-applications'),
    
    # Statistics endpoints
    path('statistics/platform/', 
         StatisticsViewSet.as_view({'get': 'platform'}), 
         name='platform-statistics'),
    path('statistics/organizer/', 
         StatisticsViewSet.as_view({'get': 'organizer'}), 
         name='organizer-statistics'),
    path('statistics/user/', 
         StatisticsViewSet.as_view({'get': 'user'}), 
         name='user-statistics'),
]

urlpatterns += custom_patterns