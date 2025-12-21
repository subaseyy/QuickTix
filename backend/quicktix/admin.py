"""
QuickTix Admin
Django Admin Configuration for all models
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Event, Booking, Payment, OrganizerApplication


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model"""
    list_display = ('email', 'username', 'role', 'status', 'date_joined')
    list_filter = ('role', 'status', 'is_active', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {
            'fields': ('role', 'status', 'is_active', 'is_staff', 'is_superuser', 
                      'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'status'),
        }),
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin interface for Event model"""
    list_display = ('title', 'organizer_name', 'event_date_time', 'venue', 
                   'ticket_price', 'tickets_status', 'status', 'created_at')
    list_filter = ('status', 'event_date_time', 'created_at')
    search_fields = ('title', 'description', 'venue', 'organizer__email')
    date_hierarchy = 'event_date_time'
    ordering = ('-event_date_time',)
    readonly_fields = ('created_at', 'updated_at', 'tickets_sold', 'total_revenue')
    
    fieldsets = (
        ('Event Information', {
            'fields': ('title', 'description', 'organizer', 'image_url')
        }),
        ('Event Details', {
            'fields': ('event_date_time', 'venue', 'status')
        }),
        ('Ticket Information', {
            'fields': ('ticket_price', 'total_capacity', 'available_tickets')
        }),
        ('Statistics', {
            'fields': ('tickets_sold', 'total_revenue'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def organizer_name(self, obj):
        return obj.organizer.get_full_name() or obj.organizer.email
    organizer_name.short_description = 'Organizer'
    
    def tickets_status(self, obj):
        sold = obj.tickets_sold
        total = obj.total_capacity
        percentage = (sold / total * 100) if total > 0 else 0
        
        if percentage >= 90:
            color = 'red'
        elif percentage >= 70:
            color = 'orange'
        else:
            color = 'green'
        
        return format_html(
            '<span style="color: {};">{}/{} ({}%)</span>',
            color, sold, total, int(percentage)
        )
    tickets_status.short_description = 'Tickets (Sold/Total)'
    
    def tickets_sold(self, obj):
        return obj.tickets_sold
    
    def total_revenue(self, obj):
        return f"${obj.total_revenue:.2f}"


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Admin interface for Booking model"""
    list_display = ('booking_reference', 'user_email', 'event_title', 
                   'tickets_count', 'total_amount', 'status', 'booking_date')
    list_filter = ('status', 'booking_date')
    search_fields = ('booking_reference', 'user__email', 'event__title')
    date_hierarchy = 'booking_date'
    ordering = ('-booking_date',)
    readonly_fields = ('booking_reference', 'booking_date', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_reference', 'event', 'user', 'status')
        }),
        ('Ticket Details', {
            'fields': ('tickets_count', 'total_amount')
        }),
        ('Timestamps', {
            'fields': ('booking_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    
    def event_title(self, obj):
        return obj.event.title
    event_title.short_description = 'Event'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin interface for Payment model"""
    list_display = ('id', 'booking_reference', 'amount', 'payment_method', 
                   'payment_status', 'transaction_id', 'payment_date')
    list_filter = ('payment_status', 'payment_method', 'payment_date')
    search_fields = ('transaction_id', 'booking__booking_reference')
    date_hierarchy = 'payment_date'
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'payment_date')
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('booking', 'amount', 'payment_method', 'payment_status')
        }),
        ('Transaction Details', {
            'fields': ('transaction_id', 'payment_details', 'payment_date')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def booking_reference(self, obj):
        return obj.booking.booking_reference
    booking_reference.short_description = 'Booking Reference'


@admin.register(OrganizerApplication)
class OrganizerApplicationAdmin(admin.ModelAdmin):
    """Admin interface for Organizer Application model"""
    list_display = ('user_email', 'status', 'applied_at', 'reviewed_by_name', 'reviewed_at')
    list_filter = ('status', 'applied_at', 'reviewed_at')
    search_fields = ('user__email', 'application_reason', 'admin_notes')
    date_hierarchy = 'applied_at'
    ordering = ('-applied_at',)
    readonly_fields = ('applied_at', 'reviewed_at')
    
    fieldsets = (
        ('Application Information', {
            'fields': ('user', 'application_reason', 'status')
        }),
        ('Review', {
            'fields': ('reviewed_by', 'admin_notes', 'reviewed_at')
        }),
        ('Timestamps', {
            'fields': ('applied_at',),
            'classes': ('collapse',)
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    
    def reviewed_by_name(self, obj):
        if obj.reviewed_by:
            return obj.reviewed_by.get_full_name() or obj.reviewed_by.email
        return '-'
    reviewed_by_name.short_description = 'Reviewed By'
    
    actions = ['approve_applications', 'reject_applications']
    
    def approve_applications(self, request, queryset):
        """Bulk approve applications"""
        pending = queryset.filter(status='pending')
        for application in pending:
            application.status = 'approved'
            application.reviewed_by = request.user
            application.save()
        
        self.message_user(request, f'{pending.count()} applications approved successfully.')
    approve_applications.short_description = 'Approve selected applications'
    
    def reject_applications(self, request, queryset):
        """Bulk reject applications"""
        pending = queryset.filter(status='pending')
        for application in pending:
            application.status = 'rejected'
            application.reviewed_by = request.user
            application.save()
        
        self.message_user(request, f'{pending.count()} applications rejected.')
    reject_applications.short_description = 'Reject selected applications'


# Customize admin site
admin.site.site_header = 'QuickTix Administration'
admin.site.site_title = 'QuickTix Admin'
admin.site.index_title = 'Welcome to QuickTix Admin Panel'