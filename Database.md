# Event Ticket Booking System - Database Schema Documentation

## Database Overview
This schema supports a multi-role event ticketing platform with Admins, Event Organizers, and Regular Users.

---

## Tables & Relationships

### 1. USERS
**Purpose**: Store all system users (Admin, Organizers, Regular Users)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Login email |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM | NOT NULL, DEFAULT 'user' | 'admin', 'organizer', 'user' |
| status | ENUM | NOT NULL, DEFAULT 'active' | 'active', 'pending', 'suspended' |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration date |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (email)
- INDEX (role, status)

**Business Rules**:
- Email must be unique across system
- Default role is 'user' on registration
- 'pending' status used for organizer applications
- Admins cannot be suspended

---

### 2. EVENTS
**Purpose**: Store event details created by organizers

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique event identifier |
| organizer_id | INT | FOREIGN KEY (USERS.id), NOT NULL | Event creator |
| title | VARCHAR(200) | NOT NULL | Event name |
| description | TEXT | NULL | Event details |
| event_date_time | DATETIME | NOT NULL | When event happens |
| venue | VARCHAR(255) | NOT NULL | Event location |
| ticket_price | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Price per ticket |
| total_capacity | INT | NOT NULL, CHECK > 0 | Max attendees |
| available_tickets | INT | NOT NULL, CHECK >= 0 | Remaining tickets |
| image_url | VARCHAR(255) | NULL | Event banner/poster |
| status | ENUM | NOT NULL, DEFAULT 'active' | 'active', 'cancelled', 'completed', 'draft' |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (organizer_id) REFERENCES USERS(id) ON DELETE CASCADE
- INDEX (status, event_date_time)
- INDEX (organizer_id)

**Business Rules**:
- available_tickets <= total_capacity
- available_tickets decreases on booking
- Cannot delete event if bookings exist (handle with CASCADE or CHECK)
- Organizers can only modify their own events
- Free events: ticket_price = 0

**Constraints**:
```sql
CHECK (available_tickets <= total_capacity)
CHECK (ticket_price >= 0)
CHECK (total_capacity > 0)
CHECK (event_date_time > NOW()) -- for new events
```

---

### 3. BOOKINGS
**Purpose**: Store ticket bookings/purchases

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique booking ID |
| event_id | INT | FOREIGN KEY (EVENTS.id), NOT NULL | Booked event |
| user_id | INT | FOREIGN KEY (USERS.id), NOT NULL | Who booked |
| tickets_count | INT | NOT NULL, CHECK > 0 | Number of tickets |
| total_amount | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Total cost |
| booking_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When booked |
| status | ENUM | NOT NULL, DEFAULT 'pending' | 'confirmed', 'cancelled', 'refunded', 'pending' |
| booking_reference | VARCHAR(50) | UNIQUE, NOT NULL | e.g., "BK-20250101-ABCD" |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (event_id) REFERENCES EVENTS(id) ON DELETE CASCADE
- FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
- UNIQUE KEY (booking_reference)
- INDEX (user_id, status)
- INDEX (event_id, status)

**Business Rules**:
- User cannot book their own event (check: user_id != event.organizer_id)
- tickets_count must be <= event.available_tickets
- total_amount = tickets_count × event.ticket_price
- Booking confirmed only after successful payment
- Generate unique booking_reference on creation

**Constraints**:
```sql
CHECK (tickets_count > 0)
CHECK (total_amount >= 0)
-- Application level: prevent organizer from booking own event
```

---

### 4. PAYMENTS
**Purpose**: Store payment transaction details

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Payment ID |
| booking_id | INT | FOREIGN KEY (BOOKINGS.id), UNIQUE, NOT NULL | Related booking |
| amount | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Payment amount |
| payment_method | VARCHAR(50) | NOT NULL | 'stripe', 'paypal', 'razorpay' |
| transaction_id | VARCHAR(100) | UNIQUE, NULL | Gateway transaction ID |
| payment_status | ENUM | NOT NULL, DEFAULT 'pending' | 'pending', 'completed', 'failed', 'refunded' |
| payment_details | JSON/TEXT | NULL | Gateway response data |
| payment_date | TIMESTAMP | NULL | When payment completed |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Payment attempt time |

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (booking_id) REFERENCES BOOKINGS(id) ON DELETE CASCADE
- UNIQUE KEY (booking_id) -- One payment per booking
- UNIQUE KEY (transaction_id)
- INDEX (payment_status)

