from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import check_password
from .models import User, PasswordHistory

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'phone', 'first_name', 'last_name')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Save password history
        PasswordHistory.objects.create(
            user=user,
            password_hash=user.password
        )
        
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'created_at')
        read_only_fields = ('id', 'role', 'created_at')

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not check_password(value, user.password):
            raise serializers.ValidationError("Old password is incorrect")
        return value
    
    def validate_new_password(self, value):
        user = self.context['request'].user
        
        # Check password history (last 5 passwords)
        password_history = PasswordHistory.objects.filter(user=user)[:5]
        for history in password_history:
            if check_password(value, history.password_hash):
                raise serializers.ValidationError(
                    "You cannot reuse any of your last 5 passwords."
                )
        
        return value
    
    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        
        # Save to password history
        PasswordHistory.objects.create(
            user=user,
            password_hash=user.password
        )
        
        return user

class PasswordStrengthSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)
    
    def validate_password(self, value):
        import re
        
        strength = {
            'score': 0,
            'feedback': [],
            'has_uppercase': bool(re.search(r'[A-Z]', value)),
            'has_lowercase': bool(re.search(r'[a-z]', value)),
            'has_digit': bool(re.search(r'\d', value)),
            'has_special': bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', value)),
            'length': len(value)
        }
        
        # Calculate score
        if strength['length'] >= 8:
            strength['score'] += 1
        if strength['has_uppercase']:
            strength['score'] += 1
        if strength['has_lowercase']:
            strength['score'] += 1
        if strength['has_digit']:
            strength['score'] += 1
        if strength['has_special']:
            strength['score'] += 1
        
        # Provide feedback
        if not strength['has_uppercase']:
            strength['feedback'].append('Add uppercase letters')
        if not strength['has_lowercase']:
            strength['feedback'].append('Add lowercase letters')
        if not strength['has_digit']:
            strength['feedback'].append('Add numbers')
        if not strength['has_special']:
            strength['feedback'].append('Add special characters')
        if strength['length'] < 8:
            strength['feedback'].append('Use at least 8 characters')
        
        # Determine strength level
        if strength['score'] <= 2:
            strength['level'] = 'weak'
        elif strength['score'] <= 4:
            strength['level'] = 'medium'
        else:
            strength['level'] = 'strong'
        
        return strength