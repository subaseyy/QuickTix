# QuickTix - Event Ticket Booking System

A comprehensive event ticket booking platform built with Django REST Framework, featuring role-based access control, payment integration, and real-time ticket management.

## 🎯 Features

### User Roles
- **Admin**: Full system access, user management, application reviews
- **Event Organizer**: Create and manage events, view attendees, track revenue
- **Regular User**: Browse events, book tickets, make payments

### Core Functionality
- ✅ User authentication with JWT tokens
- ✅ Role-based access control
- ✅ Event creation and management
- ✅ Ticket booking system
- ✅ Payment processing (Stripe/Razorpay integration ready)
- ✅ Organizer application workflow
- ✅ Real-time ticket availability tracking
- ✅ Revenue analytics and statistics
- ✅ Email notifications (configurable)

## 📋 Prerequisites

- Python 3.10+
- pip
- virtualenv (recommended)
- PostgreSQL (optional, SQLite by default)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quicktix_backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 5. Database Setup
```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser
```

### 6. Run Development Server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/users/
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secure_password",
  "password2": "secure_password",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login (Get JWT Token)
```http
POST /api/auth/token/
Content-Type: application/json

{
  "username": "johndoe",
  "password": "secure_password"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Refresh Token
```http
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile/
Authorization: Bearer {access_token}
```

#### Update Profile
```http
PATCH /api/users/profile/update/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith"
}
```

### Event Endpoints

#### List All Events
```http
GET /api/events/
# Query parameters:
# - status: active, cancelled, completed, draft
# - search: search in title, description, venue
# - ordering: event_date_time, ticket_price, created_at
```

#### Get Event Details
```http
GET /api/events/{id}/
```

#### Create Event (Organizer only)
```http
POST /api/events/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "event_date_time": "2025-03-15T09:00:00Z",
  "venue": "Convention Center, NYC",
  "ticket_price": 99.99,
  "total_capacity": 500,
  "status": "active"
}
```

#### Update Event (Organizer only)
```http
PATCH /api/events/{id}/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "ticket_price": 89.99
}
```

#### Delete Event
```http
DELETE /api/events/{id}/
Authorization: Bearer {access_token}
```

#### Get My Events (Organizer)
```http
GET /api/events/my-events/
Authorization: Bearer {access_token}
```

#### Get Event Attendees (Organizer)
```http
GET /api/events/{id}/attendees/
Authorization: Bearer {access_token}
```

#### Get Event Statistics (Organizer)
```http
GET /api/events/{id}/statistics/
Authorization: Bearer {access_token}
```

#### Cancel Event (Organizer)
```http
POST /api/events/{id}/cancel/
Authorization: Bearer {access_token}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "event_id": 1,
  "tickets_count": 2
}

Response:
{
  "id": 1,
  "booking_reference": "BK-20250120-A7F3",
  "tickets_count": 2,
  "total_amount": "199.98",
  "status": "pending"
}
```

#### Get My Bookings
```http
GET /api/bookings/my-bookings/
Authorization: Bearer {access_token}
```

#### Get Booking Details
```http
GET /api/bookings/{id}/
Authorization: Bearer {access_token}
```

#### Cancel Booking
```http
POST /api/bookings/{id}/cancel/
Authorization: Bearer {access_token}
```

### Payment Endpoints

#### Create Payment
```http
POST /api/payments/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "booking_id": 1,
  "payment_method": "stripe"
}
```

#### Process Payment
```http
POST /api/payments/{id}/process/
Authorization: Bearer {access_token}
```

#### Get My Payments
```http
GET /api/payments/my-payments/
Authorization: Bearer {access_token}
```

### Organizer Application Endpoints

#### Apply for Organizer Role
```http
POST /api/organizer-applications/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "application_reason": "I want to organize tech events in my city..."
}
```

#### Get My Applications
```http
GET /api/organizer-applications/my-applications/
Authorization: Bearer {access_token}
```

#### Get Pending Applications (Admin only)
```http
GET /api/organizer-applications/pending/
Authorization: Bearer {access_token}
```

#### Approve Application (Admin only)
```http
POST /api/organizer-applications/{id}/approve/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "admin_notes": "Approved based on profile review"
}
```

#### Reject Application (Admin only)
```http
POST /api/organizer-applications/{id}/reject/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "admin_notes": "Insufficient information provided"
}
```

### Statistics Endpoints

#### Platform Statistics (Admin only)
```http
GET /api/statistics/platform/
Authorization: Bearer {access_token}