**Business Rules**:
- One payment record per booking
- amount must match booking.total_amount
- Update booking.status when payment_status = 'completed'
- transaction_id comes from payment gateway
- payment_date set when status changes to 'completed'

**Constraints**:
```sql
CHECK (amount > 0)
-- Application level: amount = booking.total_amount
```

---

### 5. ORGANIZER_APPLICATIONS
**Purpose**: Track user applications to become event organizers

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Application ID |
| user_id | INT | FOREIGN KEY (USERS.id), NOT NULL | Applicant user |
| application_reason | TEXT | NOT NULL | Why they want to be organizer |
| status | ENUM | NOT NULL, DEFAULT 'pending' | 'pending', 'approved', 'rejected' |
| reviewed_by | INT | FOREIGN KEY (USERS.id), NULL | Admin who reviewed |
| admin_notes | TEXT | NULL | Admin's review comments |
| applied_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Application date |
| reviewed_at | TIMESTAMP | NULL | When reviewed |

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
- FOREIGN KEY (reviewed_by) REFERENCES USERS(id) ON DELETE SET NULL
- INDEX (status)
- INDEX (user_id, status)

**Business Rules**:
- User can have only one pending application
- When approved: update USERS.role = 'organizer', USERS.status = 'active'
- reviewed_by must be admin role
- reviewed_at set when status changes from 'pending'
- Users can reapply if rejected (after certain period)

**Constraints**:
```sql
-- Application level: 
-- Only one pending application per user
-- reviewed_by must have role='admin'
```

---

## Relationships Summary

```
1. USERS (1) ──creates──> (N) EVENTS
   - One organizer can create many events
   - Cascade delete: Remove events if organizer deleted

2. USERS (1) ──makes──> (N) BOOKINGS
   - One user can make many bookings
   - Cascade delete: Remove bookings if user deleted

3. EVENTS (1) ──has──> (N) BOOKINGS
   - One event can have many bookings
   - Cascade delete: Remove bookings if event deleted

4. BOOKINGS (1) ──includes──> (1) PAYMENTS
   - One booking has exactly one payment
   - Cascade delete: Remove payment if booking deleted

5. USERS (1) ──submits──> (N) ORGANIZER_APPLICATIONS
   - One user can submit applications (but only one pending)
   - Cascade delete: Remove applications if user deleted

6. USERS (1) ──reviews──> (N) ORGANIZER_APPLICATIONS
   - One admin can review many applications
   - Set null: Keep application history if admin deleted
```

---

## Key Queries & Operations

### For Users (Attendees)
```sql
-- Browse available events
SELECT * FROM EVENTS 
WHERE status = 'active' 
  AND event_date_time > NOW() 
  AND available_tickets > 0
ORDER BY event_date_time;

-- My bookings
SELECT b.*, e.title, e.event_date_time, p.payment_status
FROM BOOKINGS b
JOIN EVENTS e ON b.event_id = e.id
LEFT JOIN PAYMENTS p ON b.id = p.booking_id
WHERE b.user_id = ?
ORDER BY b.booking_date DESC;
```

### For Event Organizers
```sql
-- My events with booking stats
SELECT e.*, 
       COUNT(b.id) as total_bookings,
       SUM(b.tickets_count) as tickets_sold,
       SUM(b.total_amount) as total_revenue
FROM EVENTS e
LEFT JOIN BOOKINGS b ON e.id = b.event_id AND b.status = 'confirmed'
WHERE e.organizer_id = ?
GROUP BY e.id;

-- Attendees for my event
SELECT u.name, u.email, b.tickets_count, b.booking_reference, p.payment_status
FROM BOOKINGS b
JOIN USERS u ON b.user_id = u.id
LEFT JOIN PAYMENTS p ON b.id = p.booking_id
WHERE b.event_id = ? AND b.status = 'confirmed';
```

### For Admin
```sql
-- Pending organizer applications
SELECT oa.*, u.name, u.email
FROM ORGANIZER_APPLICATIONS oa
JOIN USERS u ON oa.user_id = u.id
WHERE oa.status = 'pending'
ORDER BY oa.applied_at;

-- Platform revenue
SELECT 
    COUNT(DISTINCT e.id) as total_events,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_revenue
FROM EVENTS e
LEFT JOIN BOOKINGS b ON e.id = b.event_id AND b.status = 'confirmed';
```

