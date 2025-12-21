# QuickTix API Quick Reference Card

## 🔐 Authentication Headers

All authenticated requests require:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

## 🔑 Get Access Token

```bash
POST /api/auth/token/
{
  "username": "user",
  "password": "pass"
}

Response:
{
  "access": "eyJ...",
  "refresh": "eyJ..."
}
```

## 👤 User Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/api/users/` | Public | Register new user |
| GET | `/api/users/profile/` | Authenticated | Get my profile |
| PATCH | `/api/users/profile/update/` | Authenticated | Update my profile |

## 🎫 Event Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/events/` | Public | List all active events |
| POST | `/api/events/` | Organizer/Admin | Create new event |
| GET | `/api/events/{id}/` | Public | Get event details |
| PATCH | `/api/events/{id}/` | Owner/Admin | Update event |
| DELETE | `/api/events/{id}/` | Owner/Admin | Delete event |
| GET | `/api/events/my-events/` | Organizer | Get my events |
| GET | `/api/events/{id}/attendees/` | Owner/Admin | Get attendees |
| GET | `/api/events/{id}/statistics/` | Owner/Admin | Get event stats |
| POST | `/api/events/{id}/cancel/` | Owner/Admin | Cancel event |

## 🎟️ Booking Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/bookings/` | Authenticated | List my bookings |
| POST | `/api/bookings/` | Authenticated | Create booking |
| GET | `/api/bookings/{id}/` | Owner/Organizer/Admin | Get booking details |
| GET | `/api/bookings/my-bookings/` | Authenticated | Get my bookings |
| POST | `/api/bookings/{id}/cancel/` | Owner | Cancel booking |

## 💳 Payment Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/api/payments/` | Authenticated | Create payment |
| GET | `/api/payments/{id}/` | Owner/Admin | Get payment details |
| GET | `/api/payments/my-payments/` | Authenticated | Get my payments |
| POST | `/api/payments/{id}/process/` | Authenticated | Process payment |

## 📝 Organizer Application Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/api/organizer-applications/` | User | Apply for organizer |
| GET | `/api/organizer-applications/my-applications/` | Authenticated | Get my applications |
| GET | `/api/organizer-applications/pending/` | Admin | Get pending applications |
| POST | `/api/organizer-applications/{id}/approve/` | Admin | Approve application |
| POST | `/api/organizer-applications/{id}/reject/` | Admin | Reject application |

## 📊 Statistics Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/statistics/platform/` | Admin | Platform statistics |
| GET | `/api/statistics/organizer/` | Organizer | My organizer stats |
| GET | `/api/statistics/user/` | Authenticated | My user stats |

## 📋 Request Examples

### Register User
```bash
POST /api/users/
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "password2": "securepass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Create Event (Organizer)
```bash
POST /api/events/
Authorization: Bearer {token}
{
  "title": "Tech Conference 2025",
  "description": "Annual tech conference",
  "event_date_time": "2025-03-15T09:00:00Z",
  "venue": "Convention Center, NYC",
  "ticket_price": 99.99,
  "total_capacity": 500,
  "status": "active"
}
```

### Book Tickets
```bash
POST /api/bookings/
Authorization: Bearer {token}
{
  "event_id": 1,
  "tickets_count": 2
}
```

### Create Payment
```bash
POST /api/payments/
Authorization: Bearer {token}
{
  "booking_id": 1,
  "payment_method": "stripe"
}
```

### Apply for Organizer
```bash
POST /api/organizer-applications/
Authorization: Bearer {token}
{
  "application_reason": "I have 5 years of event management experience..."
}
```

## 🔍 Query Parameters

### Events
```
GET /api/events/?status=active
GET /api/events/?search=conference
GET /api/events/?ordering=-event_date_time
GET /api/events/?status=active&ordering=ticket_price
```

### Bookings
```
GET /api/bookings/?status=confirmed
GET /api/bookings/?event=1
GET /api/bookings/?ordering=-booking_date
```

### Payments
```
GET /api/payments/?payment_status=completed
GET /api/payments/?payment_method=stripe
```

## 📝 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 204 | No Content - Deleted successfully |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

## 🎭 User Roles & Permissions

### Admin
- Full system access
- Manage all users and events
- Approve/reject organizer applications
- View platform statistics

### Organizer
- Create and manage own events
- View attendees for own events
- Book tickets for other events
- View organizer statistics

### User
- Browse and search events
- Book tickets
- View own bookings
- Apply for organizer role
- View user statistics

## 🚫 Business Rules

1. ❌ Users cannot book their own events
2. ✅ Booking requires available tickets
3. ✅ Payment required for confirmation
4. ✅ 24-hour cancellation policy
5. ✅ Automatic refunds on cancellation
6. ✅ Admin approval for organizer role
7. ✅ Real-time ticket availability

## 🔧 Common Operations

### Complete Booking Flow
```
1. User browses events: GET /api/events/
2. User selects event: GET /api/events/{id}/
3. User creates booking: POST /api/bookings/
4. User creates payment: POST /api/payments/
5. User processes payment: POST /api/payments/{id}/process/
6. Booking confirmed automatically
```

### Organizer Application Flow
```
1. User applies: POST /api/organizer-applications/
2. Admin views pending: GET /api/organizer-applications/pending/
3. Admin approves: POST /api/organizer-applications/{id}/approve/
4. User role automatically updated to 'organizer'
```

### Event Creation Flow
```
1. Organizer creates: POST /api/events/
2. Event goes live with status='active'
3. Users can book: POST /api/bookings/
4. Organizer views attendees: GET /api/events/{id}/attendees/
5. Organizer checks stats: GET /api/events/{id}/statistics/
```

## 💡 Tips

- Always include `Authorization` header for protected endpoints
- Token expires in 1 hour (configurable)
- Use `refresh` token to get new `access` token
- Booking reference format: `BK-YYYYMMDD-XXXX`
- All dates in ISO 8601 format
- Prices in decimal format (e.g., 99.99)

## 🐛 Troubleshooting

**401 Unauthorized**
→ Check if token is valid and not expired

**403 Forbidden**
→ Check if user has required role/permission

**400 Bad Request**
→ Check request body validation errors

**404 Not Found**
→ Check if resource ID exists

## 📚 More Info

- Full API docs: `README.md`
- Setup guide: `SETUP_GUIDE.md`
- Database schema: `database-schema-documentation.md`
- Project summary: `PROJECT_SUMMARY.md`

---

**Quick Command Reference**

```bash
# Start server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Open shell
python manage.py shell
```

---

**Base URL**: `http://localhost:8000/api/`

**Need help?** Check the documentation files! 📖