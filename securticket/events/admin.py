from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'venue', 'date', 'time', 'available_seats', 'price', 'created_by')
    list_filter = ('category', 'date', 'created_at')
    search_fields = ('title', 'venue', 'description')
    date_hierarchy = 'date'
    readonly_fields = ('created_at', 'updated_at')