---

## Triggers (Optional but Recommended)

### 1. Update Available Tickets on Booking
```sql
CREATE TRIGGER update_tickets_after_booking
AFTER INSERT ON BOOKINGS
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE EVENTS 
        SET available_tickets = available_tickets - NEW.tickets_count
        WHERE id = NEW.event_id;
    END IF;
END;
```

### 2. Restore Tickets on Cancellation
```sql
CREATE TRIGGER restore_tickets_on_cancel
AFTER UPDATE ON BOOKINGS
FOR EACH ROW
BEGIN
    IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
        UPDATE EVENTS 
        SET available_tickets = available_tickets + OLD.tickets_count
        WHERE id = OLD.event_id;
    END IF;
END;
```

### 3. Update User Role on Application Approval
```sql
CREATE TRIGGER update_role_on_approval
AFTER UPDATE ON ORGANIZER_APPLICATIONS
FOR EACH ROW
BEGIN
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        UPDATE USERS 
        SET role = 'organizer', status = 'active'
        WHERE id = NEW.user_id;
    END IF;
END;
```

---

## Performance Optimization

### Recommended Indexes
```sql
-- Frequently queried combinations
CREATE INDEX idx_events_active_date ON EVENTS(status, event_date_time);
CREATE INDEX idx_bookings_user_status ON BOOKINGS(user_id, status);
CREATE INDEX idx_bookings_event_status ON BOOKINGS(event_id, status);
CREATE INDEX idx_payments_status ON PAYMENTS(payment_status);

-- Search functionality
CREATE FULLTEXT INDEX idx_events_search ON EVENTS(title, description);
```

### Materialized Views (for heavy analytics)
```sql
-- Event statistics view
CREATE VIEW event_statistics AS
SELECT 
    e.id,
    e.title,
    e.organizer_id,
    COUNT(b.id) as total_bookings,
    SUM(b.tickets_count) as tickets_sold,
    SUM(b.total_amount) as revenue,
    e.total_capacity - e.available_tickets as sold_out_count
FROM EVENTS e
LEFT JOIN BOOKINGS b ON e.id = b.event_id AND b.status = 'confirmed'
GROUP BY e.id;
```

---

## Security Considerations

1. **Password Hashing**: Use bcrypt/argon2 for USERS.password
2. **SQL Injection**: Use parameterized queries
3. **Data Validation**: 
   - Email format validation
   - Date validation (event_date_time must be future)
   - Ticket count validation
4. **Authorization Checks**:
   - Organizers can only edit their own events
   - Users cannot book own events
   - Only admins can approve applications
5. **Payment Security**:
   - Store minimal payment data
   - Use payment gateway webhooks
   - Implement idempotency keys

---

## Sample Data Structure

### User Example
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "organizer",
  "status": "active"
}
```

### Event Example
```json
{
  "id": 101,
  "organizer_id": 1,
  "title": "Tech Conference 2025",
  "event_date_time": "2025-03-15 09:00:00",
  "venue": "Convention Center, NYC",
  "ticket_price": 99.99,
  "total_capacity": 500,
  "available_tickets": 342,
  "status": "active"
}
```

### Booking Example
```json
{
  "id": 1001,
  "event_id": 101,
  "user_id": 2,
  "tickets_count": 2,
  "total_amount": 199.98,
  "booking_reference": "BK-20250120-A7F3",
  "status": "confirmed"
}
```

---

## Migration Notes

When implementing:
1. Create tables in order: USERS → EVENTS, ORGANIZER_APPLICATIONS → BOOKINGS → PAYMENTS
2. Add foreign key constraints after all tables exist
3. Create indexes after initial data load for better performance
4. Set up triggers last to avoid issues during data population
5. Create default admin user for initial setup

---

## Future Enhancements

Possible schema additions:
- **EVENT_CATEGORIES** table for filtering
- **REVIEWS** table for event ratings
- **NOTIFICATIONS** table for email/SMS alerts
- **DISCOUNTS** table for promo codes
- **SEATING** table for seat selection
- **REFUNDS** table separate from payments for better tracking