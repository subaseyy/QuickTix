# QuickTix Backend - Setup & Project Structure Guide

## 📁 Complete Project Structure

```
quicktix_backend/
│
├── config/                          # Django project configuration
│   ├── __init__.py
│   ├── settings.py                  # Main settings file
│   ├── urls.py                      # Root URL configuration
│   └── wsgi.py                      # WSGI configuration
│
├── quicktix/                        # Main application
│   ├── __init__.py
│   ├── models.py                    # Database models
│   ├── serializers.py               # DRF serializers
│   ├── views.py                     # API views/viewsets
│   ├── urls.py                      # App URL routing
│   ├── permissions.py               # Custom permissions
│   ├── admin.py                     # Django admin config
│   ├── tests.py                     # Test cases
│   ├── payment_integration.py       # Payment gateway code
│   └── apps.py                      # App configuration
│
├── logs/                            # Application logs
│   └── quicktix.log
│
├── media/                           # User uploaded files
│
├── staticfiles/                     # Collected static files
│
├── requirements.txt                 # Python dependencies
├── manage.py                        # Django management script
├── .env                            # Environment variables (create from .env.example)
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

## 🛠️ Step-by-Step Setup

### 1. Initial Setup

```bash
# Create project directory
mkdir quicktix_backend
cd quicktix_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Create Django Project Structure

```bash
# Start Django project
django-admin startproject config .

# Create main app
python manage.py startapp quicktix
```

### 3. Configure Settings

Copy the provided `settings.py` content to `config/settings.py`

Key configurations:
- Add 'quicktix' to INSTALLED_APPS
- Configure REST_FRAMEWORK settings
- Set up JWT authentication
- Configure CORS
- Set up database (SQLite by default, PostgreSQL for production)

### 4. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

Required environment variables:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Payment gateways
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

# Email
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

### 5. Copy Application Files

Copy all provided files to their respective locations:

```bash
# Models
cp models.py quicktix/

# Serializers
cp serializers.py quicktix/

# Views
cp views.py quicktix/

# URLs
cp urls.py quicktix/

# Permissions
cp permissions.py quicktix/

# Admin
cp admin.py quicktix/

# Tests
cp tests.py quicktix/

# Payment Integration
cp payment_integration.py quicktix/
```

### 6. Update Root URLs

Edit `config/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('quicktix.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 7. Database Migration

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### 8. Create Initial Data (Optional)

Create a management command to populate test data:

```bash
# Create management command directory
mkdir -p quicktix/management/commands

# Create __init__.py files
touch quicktix/management/__init__.py
touch quicktix/management/commands/__init__.py
```

Create `quicktix/management/commands/populate_data.py`:

```python
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from quicktix.models import Event
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with test data'
    
    def handle(self, *args, **kwargs):
        # Create organizer
        organizer = User.objects.create_user(
            username='organizer1',
            email='organizer@example.com',
            password='testpass123',
            role='organizer',
            first_name='John',
            last_name='Organizer'
        )
        
        # Create regular user
        user = User.objects.create_user(
            username='user1',
            email='user@example.com',
            password='testpass123',
            first_name='Jane',
            last_name='User'
        )
        
        # Create events
        events = [
            {
                'title': 'Tech Conference 2025',
                'description': 'Annual technology conference',
                'venue': 'Convention Center, NYC',
                'ticket_price': 99.99,
                'total_capacity': 500,
            },
            {
                'title': 'Music Festival',
                'description': 'Summer music festival',
                'venue': 'Central Park',
                'ticket_price': 75.00,
                'total_capacity': 1000,
            },
            {
                'title': 'Food Expo',
                'description': 'International food exhibition',
                'venue': 'Exhibition Hall',
                'ticket_price': 25.00,
                'total_capacity': 300,
            },
        ]
        
        for i, event_data in enumerate(events, 1):
            Event.objects.create(
                organizer=organizer,
                event_date_time=timezone.now() + timedelta(days=30*i),
                **event_data
            )
        
        self.stdout.write(self.style.SUCCESS('Successfully populated database'))
```

Run the command:
```bash
python manage.py populate_data
```

### 9. Run Development Server

```bash
python manage.py runserver
```

Access the application:
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

### 10. Run Tests

```bash
# Run all tests
python manage.py test

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

## 🔍 Verification Checklist

After setup, verify:

- [ ] Server starts without errors
- [ ] Admin panel is accessible
- [ ] Can create superuser
- [ ] Database migrations applied
- [ ] API endpoints respond
- [ ] JWT authentication works
- [ ] Can register new user
- [ ] Can create events as organizer
- [ ] Can book tickets as user
- [ ] Tests pass

## 📊 Testing the API

### Using cURL

```bash
# Register user
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123","password2":"testpass123"}'

# Get token
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'

# List events (with token)
curl http://localhost:8000/api/events/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman

1. Import the API collection
2. Set up environment variables:
   - BASE_URL: http://localhost:8000
   - ACCESS_TOKEN: (obtained from login)
3. Test all endpoints

### Using API Browser

Visit: http://localhost:8000/api/
Django REST Framework provides a browsable API interface.

## 🚀 Production Deployment

### PostgreSQL Setup

```bash
# Install PostgreSQL
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE quicktix_db;
CREATE USER quicktix_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE quicktix_db TO quicktix_user;
\q

# Update settings.py database configuration
```

### Gunicorn Setup

```bash
# Install Gunicorn
pip install gunicorn

# Test Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000

# Create systemd service (Ubuntu)
sudo nano /etc/systemd/system/quicktix.service
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /static/ {
        alias /path/to/quicktix/staticfiles/;
    }
    
    location /media/ {
        alias /path/to/quicktix/media/;
    }
}
```

### Docker Setup

Create `Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: quicktix_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  web:
    build: .
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/quicktix_db

volumes:
  postgres_data:
```

Run with Docker:
```bash
docker-compose up -d
```

## 🔧 Troubleshooting

### Common Issues

**Issue**: ImportError: No module named 'rest_framework'
**Solution**: Install requirements: `pip install -r requirements.txt`

**Issue**: ModuleNotFoundError: No module named 'quicktix'
**Solution**: Ensure 'quicktix' is in INSTALLED_APPS in settings.py

**Issue**: OperationalError: no such table
**Solution**: Run migrations: `python manage.py migrate`

**Issue**: JWT token not working
**Solution**: Check Authorization header format: `Bearer {token}`

**Issue**: CORS errors from frontend
**Solution**: Add frontend URL to CORS_ALLOWED_ORIGINS in settings

## 📚 Additional Resources

- Django Documentation: https://docs.djangoproject.com/
- DRF Documentation: https://www.django-rest-framework.org/
- JWT Documentation: https://django-rest-framework-simplejwt.readthedocs.io/
- Stripe API: https://stripe.com/docs/api
- Razorpay API: https://razorpay.com/docs/api/

## 🤝 Support

For issues or questions:
1. Check the README
2. Review the documentation
3. Check existing issues on GitHub
4. Create a new issue with details

---

**Happy Coding! 🎉**