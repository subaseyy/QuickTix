from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import User
from .serializers import (
    UserRegistrationSerializer, 
    UserSerializer, 
    ChangePasswordSerializer,
    PasswordStrengthSerializer
)
from logs.models import ActivityLog

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Log registration
        ActivityLog.objects.create(
            user=user,
            action='User Registration',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/15m', method='POST')
def login(request):
    from django.utils import timezone
    from datetime import timedelta
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Please provide both username and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user exists and is locked
    try:
        user_check = User.objects.get(username=username)
        
        # Check if account is locked
        if user_check.locked_until and user_check.locked_until > timezone.now():
            time_remaining = (user_check.locked_until - timezone.now()).total_seconds()
            minutes_remaining = int(time_remaining / 60)
            seconds_remaining = int(time_remaining % 60)
            
            # Log locked account attempt
            ActivityLog.objects.create(
                user=user_check,
                action='Login Attempt - Account Locked',
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                metadata={
                    'locked_until': user_check.locked_until.isoformat(),
                    'time_remaining': f"{minutes_remaining}m {seconds_remaining}s"
                }
            )
            
            return Response({
                'error': f'Account is locked due to too many failed login attempts. Please try again in {minutes_remaining} minutes and {seconds_remaining} seconds.',
                'locked': True,
                'locked_until': user_check.locked_until.isoformat(),
                'minutes_remaining': minutes_remaining,
                'seconds_remaining': seconds_remaining
            }, status=status.HTTP_403_FORBIDDEN)
        
        # If lock period has expired, unlock the account
        if user_check.locked_until and user_check.locked_until <= timezone.now():
            user_check.locked_until = None
            user_check.failed_login_attempts = 0
            user_check.save()
    
    except User.DoesNotExist:
        pass
    
    # Attempt authentication
    user = authenticate(request=request, username=username, password=password)
    
    if user:
        # Reset failed attempts on successful login
        user.failed_login_attempts = 0
        user.locked_until = None
        user.save()
        
        # Log successful login
        ActivityLog.objects.create(
            user=user,
            action='User Login - Success',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    else:
        # Handle failed login
        try:
            user_obj = User.objects.get(username=username)
            user_obj.failed_login_attempts += 1
            
            # Lock account after 5 failed attempts for 30 minutes
            if user_obj.failed_login_attempts >= 5:
                user_obj.locked_until = timezone.now() + timedelta(minutes=30)
                user_obj.save()
                
                # Log account lockout
                ActivityLog.objects.create(
                    user=user_obj,
                    action='Account Locked - Too Many Failed Attempts',
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    metadata={
                        'failed_attempts': user_obj.failed_login_attempts,
                        'locked_until': user_obj.locked_until.isoformat()
                    }
                )
                
                return Response({
                    'error': 'Account locked due to too many failed login attempts. Please try again in 30 minutes.',
                    'locked': True,
                    'attempts': user_obj.failed_login_attempts
                }, status=status.HTTP_403_FORBIDDEN)
            else:
                user_obj.save()
                attempts_remaining = 5 - user_obj.failed_login_attempts
                
                # Log failed attempt
                ActivityLog.objects.create(
                    user=user_obj,
                    action='User Login - Failed',
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    metadata={
                        'failed_attempts': user_obj.failed_login_attempts,
                        'attempts_remaining': attempts_remaining
                    }
                )
                
                return Response({
                    'error': f'Invalid credentials. {attempts_remaining} attempts remaining before account lockout.',
                    'attempts_remaining': attempts_remaining
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        except User.DoesNotExist:
            # Username doesn't exist - don't reveal this info
            ActivityLog.objects.create(
                user=None,
                action='Login Attempt - Unknown Username',
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                metadata={'username_attempted': username}
            )
        
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Log logout
        ActivityLog.objects.create(
            user=request.user,
            action='User Logout',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        
        # Log profile update
        ActivityLog.objects.create(
            user=request.user,
            action='Profile Updated',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        
        # Log password change
        ActivityLog.objects.create(
            user=request.user,
            action='Password Changed',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def check_password_strength(request):
    serializer = PasswordStrengthSerializer(data=request.data)
    if serializer.is_valid():
        strength = serializer.validated_data['password']
        return Response(strength, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)