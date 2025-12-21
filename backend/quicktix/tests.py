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
from django.core.exceptions import ValidationError

from .models import Event, Booking, Payment, OrganizerApplication, PasswordHistory
from .validators import check_password_strength, CustomPasswordValidator

User = get_user_model()


class PasswordValidationTest(TestCase):
    """Test cases for password validation"""
    
    def test_weak_password_no_uppercase(self):
        """Test password without uppercase is weak"""
        result = check_password_strength("password123!")
        self.assertEqual(result['strength'], 'medium')
        self.assertFalse(result['is_valid'])
        self.assertIn("Add at least one uppercase letter", result['feedback'])
    
    def test_weak_password_no_special(self):
        """Test password without special character is weak"""
        result = check_password_strength("Password123")
        self.assertEqual(result['strength'], 'medium')
        self.assertFalse(result['is_valid'])
        self.assertIn("Add at least one special character", result['feedback'])
    
    def test_strong_password(self):
        """Test strong password passes all requirements"""
        result = check_password_strength("MyP@ssw0rd123")
        self.assertEqual(result['strength'], 'strong')
        self.assertTrue(result['is_valid'])
        self.assertEqual(len(result['feedback']), 0)
    
    def test_custom_validator_rejects_weak(self):
        """Test CustomPasswordValidator rejects weak passwords"""
        validator = CustomPasswordValidator()
        
        with self.assertRaises(ValidationError):
            validator.validate("password")  # No uppercase, digit, special
        
        with self.assertRaises(ValidationError):
            validator.validate("Password")  # No digit, special
        
        with self.assertRaises(ValidationError):
            validator.validate("Pass123")  # Too short, no special
    
    def test_custom_validator_accepts_strong(self):
        """Test CustomPasswordValidator accepts strong passwords"""
        validator = CustomPasswordValidator()
        
        # Should not raise exceptions
        try:
            validator.validate("MyP@ssw0rd123")
            validator.validate("Secure!Pass99")
            validator.validate("Admin@2024!")
        except ValidationError:
            self.fail("Strong passwords should not raise ValidationError")
    
    def test_password_strength_score(self):
        """Test password strength scoring system"""
        # Weak (score 0-2)
        weak = check_password_strength("pass")
        self.assertLessEqual(weak['score'], 2)
        
        # Medium (score 3-4)
        medium = check_password_strength("Password123")
        self.assertGreaterEqual(medium['score'], 3)
        self.assertLessEqual(medium['score'], 4)
        
        # Strong (score 5-6)
        strong = check_password_strength("MyP@ssw0rd123")
        self.assertGreaterEqual(strong['score'], 5)


