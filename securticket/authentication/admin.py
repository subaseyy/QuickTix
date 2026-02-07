from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PasswordHistory
from django.utils import timezone


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'failed_login_attempts', 'is_locked', 'locked_until', 'created_at')
    list_filter = ('role', 'is_staff', 'is_active', 'locked_until')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone', 'failed_login_attempts', 'locked_until')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone')}),
    )
    actions = ['unlock_accounts', 'reset_failed_attempts']
    
    def is_locked(self, obj):
        """Display if account is currently locked"""
        if obj.locked_until and obj.locked_until > timezone.now():
            return True
        return False
    is_locked.boolean = True
    is_locked.short_description = 'Locked'
    
    def unlock_accounts(self, request, queryset):
        """Admin action to unlock selected accounts"""
        updated = queryset.update(
            locked_until=None,
            failed_login_attempts=0
        )
        self.message_user(request, f'{updated} account(s) successfully unlocked.')
    unlock_accounts.short_description = "Unlock selected accounts"
    
    def reset_failed_attempts(self, request, queryset):
        """Admin action to reset failed login attempts"""
        updated = queryset.update(failed_login_attempts=0)
        self.message_user(request, f'Reset failed attempts for {updated} account(s).')
    reset_failed_attempts.short_description = "Reset failed login attempts"

@admin.register(PasswordHistory)
class PasswordHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)