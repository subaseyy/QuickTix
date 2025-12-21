"""
Custom Password Validators for QuickTix
Enforces strong password requirements
"""
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class CustomPasswordValidator:
    """
    Validate password contains:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    
    def validate(self, password, user=None):
        # Minimum length
        if len(password) < 8:
            raise ValidationError(
                _("Password must be at least 8 characters long."),
                code='password_too_short',
            )
        
        # At least one uppercase letter
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("Password must contain at least one uppercase letter (A-Z)."),
                code='password_no_upper',
            )
        
        # At least one lowercase letter
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("Password must contain at least one lowercase letter (a-z)."),
                code='password_no_lower',
            )
        
        # At least one digit
        if not re.search(r'\d', password):
            raise ValidationError(
                _("Password must contain at least one digit (0-9)."),
                code='password_no_digit',
            )
        
        # At least one special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]', password):
            raise ValidationError(
                _(
                    "Password must contain at least one special character "
                    "(!@#$%^&*(),.?\":{}|<>_-+=[]\\;/`~)."
                ),
                code='password_no_special',
            )
    
    def get_help_text(self):
        return _(
            "Your password must contain at least 8 characters, "
            "including uppercase and lowercase letters, "
            "a number, and a special character."
        )


class MinimumLengthValidator:
    """
    Validate password minimum length.
    """
    def __init__(self, min_length=8):
        self.min_length = min_length
    
    def validate(self, password, user=None):
        if len(password) < self.min_length:
            raise ValidationError(
                _("Password must be at least %(min_length)d characters long."),
                code='password_too_short',
                params={'min_length': self.min_length},
            )
    
    def get_help_text(self):
        return _(
            "Your password must contain at least %(min_length)d characters."
            % {'min_length': self.min_length}
        )


class UppercaseValidator:
    """
    Validate password contains at least one uppercase letter.
    """
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("Password must contain at least one uppercase letter (A-Z)."),
                code='password_no_upper',
            )
    
    def get_help_text(self):
        return _("Your password must contain at least one uppercase letter (A-Z).")


class LowercaseValidator:
    """
    Validate password contains at least one lowercase letter.
    """
    def validate(self, password, user=None):
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("Password must contain at least one lowercase letter (a-z)."),
                code='password_no_lower',
            )
    
    def get_help_text(self):
        return _("Your password must contain at least one lowercase letter (a-z).")


class DigitValidator:
    """
    Validate password contains at least one digit.
    """
    def validate(self, password, user=None):
        if not re.search(r'\d', password):
            raise ValidationError(
                _("Password must contain at least one digit (0-9)."),
                code='password_no_digit',
            )
    
    def get_help_text(self):
        return _("Your password must contain at least one digit (0-9).")


class SpecialCharacterValidator:
    """
    Validate password contains at least one special character.
    """
    def __init__(self, special_chars=r'!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~'):
        self.special_chars = special_chars
    
    def validate(self, password, user=None):
        if not re.search(f'[{self.special_chars}]', password):
            raise ValidationError(
                _(
                    "Password must contain at least one special character "
                    "(!@#$%^&*(),.?\":{}|<>_-+=[]\\;/`~)."
                ),
                code='password_no_special',
            )
    
    def get_help_text(self):
        return _(
            "Your password must contain at least one special character "
            "(!@#$%^&*(),.?\":{}|<>_-+=[]\\;/`~)."
        )


class MaximumLengthValidator:
    """
    Validate password maximum length for security.
    """
    def __init__(self, max_length=128):
        self.max_length = max_length
    
    def validate(self, password, user=None):
        if len(password) > self.max_length:
            raise ValidationError(
                _("Password must not exceed %(max_length)d characters."),
                code='password_too_long',
                params={'max_length': self.max_length},
            )
    
    def get_help_text(self):
        return _(
            "Your password must not exceed %(max_length)d characters."
            % {'max_length': self.max_length}
        )


# Utility function to check password strength
def check_password_strength(password):
    """
    Check password strength and return detailed feedback.
    
    Returns:
        dict: {
            'is_valid': bool,
            'strength': str ('weak', 'medium', 'strong'),
            'feedback': list of strings
        }
    """
    feedback = []
    score = 0
    
    # Check length
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("Password should be at least 8 characters long")
    
    if len(password) >= 12:
        score += 1
    
    # Check uppercase
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Add at least one uppercase letter")
    
    # Check lowercase
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Add at least one lowercase letter")
    
    # Check digits
    if re.search(r'\d', password):
        score += 1
    else:
        feedback.append("Add at least one number")
    
    # Check special characters
    if re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]', password):
        score += 1
    else:
        feedback.append("Add at least one special character")
    
    # Determine strength
    if score <= 2:
        strength = 'weak'
    elif score <= 4:
        strength = 'medium'
    else:
        strength = 'strong'
    
    is_valid = score >= 4  # Minimum required score
    
    return {
        'is_valid': is_valid,
        'strength': strength,
        'score': score,
        'max_score': 6,
        'feedback': feedback
    }