# SecureTicket API Documentation

## Base URL
`http://localhost:8000/api`

## Authentication Endpoints

### Register User
- **POST** `/auth/register/`
- Body: `{username, email, password, password2, first_name, last_name, phone}`
- Response: `{user, access, refresh, message}`

### Login
- **POST** `/auth/login/`
- Body: `{username, password}`
- Response: `{user, access, refresh, message}`

### Logout
- **POST** `/auth/logout/`
- Headers: `Authorization: Bearer <token>`

### Check Password Strength
- **POST** `/auth/check-password-strength/`
- Body: `{password}`
- Response: `{score, level, feedback, has_uppercase, has_lowercase, has_digit, has_special, length}`

### Get User Profile
- **GET** `/auth/profile/`
- Headers: `Authorization: Bearer <token>`

### Update User Profile
- **PUT** `/auth/profile/update/`
- Headers: `Authorization: Bearer <token>`
- Body: `{first_name, last_name, phone}`

### Change Password
- **POST** `/auth/change-password/`
- Headers: `Authorization: Bearer <token>`
- Body: `{old_password, new_password}`

## Event Endpoints

### List All Events
- **GET** `/events/`

### Get Single Event
- **GET** `/events/{id}/`

### Create Event (Admin only)
- **POST** `/events/`
- Headers: `Authorization: Bearer <token>`
- Body: `{title, description, category, venue, date, time, total_seats, price}`

### Update Event (Admin only)
- **PUT** `/events/{id}/`
- Headers: `Authorization: Bearer <token>`

### Delete Event (Admin only)
- **DELETE** `/events/{id}/`
- Headers: `Authorization: Bearer <token>`

### Get Upcoming Events
- **GET** `/events/upcoming/`

### Get Events by Category
- **GET** `/events/by_category/?category=movie`

## Booking Endpoints

### List User Bookings
- **GET** `/bookings/`
- Headers: `Authorization: Bearer <token>`

### Create Booking
- **POST** `/bookings/`
- Headers: `Authorization: Bearer <token>`
- Body: `{event, seats_booked}`

### Get Booking Details
- **GET** `/bookings/{id}/`
- Headers: `Authorization: Bearer <token>`

### Cancel Booking
- **POST** `/bookings/{id}/cancel/`
- Headers: `Authorization: Bearer <token>`

### Get My Bookings
- **GET** `/bookings/my_bookings/`
- Headers: `Authorization: Bearer <token>`

## Payment Endpoints

### Create Payment Intent
- **POST** `/payments/create-payment-intent/`
- Headers: `Authorization: Bearer <token>`
- Body: `{booking_id}`
- Response: `{clientSecret, booking}`

### Get Payment Status
- **GET** `/payments/status/{booking_id}/`
- Headers: `Authorization: Bearer <token>`

### Stripe Webhook
- **POST** `/payments/webhook/`
- Note: This is called by Stripe, not directly

## Activity Logs (Admin only)

### List All Logs
- **GET** `/logs/`
- Headers: `Authorization: Bearer <token>`

### Filter Logs by User
- **GET** `/logs/?user_id={user_id}`
- Headers: `Authorization: Bearer <token>`