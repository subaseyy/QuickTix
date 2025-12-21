"""
QuickTix Tests
Sample test cases for models, views, and business logic
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import Event, Booking, Payment, OrganizerApplication

User = get_user_model()


class UserModelTest(TestCase):
    """Test cases for User model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_user_creation(self):
        """Test user is created with correct defaults"""
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.role, 'user')
        self.assertEqual(self.user.status, 'active')
    
    def test_user_is_organizer(self):
        """Test is_organizer method"""
        self.assertFalse(self.user.is_organizer())
        self.user.role = 'organizer'
        self.assertTrue(self.user.is_organizer())
    
    def test_user_is_admin(self):
        """Test is_admin method"""
        self.assertFalse(self.user.is_admin())
        self.user.role = 'admin'
        self.assertTrue(self.user.is_admin())


class EventModelTest(TestCase):
    """Test cases for Event model"""
    
    def setUp(self):
        self.organizer = User.objects.create_user(
            username='organizer',
            email='organizer@example.com',
            password='orgpass123',
            role='organizer'
        )
        
        self.event = Event.objects.create(
            organizer=self.organizer,
            title='Test Event',
            description='Test Description',
            event_date_time=timezone.now() + timedelta(days=30),
            venue='Test Venue',
            ticket_price=50.00,
            total_capacity=100
        )
    
    def test_event_creation(self):
        """Test event is created correctly"""
        self.assertEqual(self.event.title, 'Test Event')
        self.assertEqual(self.event.available_tickets, 100)
        self.assertEqual(self.event.status, 'active')
    
    def test_tickets_sold(self):
        """Test tickets_sold property"""
        self.assertEqual(self.event.tickets_sold, 0)
        self.event.available_tickets = 80
        self.event.save()
        self.assertEqual(self.event.tickets_sold, 20)
    
    def test_is_sold_out(self):
        """Test is_sold_out property"""
        self.assertFalse(self.event.is_sold_out)
        self.event.available_tickets = 0
        self.event.save()
        self.assertTrue(self.event.is_sold_out)


class BookingModelTest(TestCase):
    """Test cases for Booking model"""
    
    def setUp(self):
        self.organizer = User.objects.create_user(
            username='organizer',
            email='organizer@example.com',
            password='orgpass123',
            role='organizer'
        )
        
        self.user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpass123'
        )
        
        self.event = Event.objects.create(
            organizer=self.organizer,
            title='Test Event',
            event_date_time=timezone.now() + timedelta(days=30),
            venue='Test Venue',
            ticket_price=50.00,
            total_capacity=100
        )
    
    def test_booking_creation(self):
        """Test booking is created correctly"""
        booking = Booking.objects.create(
            event=self.event,
            user=self.user,
            tickets_count=2
        )
        
        self.assertEqual(booking.total_amount, 100.00)
        self.assertEqual(booking.status, 'pending')
        self.assertIsNotNone(booking.booking_reference)
        self.assertTrue(booking.booking_reference.startswith('BK-'))
    
    def test_prevent_self_booking(self):
        """Test organizer cannot book their own event"""
        from django.core.exceptions import ValidationError
        
        booking = Booking(
            event=self.event,
            user=self.organizer,
            tickets_count=2
        )
        
        with self.assertRaises(ValidationError):
            booking.full_clean()


class EventAPITest(APITestCase):
    """Test cases for Event API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        self.organizer = User.objects.create_user(
            username='organizer',
            email='organizer@example.com',
            password='orgpass123',
            role='organizer'
        )
        
        self.user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpass123'
        )
        
        self.event = Event.objects.create(
            organizer=self.organizer,
            title='Test Event',
            event_date_time=timezone.now() + timedelta(days=30),
            venue='Test Venue',
            ticket_price=50.00,
            total_capacity=100
        )
    
    def test_list_events_unauthenticated(self):
        """Test anyone can list events"""
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_event_as_organizer(self):
        """Test organizer can create events"""
        self.client.force_authenticate(user=self.organizer)
        
        data = {
            'title': 'New Event',
            'description': 'Description',
            'event_date_time': (timezone.now() + timedelta(days=60)).isoformat(),
            'venue': 'New Venue',
            'ticket_price': 75.00,
            'total_capacity': 150,
            'status': 'active'
        }
        
        response = self.client.post('/api/events/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_event_as_regular_user(self):
        """Test regular user cannot create events"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'title': 'New Event',
            'event_date_time': (timezone.now() + timedelta(days=60)).isoformat(),
            'venue': 'New Venue',
            'ticket_price': 75.00,
            'total_capacity': 150,
        }
        
        response = self.client.post('/api/events/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class BookingAPITest(APITestCase):
    """Test cases for Booking API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        self.organizer = User.objects.create_user(
            username='organizer',
            email='organizer@example.com',
            password='orgpass123',
            role='organizer'
        )
        
        self.user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpass123'
        )
        
        self.event = Event.objects.create(
            organizer=self.organizer,
            title='Test Event',
            event_date_time=timezone.now() + timedelta(days=30),
            venue='Test Venue',
            ticket_price=50.00,
            total_capacity=100
        )
    
    def test_create_booking(self):
        """Test user can create booking"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'event_id': self.event.id,
            'tickets_count': 2
        }
        
        response = self.client.post('/api/bookings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['tickets_count'], 2)
        self.assertEqual(float(response.data['total_amount']), 100.00)
    
    def test_organizer_cannot_book_own_event(self):
        """Test organizer cannot book their own event"""
        self.client.force_authenticate(user=self.organizer)
        
        data = {
            'event_id': self.event.id,
            'tickets_count': 2
        }
        
        response = self.client.post('/api/bookings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class OrganizerApplicationAPITest(APITestCase):
    """Test cases for Organizer Application API"""
    
    def setUp(self):
        self.client = APIClient()
        
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            role='admin'
        )
        
        self.user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpass123'
        )
    
    def test_user_can_apply(self):
        """Test user can apply for organizer role"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'application_reason': 'I want to organize events in my city'
        }
        
        response = self.client.post('/api/organizer-applications/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_admin_can_approve(self):
        """Test admin can approve applications"""
        application = OrganizerApplication.objects.create(
            user=self.user,
            application_reason='Test reason'
        )
        
        self.client.force_authenticate(user=self.admin)
        
        response = self.client.post(
            f'/api/organizer-applications/{application.id}/approve/',
            {'admin_notes': 'Approved'},
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check user role was updated
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, 'organizer')


# Run tests with: python manage.py test