Response:
{
  "total_users": 150,
  "total_organizers": 25,
  "total_events": 80,
  "active_events": 30,
  "total_bookings": 450,
  "total_revenue": 45000.00,
  "pending_applications": 5
}
```

#### Organizer Statistics
```http
GET /api/statistics/organizer/
Authorization: Bearer {access_token}

Response:
{
  "total_events": 5,
  "active_events": 2,
  "total_bookings": 120,
  "total_tickets_sold": 250,
  "total_revenue": 12500.00
}
```

#### User Statistics
```http
GET /api/statistics/user/
Authorization: Bearer {access_token}

Response:
{
  "total_bookings": 8,
  "total_tickets": 15,
  "total_spent": 1200.00,
  "upcoming_events": 3
}
```

## 🗄️ Database Schema

### Users Table
- Custom user model with role-based access
- Roles: admin, organizer, user
- Status tracking: active, pending, suspended

### Events Table
- Event details (title, description, venue, date)
- Ticket pricing and capacity management
- Status: active, cancelled, completed, draft
- Automatic ticket availability tracking

### Bookings Table
- User ticket purchases
- Unique booking reference generation
- Status: confirmed, cancelled, refunded, pending
- Linked to payments

### Payments Table
- Payment transaction records
- Support for multiple payment methods
- Status tracking: pending, completed, failed, refunded
- Transaction ID from payment gateway

### Organizer Applications Table
- Application workflow management
- Admin review system
- Status: pending, approved, rejected

## 🔒 Security Features

- JWT-based authentication
- Role-based permissions
- Password validation
- CORS configuration
- SQL injection prevention
- XSS protection
- CSRF protection

## 💳 Payment Integration

### Stripe Integration (Example)
```python
# Add to views.py payment processing
import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

def process_stripe_payment(payment):
    intent = stripe.PaymentIntent.create(
        amount=int(payment.amount * 100),  # Convert to cents
        currency='usd',
        metadata={'booking_id': payment.booking.id}
    )
    return intent
```

### Razorpay Integration (Example)
```python
# Add to views.py payment processing
import razorpay
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def process_razorpay_payment(payment):
    order = client.order.create({
        'amount': int(payment.amount * 100),
        'currency': 'INR',
        'payment_capture': 1
    })
    return order
```

## 🧪 Testing

```bash
# Run tests
python manage.py test

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## 📦 Project Structure

```
quicktix_backend/
├── models.py              # Database models
├── serializers.py         # DRF serializers
├── views.py              # API views and viewsets
├── urls.py               # URL routing
├── permissions.py        # Custom permissions
├── admin.py             # Django admin configuration
├── settings.py          # Django settings
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## 🔧 Configuration

### Database Configuration (PostgreSQL)
```python
# In settings.py, uncomment and configure:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'quicktix_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Email Configuration
```python
# In .env file:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in production
- [ ] Configure proper database (PostgreSQL)
- [ ] Set strong `SECRET_KEY`
- [ ] Configure allowed hosts
- [ ] Set up HTTPS
- [ ] Configure email service
- [ ] Set up payment gateway credentials
- [ ] Configure static files serving
- [ ] Set up logging
- [ ] Enable security headers

### Using Gunicorn
```bash
pip install gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Using Docker
```dockerfile
# Dockerfile example
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 📝 Business Rules

1. **Event Creation**: Only organizers and admins can create events
2. **Self-Booking Prevention**: Organizers cannot book their own events
3. **Ticket Availability**: Automatic tracking and updating
4. **Payment Confirmation**: Bookings confirmed only after successful payment
5. **Cancellation Policy**: 24-hour cancellation window before event
6. **Refund Processing**: Automatic refund on cancellation
7. **Application Approval**: Users must be approved to become organizers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@quicktix.com or open an issue in the repository.

## 🎉 Acknowledgments

- Django REST Framework
- JWT Authentication
- Stripe/Razorpay for payment processing
- All contributors

---

**Built with ❤️ using Django REST Framework**