class PasswordHistoryTest(TestCase):
    """Test cases for password history and reuse prevention"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='InitialP@ss123'
        )
        # Initial password should be in history
        PasswordHistory.add_password_to_history(self.user, self.user.password)
    
    def test_password_history_created_on_registration(self):
        """Test that password history is created when user registers"""
        new_user = User.objects.create_user(
            username='newuser',
            email='new@example.com',
            password='NewP@ssw0rd123'
        )
        PasswordHistory.add_password_to_history(new_user, new_user.password)
        
        history_count = PasswordHistory.objects.filter(user=new_user).count()
        self.assertEqual(history_count, 1)
    
    def test_password_reuse_detection(self):
        """Test that password reuse is detected"""
        # Try to reuse current password
        is_reused, message = PasswordHistory.check_password_reuse(
            self.user, 
            'InitialP@ss123',
            history_count=5
        )
        
        self.assertTrue(is_reused)
        self.assertIsNotNone(message)
        self.assertIn("cannot reuse", message.lower())
    
    def test_new_password_allowed(self):
        """Test that new password is allowed"""
        is_reused, message = PasswordHistory.check_password_reuse(
            self.user,
            'BrandNewP@ss456',
            history_count=5
        )
        
        self.assertFalse(is_reused)
        self.assertIsNone(message)
    
    def test_password_history_limit(self):
        """Test that only last N passwords are kept"""
        # Change password 12 times
        for i in range(12):
            new_password = f'TestP@ss{i}!'
            self.user.set_password(new_password)
            self.user.save()
            PasswordHistory.add_password_to_history(self.user, self.user.password)
        
        # Should only keep last 10 passwords
        history_count = PasswordHistory.objects.filter(user=self.user).count()
        self.assertLessEqual(history_count, 10)
    
    def test_check_last_5_passwords(self):
        """Test checking against last 5 passwords"""
        passwords = [
            'FirstP@ss123',
            'SecondP@ss456',
            'ThirdP@ss789',
            'FourthP@ss012',
            'FifthP@ss345'
        ]
        
        # Set 5 passwords
        for pwd in passwords:
            self.user.set_password(pwd)
            self.user.save()
            PasswordHistory.add_password_to_history(self.user, self.user.password)
        
        # Try to reuse first password (should be blocked)
        is_reused, _ = PasswordHistory.check_password_reuse(
            self.user,
            'FirstP@ss123',
            history_count=5
        )
        self.assertTrue(is_reused)
        
        # Try to reuse last password (should be blocked)
        is_reused, _ = PasswordHistory.check_password_reuse(
            self.user,
            'FifthP@ss345',
            history_count=5
        )
        self.assertTrue(is_reused)
        
        # Try completely new password (should be allowed)
        is_reused, _ = PasswordHistory.check_password_reuse(
            self.user,
            'BrandNewP@ss999',
            history_count=5
        )
        self.assertFalse(is_reused)
    
    def test_password_reuse_after_history_limit(self):
        """Test that old passwords can be reused after they fall out of history"""
        old_password = 'VeryOldP@ss123'
        self.user.set_password(old_password)
        self.user.save()
        PasswordHistory.add_password_to_history(self.user, self.user.password)
        
        # Change password 6 more times
        for i in range(6):
            self.user.set_password(f'NewP@ss{i}!')
            self.user.save()
            PasswordHistory.add_password_to_history(self.user, self.user.password)
        
        # Old password should be allowed now (checking only last 5)
        is_reused, _ = PasswordHistory.check_password_reuse(
            self.user,
            old_password,
            history_count=5
        )
        self.assertFalse(is_reused)


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
    
    def test_age_calculation(self):
        """Test age calculation from date of birth"""
        from datetime import date
        
        # Set date of birth to 30 years ago
        self.user.date_of_birth = date(1994, 1, 1)
        self.user.save()
        
        # Age should be calculated
        self.assertIsNotNone(self.user.age)
        self.assertGreaterEqual(self.user.age, 30)
        
        # User without date of birth should return None
        user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='pass123'
        )
        self.assertIsNone(user2.age)
    
    def test_is_adult(self):
        """Test is_adult property"""
        from datetime import date
        
        # Adult user (25 years old)
        self.user.date_of_birth = date(1999, 1, 1)
        self.user.save()
        self.assertTrue(self.user.is_adult)
        
        # Minor user (15 years old)
        minor = User.objects.create_user(
            username='minor',
            email='minor@example.com',
            password='pass123',
            date_of_birth=date(2009, 1, 1)
        )
        self.assertFalse(minor.is_adult)
        
        # User without date of birth
        user_no_dob = User.objects.create_user(
            username='nodob',
            email='nodob@example.com',
            password='pass123'
        )
        self.assertIsNone(user_no_dob.is_adult)
    
    def test_full_address(self):
        """Test full_address property"""
        self.user.address_line1 = '123 Main St'
        self.user.address_line2 = 'Apt 4B'
        self.user.city = 'New York'
        self.user.state = 'NY'
        self.user.postal_code = '10001'
        self.user.country = 'USA'
        self.user.save()
        
        full_address = self.user.full_address
        self.assertIn('123 Main St', full_address)
        self.assertIn('Apt 4B', full_address)
        self.assertIn('New York', full_address)
        self.assertIn('NY', full_address)
        self.assertIn('10001', full_address)
        self.assertIn('USA', full_address)
    
    def test_full_address_partial(self):
        """Test full_address with partial information"""
        self.user.city = 'Los Angeles'
        self.user.country = 'USA'
        self.user.save()
        
        full_address = self.user.full_address
        self.assertIn('Los Angeles', full_address)
        self.assertIn('USA', full_address)
        # Should not have extra commas for missing fields
        self.assertNotIn(',,', full_address)
    
    def test_notification_preferences(self):
        """Test notification preference defaults"""
        self.assertTrue(self.user.email_notifications)
        self.assertFalse(self.user.sms_notifications)
    
    def test_user_profile_fields(self):
        """Test profile fields can be set"""
        self.user.phone_number = '+1234567890'
        self.user.gender = 'male'
        self.user.bio = 'Test bio'
        self.user.profile_picture = 'https://example.com/pic.jpg'
        self.user.save()
        
        self.assertEqual(self.user.phone_number, '+1234567890')
        self.assertEqual(self.user.gender, 'male')
        self.assertEqual(self.user.bio, 'Test bio')
        self.assertEqual(self.user.profile_picture, 'https://example.com/pic.jpg')


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


class UserAPITest(APITestCase):
    """Test cases for User API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        self.user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='UserP@ss123'  # Strong password
        )
    
    def test_user_registration(self):
        """Test user registration with new fields"""
        from datetime import date
        
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'SecurePass123!',
            'password2': 'SecurePass123!',
            'first_name': 'New',
            'last_name': 'User',
            'date_of_birth': '1995-06-15',
            'gender': 'female',
            'phone_number': '+1234567890',
            'city': 'New York',
            'country': 'USA'
        }
        
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify user was created with correct fields
        user = User.objects.get(username='newuser')
        self.assertEqual(user.email, 'new@example.com')
        self.assertEqual(user.date_of_birth, date(1995, 6, 15))
        self.assertEqual(user.gender, 'female')
        self.assertEqual(user.phone_number, '+1234567890')
        self.assertEqual(user.city, 'New York')
    
    def test_registration_minimum_age_validation(self):
        """Test that users under 13 cannot register"""
        from datetime import date, timedelta
        
        # Try to register a 10-year-old
        young_dob = (date.today() - timedelta(days=365*10)).strftime('%Y-%m-%d')
        
        data = {
            'username': 'younguser',
            'email': 'young@example.com',
            'password': 'SecurePass123!',
            'password2': 'SecurePass123!',
            'date_of_birth': young_dob
        }
        
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('date_of_birth', response.data)
    
    def test_get_user_profile(self):
        """Test getting user profile with age calculation"""
        from datetime import date
        
        self.user.date_of_birth = date(1990, 1, 1)
        self.user.phone_number = '+1234567890'
        self.user.city = 'Los Angeles'
        self.user.save()
        
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/users/profile/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('age', response.data)
        self.assertIn('is_adult', response.data)
        self.assertIsNotNone(response.data['age'])
        self.assertTrue(response.data['is_adult'])
    
    def test_update_profile_with_new_fields(self):
        """Test updating profile with new fields"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'bio': 'Event enthusiast',
            'address_line1': '123 Main St',
            'city': 'San Francisco',
            'state': 'CA',
            'postal_code': '94102',
            'email_notifications': True,
            'sms_notifications': True
        }
        
        response = self.client.patch('/api/users/profile/update/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify fields were updated
        self.user.refresh_from_db()
        self.assertEqual(self.user.bio, 'Event enthusiast')
        self.assertEqual(self.user.city, 'San Francisco')
        self.assertTrue(self.user.sms_notifications)
    
    def test_check_password_strength_api(self):
        """Test password strength check API endpoint"""
        # Test strong password
        response = self.client.post(
            '/api/users/check-password-strength/',
            {'password': 'MyP@ssw0rd123'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_valid'])
        self.assertEqual(response.data['strength'], 'strong')
        self.assertTrue(response.data['requirements']['min_length'])
        self.assertTrue(response.data['requirements']['has_uppercase'])
        self.assertTrue(response.data['requirements']['has_lowercase'])
        self.assertTrue(response.data['requirements']['has_digit'])
        self.assertTrue(response.data['requirements']['has_special'])
        
        # Test weak password
        response = self.client.post(
            '/api/users/check-password-strength/',
            {'password': 'password'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_valid'])
        self.assertEqual(response.data['strength'], 'weak')
        self.assertGreater(len(response.data['feedback']), 0)
    
    def test_change_password_success(self):
        """Test changing password successfully"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'old_password': 'UserP@ss123',
            'new_password': 'NewP@ssw0rd456',
            'new_password2': 'NewP@ssw0rd456'
        }
        
        response = self.client.post('/api/users/change-password/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        
        # Verify password was changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewP@ssw0rd456'))
    
    def test_change_password_wrong_old_password(self):
        """Test changing password with wrong old password"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'old_password': 'wrongpassword',
            'new_password': 'NewP@ssw0rd456',
            'new_password2': 'NewP@ssw0rd456'
        }
        
        response = self.client.post('/api/users/change-password/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('old_password', response.data)
    
    def test_change_password_weak_new_password(self):
        """Test changing to a weak password fails"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'old_password': 'UserP@ss123',
            'new_password': 'password',  # Weak password
            'new_password2': 'password'
        }
        
        response = self.client.post('/api/users/change-password/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_change_password_mismatch(self):
        """Test changing password with mismatched new passwords"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'old_password': 'UserP@ss123',
            'new_password': 'NewP@ssw0rd456',
            'new_password2': 'DifferentP@ss789'
        }
        
        response = self.client.post('/api/users/change-password/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)
    
    def test_registration_with_weak_password(self):
        """Test registration fails with weak password"""
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'password',  # Weak password
            'password2': 'password',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_change_password_reuse_prevention(self):
        """Test that old password cannot be reused"""
        self.client.force_authenticate(user=self.user)
        
        # Change password to NewP@ssw0rd456
        data1 = {
            'old_password': 'UserP@ss123',
            'new_password': 'NewP@ssw0rd456',
            'new_password2': 'NewP@ssw0rd456'
        }
        response = self.client.post('/api/users/change-password/', data1, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Try to change back to original password (should fail)
        data2 = {
            'old_password': 'NewP@ssw0rd456',
            'new_password': 'UserP@ss123',  # Reusing old password
            'new_password2': 'UserP@ss123'
        }
        response = self.client.post('/api/users/change-password/', data2, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)
        
        # Error message should mention password reuse
        error_message = str(response.data['new_password'])
        self.assertIn('reuse', error_message.lower())
    
    def test_change_password_same_as_current(self):
        """Test that new password cannot be same as current password"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'old_password': 'UserP@ss123',
            'new_password': 'UserP@ss123',  # Same as current
            'new_password2': 'UserP@ss123'
        }
        
        response = self.client.post('/api/users/change-password/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)
        
        error_message = str(response.data['new_password'])
        self.assertIn('same as', error_message.lower())
    
    def test_multiple_password_changes_history(self):
        """Test that multiple password changes are tracked"""
        self.client.force_authenticate(user=self.user)
        
        passwords = [
            'FirstP@ss123',
            'SecondP@ss456',
            'ThirdP@ss789'
        ]
        
        current_password = 'UserP@ss123'
        
        # Change password multiple times
        for new_pwd in passwords:
            data = {
                'old_password': current_password,
                'new_password': new_pwd,
                'new_password2': new_pwd
            }
            response = self.client.post('/api/users/change-password/', data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            current_password = new_pwd
        
        # Try to reuse first password (should fail if within history limit)
        data = {
            'old_password': current_password,
            'new_password': 'UserP@ss123',  # Original password
            'new_password2': 'UserP@ss123'
        }
        response = self.client.post('/api/users/change-password/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


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