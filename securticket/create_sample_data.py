import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'securticket_backend.settings')
django.setup()

from authentication.models import User
from events.models import Event
from datetime import datetime, timedelta

def create_sample_data():
    print("Creating sample data...")
    
    # Get or create admin user (the one you created with createsuperuser)
    try:
        admin = User.objects.get(username='subaseyy')
        print("✓ Using existing admin user: subaseyy")
    except User.DoesNotExist:
        # Create admin if doesn't exist
        admin = User.objects.create_user(
            username='subaseyy',
            email='Subas@nestnepal.com.np',
            first_name='Subas',
            last_name='Admin',
            role='admin',
            is_staff=True,
            is_superuser=True
        )
        admin.set_password('Admin@123')
        admin.save()
        print("✓ Admin user created: subaseyy")
    
    # Create customer user
    customer, created = User.objects.get_or_create(
        username='customer1',
        defaults={
            'email': 'customer@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'customer',
            'phone': '+1234567890'
        }
    )
    if created:
        customer.set_password('Customer@123')
        customer.save()
        print("✓ Customer user created")
    else:
        print("✓ Customer user already exists")
    
    # Create sample events
    events_data = [
        {
            'title': 'Avengers: Endgame',
            'description': 'The epic conclusion to the Infinity Saga',
            'category': 'movie',
            'venue': 'Cinema Hall 1',
            'date': datetime.now().date() + timedelta(days=3),
            'time': '18:00',
            'total_seats': 100,
            'price': 15.00
        },
        {
            'title': 'Rock Concert 2024',
            'description': 'Live performance by top rock bands',
            'category': 'concert',
            'venue': 'Madison Square Garden',
            'date': datetime.now().date() + timedelta(days=7),
            'time': '20:00',
            'total_seats': 500,
            'price': 75.00
        },
        {
            'title': 'NBA Finals Game 7',
            'description': 'Championship deciding game',
            'category': 'sports',
            'venue': 'Staples Center',
            'date': datetime.now().date() + timedelta(days=10),
            'time': '19:30',
            'total_seats': 1000,
            'price': 200.00
        },
        {
            'title': 'Hamilton Musical',
            'description': 'Broadway hit musical performance',
            'category': 'theater',
            'venue': 'Broadway Theater',
            'date': datetime.now().date() + timedelta(days=5),
            'time': '19:00',
            'total_seats': 200,
            'price': 120.00
        },
        {
            'title': 'The Dark Knight',
            'description': 'Classic superhero movie screening',
            'category': 'movie',
            'venue': 'Cinema Hall 2',
            'date': datetime.now().date() + timedelta(days=2),
            'time': '21:00',
            'total_seats': 80,
            'price': 12.00
        }
    ]
    
    for event_data in events_data:
        event, created = Event.objects.get_or_create(
            title=event_data['title'],
            defaults={
                **event_data,
                'available_seats': event_data['total_seats'],
                'created_by': admin  # Pass the User object, not string
            }
        )
        if created:
            print(f"✓ Event created: {event.title}")
        else:
            print(f"✓ Event already exists: {event.title}")
    
    print("\n✅ Sample data creation completed!")
    print("\nLogin credentials:")
    print("Admin - Username: subaseyy, Password: (your password)")
    print("Customer - Username: customer1, Password: Customer@123")

if __name__ == '__main__':
    create_sample_data()