"""
Management command to populate QuickTix with fake data

Usage:
    python manage.py populate_data --events=20 --users=50 --bookings-per-event=5

WARNING: This will DELETE existing data in the affected models!
"""

import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from django.contrib.auth import get_user_model

from quicktix.models import (
    User, Event, Booking, Payment, OrganizerApplication, PasswordHistory
)

User = get_user_model()
fake = Faker('en_US')  # or 'ne_NP' if you prefer Nepali flavor

class Command(BaseCommand):
    help = 'Populate database with fake data for development/testing'

    def add_arguments(self, parser):
        parser.add_argument('--events', type=int, default=15,
                            help='Number of events to create')
        parser.add_argument('--users', type=int, default=40,
                            help='Number of regular users to create')
        parser.add_argument('--organizers', type=int, default=8,
                            help='Number of organizer users to create')
        parser.add_argument('--bookings-per-event', type=int, default=4,
                            help='Average bookings per event')
        parser.add_argument('--clear', action='store_true',
                            help='Clear existing data before populating')

    def handle(self, *args, **options):
        events_count = options['events']
        users_count = options['users']
        organizers_count = options['organizers']
        bookings_per_event = options['bookings_per_event']
        clear = options['clear']

        self.stdout.write(self.style.WARNING('Starting data population...'))

        if clear:
            self.stdout.write("Clearing existing data...")
            models_to_clear = [Booking, Payment, OrganizerApplication, PasswordHistory, Event, User]
            for model in models_to_clear:
                count = model.objects.count()
                model.objects.all().delete()
                self.stdout.write(f"  Deleted {count} {model.__name__} records")

        # ────────────────────────────────────────────────
        # 1. Create admin user
        # ────────────────────────────────────────────────
        if not User.objects.filter(email='admin@quicktix.com').exists():
            admin = User.objects.create_superuser(
                username='admin',
                email='admin@quicktix.com',
                password='admin1234!',
                first_name='Admin',
                last_name='QuickTix',
                role='admin',
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin.email}'))
        else:
            admin = User.objects.get(email='admin@quicktix.com')

        # ────────────────────────────────────────────────
        # 2. Create organizers
        # ────────────────────────────────────────────────
        organizers = []
        for _ in range(organizers_count):
            email = fake.unique.email()
            user = User.objects.create_user(
                username=fake.user_name(),
                email=email,
                password='organizer123!',
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                role='organizer',
                phone_number=fake.phone_number()[:15],
                country='Nepal',
                city=random.choice(['Kathmandu', 'Pokhara', 'Biratnagar', 'Lalitpur', 'Bharatpur']),
            )
            organizers.append(user)

        self.stdout.write(self.style.SUCCESS(f'Created {len(organizers)} organizers'))

        # ────────────────────────────────────────────────
        # 3. Create regular users
        # ────────────────────────────────────────────────
        users = [admin]  # admin can also make bookings
        for _ in range(users_count):
            email = fake.unique.email()
            user = User.objects.create_user(
                username=fake.user_name(),
                email=email,
                password='user1234!',
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                role='user',
                date_of_birth=fake.date_of_birth(minimum_age=15, maximum_age=65),
                phone_number=fake.phone_number()[:15],
                gender=random.choice(['male', 'female', 'other', 'prefer_not_to_say', None]),
                country='Nepal',
                city=random.choice(['Kathmandu', 'Pokhara', 'Biratnagar', 'Lalitpur', 'Bharatpur', None]),
            )
            users.append(user)

        self.stdout.write(self.style.SUCCESS(f'Created {len(users)} total users (including admin)'))

        # ────────────────────────────────────────────────
        # 4. Create events
        # ────────────────────────────────────────────────
        events = []
        event_types = [
            "Concert", "Music Festival", "Comedy Show", "Football Match",
            "Cricket Tournament", "Cultural Dance Night", "Stand-up Comedy",
            "Movie Premiere", "Tech Conference", "Food Festival",
            "Marathon", "Art Exhibition", "Theater Play", "Fashion Show"
        ]

        venues = [
            "Dasharath Stadium", "Tribhuvan International Stadium", "Army Ground",
            "Hyatt Regency Kathmandu", "Soaltee Hotel", "Nepal Academy Hall",
            "British Council Hall", "Civil Mall Rooftop", "Labim Mall",
            "Kathmandu Mall", "Pokhara Sports Ground", "Biratnagar Stadium"
        ]

        for _ in range(events_count):
            organizer = random.choice(organizers)
            event_date = timezone.now() + timedelta(days=random.randint(5, 120))
            
            title_template = random.choice([
                "{artist} Live in Kathmandu",
                "{event_type} 2026",
                "Grand {event_type} Night",
                "{city} {event_type} Festival",
                "{team1} vs {team2} - {event_type}",
            ])

            if "{artist}" in title_template:
                title = title_template.format(
                    artist=fake.name(),
                    event_type=random.choice(event_types),
                    city=random.choice(['Kathmandu', 'Pokhara', 'Biratnagar'])
                )
            elif "{team1}" in title_template:
                title = title_template.format(
                    team1=fake.city() + " FC",
                    team2=fake.city() + " United",
                    event_type=random.choice(["Match", "Derby", "Final"])
                )
            else:
                title = title_template.format(
                    event_type=random.choice(event_types),
                    city=random.choice(['Kathmandu', 'Pokhara'])
                )

            event = Event.objects.create(
                title=title[:120],
                description=fake.paragraph(nb_sentences=random.randint(4, 9)),
                organizer=organizer,
                venue=random.choice(venues),
                event_date_time=event_date,
                ticket_price=round(random.uniform(300, 4500), 2),
                total_capacity=random.randint(80, 3500),
                tickets_sold=0,  # will be updated by bookings
                status='active',
            )
            events.append(event)

        self.stdout.write(self.style.SUCCESS(f'Created {len(events)} events'))

        # ────────────────────────────────────────────────
        # 5. Create bookings & payments
        # ────────────────────────────────────────────────
        booking_statuses = ['pending', 'confirmed', 'cancelled']
        payment_statuses = ['pending', 'completed', 'failed', 'refunded']

        booking_count = 0
        for event in events:
            # 50–150% of target bookings per event
            target_bookings = random.randint(
                max(1, int(bookings_per_event * 0.5)),
                int(bookings_per_event * 1.5)
            )

            for _ in range(target_bookings):
                user = random.choice(users)
                tickets = random.randint(1, min(6, event.total_capacity - event.tickets_sold))

                if tickets <= 0:
                    continue

                booking = Booking.objects.create(
                    user=user,
                    event=event,
                    tickets_count=tickets,
                    total_amount=event.ticket_price * tickets,
                    status=random.choice(booking_statuses),
                    booking_reference=f"QTX-{fake.uuid4()[:8].upper()}",
                )

                # Create payment if booking is not cancelled
                if booking.status != 'cancelled':
                    Payment.objects.create(
                        booking=booking,
                        amount=booking.total_amount,
                        payment_method=random.choice(['stripe', 'razorpay', 'esewa', 'khalti']),
                        transaction_id=fake.uuid4().hex[:16].upper(),
                        payment_status=random.choice(payment_statuses),
                    )

                # Update sold tickets count
                event.tickets_sold += tickets
                event.save()

                booking_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {booking_count} bookings'))

        # ────────────────────────────────────────────────
        # 6. Optional: some organizer applications
        # ────────────────────────────────────────────────
        for _ in range(6):
            applicant = random.choice([u for u in users if u.role == 'user'])
            OrganizerApplication.objects.create(
                user=applicant,
                application_reason=fake.paragraph(nb_sentences=4),
                status=random.choice(['pending', 'approved', 'rejected']),
                reviewed_by=random.choice([None, admin]),
                reviewed_at=timezone.now() if random.random() > 0.4 else None,
            )

        self.stdout.write(self.style.SUCCESS('Population complete!'))
        self.stdout.write(self.style.SUCCESS(
            f"Admin login → email: admin@quicktix.com / password: admin1234!"
        ))