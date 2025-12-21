"""
QuickTix Custom Authentication Backend
Create this file: backend/quicktix/backends.py

This allows users to login with EMAIL instead of username
"""

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailBackend(ModelBackend):
    """
    Custom authentication backend that allows users to login with email
    """
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        """
        Authenticate using email instead of username
        
        Args:
            username: Actually the email (Django calls it username)
            password: User's password
        """
        try:
            # Try to get user by email
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            # User not found
            return None
        except User.MultipleObjectsReturned:
            # Multiple users with same email (shouldn't happen with unique constraint)
            return None
        
        # Check password
        if user.check_password(password):
            return user
        
        return None
    
    def get_user(self, user_id):
        """
        Get user by ID
        """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None9