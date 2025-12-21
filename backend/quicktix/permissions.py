"""
QuickTix Permissions
Custom permission classes for role-based access control
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Permission check for admin users only
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )


class IsOrganizer(permissions.BasePermission):
    """
    Permission check for organizer users
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'organizer'
        )


class IsOrganizerOrAdmin(permissions.BasePermission):
    """
    Permission check for organizers or admins
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['organizer', 'admin']
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners or admins to edit
    """
    def has_object_permission(self, request, view, obj):
        # Admin can access everything
        if request.user.role == 'admin':
            return True
        
        # Check if object has an 'owner' or 'user' attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'organizer'):
            return obj.organizer == request.user
        
        return False


class IsEventOrganizer(permissions.BasePermission):
    """
    Permission to check if user is the organizer of an event
    """
    def has_object_permission(self, request, view, obj):
        # Admin can access everything
        if request.user.role == 'admin':
            return True
        
        # For Event objects
        if hasattr(obj, 'organizer'):
            return obj.organizer == request.user
        
        # For Booking objects (check event organizer)
        if hasattr(obj, 'event'):
            return obj.event.organizer == request.user
        
        return False


class CanCreateEvent(permissions.BasePermission):
    """
    Permission to create events (organizers and admins only)
    """
    def has_permission(self, request, view):
        if request.method != 'POST':
            return True
        
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['organizer', 'admin']
        )


class CanViewEventDetails(permissions.BasePermission):
    """
    Permission to view event details
    Anyone can view, but organizers see additional details for their events
    """
    def has_permission(self, request, view):
        return True  # Everyone can list events
    
    def has_object_permission(self, request, view, obj):
        return True  # Everyone can view event details


class CanBookEvent(permissions.BasePermission):
    """
    Permission to book an event
    Users cannot book their own events
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Prevent organizer from booking their own event
        if hasattr(obj, 'organizer'):
            if obj.organizer == request.user:
                return False
        return True


class ReadOnly(permissions.BasePermission):
    """
    Read-only permission
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS


class IsBookingOwnerOrEventOrganizer(permissions.BasePermission):
    """
    Permission for booking access:
    - Booking owner can view/cancel their booking
    - Event organizer can view bookings for their events
    - Admin can view all bookings
    """
    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.role == 'admin':
            return True
        
        # Booking owner has access
        if obj.user == request.user:
            return True
        
        # Event organizer can view bookings for their events
        if obj.event.organizer == request.user:
            # Organizers can only view, not modify other users' bookings
            if request.method in permissions.SAFE_METHODS:
                return True
        
        return False


class CanApplyForOrganizer(permissions.BasePermission):
    """
    Permission to apply for organizer role
    Only regular users who don't have pending applications
    """
    def has_permission(self, request, view):
        if request.method != 'POST':
            return True
        
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'user'
        )


class CanReviewApplication(permissions.BasePermission):
    """
    Permission to review organizer applications
    Only admins can review
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow read access to anyone,
    but write access only to authenticated users
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated