"""
QuickTix Models
Event Ticket Booking System Models
"""
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.utils import timezone
import uuid


class User(AbstractUser):
    """
    Custom User model with role-based access
    Roles: admin, organizer, user
    """
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('organizer', 'Event Organizer'),
        ('user', 'Regular User'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending', 'Pending'),
        ('suspended', 'Suspended'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='user'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.email} ({self.role})"
    
    def is_organizer(self):
        return self.role == 'organizer'
    
    def is_admin(self):
        return self.role == 'admin'


class Event(models.Model):
    """
    Event model created by organizers
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('draft', 'Draft'),
    ]
    
    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='organized_events',
        limit_choices_to={'role': 'organizer'}
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    event_date_time = models.DateTimeField()
    venue = models.CharField(max_length=255)
    ticket_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    total_capacity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    available_tickets = models.PositiveIntegerField(
        validators=[MinValueValidator(0)]
    )
    image_url = models.URLField(max_length=255, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'events'
        ordering = ['event_date_time']
        indexes = [
            models.Index(fields=['status', 'event_date_time']),
            models.Index(fields=['organizer']),
        ]
    
    def __str__(self):
        return self.title
    
    def clean(self):
        """Validate event data"""
        from django.core.exceptions import ValidationError
        
        if self.available_tickets > self.total_capacity:
            raise ValidationError('Available tickets cannot exceed total capacity')
        
        if self.pk is None and self.event_date_time <= timezone.now():
            raise ValidationError('Event date must be in the future')
    
    def save(self, *args, **kwargs):
        # Set available_tickets to total_capacity on creation
        if self.pk is None:
            self.available_tickets = self.total_capacity
        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def tickets_sold(self):
        return self.total_capacity - self.available_tickets
    
    @property
    def is_sold_out(self):
        return self.available_tickets == 0
    
    @property
    def total_revenue(self):
        confirmed_bookings = self.bookings.filter(status='confirmed')
        return sum(booking.total_amount for booking in confirmed_bookings)


class Booking(models.Model):
    """
    Booking/Ticket purchase model
    """
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
        ('pending', 'Pending'),
    ]
    
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    tickets_count = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    booking_reference = models.CharField(
        max_length=50,
        unique=True,
        editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-booking_date']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['event', 'status']),
        ]
    
    def __str__(self):
        return f"{self.booking_reference} - {self.user.email}"
    
    def clean(self):
        """Validate booking data"""
        from django.core.exceptions import ValidationError
        
        # Prevent organizer from booking their own event
        if self.event.organizer == self.user:
            raise ValidationError('Event organizers cannot book their own events')
        
        # Check ticket availability
        if self.tickets_count > self.event.available_tickets:
            raise ValidationError(f'Only {self.event.available_tickets} tickets available')
        
        # Validate total amount
        expected_amount = self.tickets_count * self.event.ticket_price
        if self.total_amount != expected_amount:
            raise ValidationError('Total amount does not match ticket price calculation')
    
    def save(self, *args, **kwargs):
        # Generate unique booking reference
        if not self.booking_reference:
            self.booking_reference = self._generate_booking_reference()
        
        # Calculate total amount
        if not self.total_amount:
            self.total_amount = self.tickets_count * self.event.ticket_price
        
        self.full_clean()
        super().save(*args, **kwargs)
    
    def _generate_booking_reference(self):
        """Generate unique booking reference"""
        date_str = timezone.now().strftime('%Y%m%d')
        unique_id = str(uuid.uuid4())[:8].upper()
        return f"BK-{date_str}-{unique_id}"


class Payment(models.Model):
    """
    Payment transaction model
    """
    PAYMENT_METHOD_CHOICES = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('razorpay', 'Razorpay'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name='payment'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    payment_method = models.CharField(
        max_length=50,
        choices=PAYMENT_METHOD_CHOICES
    )
    transaction_id = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True
    )
    payment_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    payment_details = models.JSONField(blank=True, null=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payment_status']),
        ]
    
    def __str__(self):
        return f"Payment {self.id} - {self.booking.booking_reference}"
    
    def clean(self):
        """Validate payment data"""
        from django.core.exceptions import ValidationError
        
        if self.amount != self.booking.total_amount:
            raise ValidationError('Payment amount must match booking total')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
        
        # Update booking status when payment is completed
        if self.payment_status == 'completed' and self.booking.status == 'pending':
            self.booking.status = 'confirmed'
            self.booking.save()
            
            # Update event available tickets
            self.booking.event.available_tickets -= self.booking.tickets_count
            self.booking.event.save()
        
        # Handle refunds
        if self.payment_status == 'refunded' and self.booking.status == 'confirmed':
            self.booking.status = 'refunded'
            self.booking.save()
            
            # Restore tickets
            self.booking.event.available_tickets += self.booking.tickets_count
            self.booking.event.save()


class OrganizerApplication(models.Model):
    """
    Application to become an event organizer
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='organizer_applications'
    )
    application_reason = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='reviewed_applications',
        null=True,
        blank=True,
        limit_choices_to={'role': 'admin'}
    )
    admin_notes = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'organizer_applications'
        ordering = ['-applied_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['user', 'status']),
        ]
    
    def __str__(self):
        return f"Application by {self.user.email} - {self.status}"
    
    def clean(self):
        """Validate application"""
        from django.core.exceptions import ValidationError
        
        # Check for existing pending application
        if self.pk is None:
            existing_pending = OrganizerApplication.objects.filter(
                user=self.user,
                status='pending'
            ).exists()
            if existing_pending:
                raise ValidationError('User already has a pending application')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        
        # Update reviewed_at timestamp when status changes
        if self.pk:
            old_status = OrganizerApplication.objects.get(pk=self.pk).status
            if old_status == 'pending' and self.status in ['approved', 'rejected']:
                self.reviewed_at = timezone.now()
        
        super().save(*args, **kwargs)
        
        # Update user role when approved
        if self.status == 'approved':
            self.user.role = 'organizer'
            self.user.status = 'active'
            self.user.save()