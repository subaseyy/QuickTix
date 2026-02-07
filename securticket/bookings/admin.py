from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_reference', 'user', 'event', 'seats_booked', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('booking_reference', 'user__username', 'event__title')
    date_hierarchy = 'created_at'
    readonly_fields = ('booking_reference', 'created_at', 'updated_at')