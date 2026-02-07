# SecureTicket

A secure ticket booking platform built with security-first principles, demonstrating best practices in web application security, payment processing, and user data protection.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Security Features](#security-features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security Audit](#security-audit)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## 🎯 Overview

SecureTicket is an academic project demonstrating the implementation of secure software development lifecycle (SSDLC) principles in a real-world e-commerce application. The platform provides online ticket booking functionality while addressing critical security vulnerabilities outlined in the OWASP Top 10.

**Key Objectives:**
- Implement security-by-design principles
- Demonstrate OWASP Top 10 vulnerability mitigation
- PCI DSS compliant payment processing
- Comprehensive audit logging and monitoring
- Role-Based Access Control (RBAC)

## ✨ Features

### User Features
- 🎫 Browse and search available tickets
- 🛒 Secure booking and checkout process
- 💳 PCI DSS compliant payment processing via Stripe
- 👤 User registration and authentication
- 📧 Email notifications for bookings
- 📱 Responsive design for mobile and desktop
- 🔐 Two-factor authentication (2FA) support

### Admin Features
- 📊 Admin dashboard for ticket management
- 👥 User management and role assignment
- 📈 Sales and booking analytics
- 🔍 Audit log viewing and monitoring
- ⚙️ System configuration management

### Security Features
- 🛡️ HTTPS/TLS encryption
- 🔒 Secure session management
- 🚫 CSRF protection
- 🔑 JWT-based authentication
- 🔐 Password hashing (PBKDF2 with SHA256)
- 📝 Input validation and sanitization
- 🚨 Rate limiting and DDoS protection
- 📋 Comprehensive audit logging

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16.1.6
- **UI Library:** React 19.2.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Payment:** Stripe React Components
- **HTTP Client:** Axios
- **State Management:** React Hooks

### Backend
- **Framework:** Django 5.1
- **API:** Django REST Framework 3.15
- **Language:** Python 3.11+
- **Authentication:** JWT (PyJWT)
- **Payment Gateway:** Stripe Python SDK
- **Server:** Gunicorn

### Database
- **Database:** SQLite 3
- **ORM:** Django ORM
- **Encryption:** AES-256 for sensitive data

### DevOps & Security
- **Version Control:** Git
- **Containerization:** Docker (optional)
- **Security Headers:** Helmet.js, Django Security Middleware
- **Rate Limiting:** django-ratelimit
- **CORS:** django-cors-headers

## 🔐 Security Features

SecureTicket implements comprehensive security controls aligned with industry standards:

### OWASP Top 10 Mitigation
- ✅ **A01: Broken Access Control** - RBAC implementation
- ✅ **A02: Cryptographic Failures** - TLS/SSL, encrypted storage
- ✅ **A03: Injection** - Parameterized queries, input validation
- ✅ **A04: Insecure Design** - Security-by-design approach
- ✅ **A05: Security Misconfiguration** - Hardened headers, secure defaults
- ✅ **A06: Vulnerable Components** - Regular dependency updates
- ✅ **A07: Authentication Failures** - Strong password policy, JWT, 2FA
- ✅ **A08: Data Integrity Failures** - CSRF tokens, signature verification
- ✅ **A09: Logging Failures** - Comprehensive audit logging
- ✅ **A10: SSRF** - URL validation, whitelist approach

### Payment Security
- PCI DSS Level 1 compliant (via Stripe)
- No card data stored on servers
- Tokenization for payment methods
- Webhook signature verification
- Secure payment form (Stripe Elements)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+
- pip and virtualenv
- SQLite 3
- Git

### Clone Repository
```bash
git clone https://github.com/subaseyy/QuickTix.git
cd QuickTix
```

### Backend Setup

```bash
# Navigate to backend directory
cd SecureTicket

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd SecureTicket-frontend

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Security
CSRF_COOKIE_SECURE=True
SESSION_COOKIE_SECURE=True
SECURE_SSL_REDIRECT=True
```

### Frontend Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🚀 Usage

### Running in Development

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin Panel: http://localhost:8000/admin

### Running in Production

```bash
# Backend
cd backend
gunicorn config.wsgi:application --bind 0.0.0.0:8000

# Frontend
cd frontend
npm run build
npm run start
```

## 📁 Project Structure

```
quicktix/
├── SecureTicket-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── api/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── TicketCard.tsx
│   │   │   └── PaymentForm.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   └── types/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── SecureTicket/
│   ├── apps/
│   │   ├── users/
│   │   ├── tickets/
│   │   ├── bookings/
│   │   └── payments/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
│
├── .gitignore
├── README.md
└── LICENSE
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register/          - User registration
POST   /api/auth/login/             - User login
POST   /api/auth/logout/            - User logout
POST   /api/auth/refresh/           - Refresh JWT token
GET    /api/auth/profile/           - Get user profile
```

### Ticket Endpoints

```
GET    /api/tickets/                - List all tickets
GET    /api/tickets/:id/            - Get ticket details
POST   /api/tickets/                - Create ticket (admin)
PUT    /api/tickets/:id/            - Update ticket (admin)
DELETE /api/tickets/:id/            - Delete ticket (admin)
```

### Booking Endpoints

```
GET    /api/bookings/               - List user bookings
POST   /api/bookings/               - Create booking
GET    /api/bookings/:id/           - Get booking details
DELETE /api/bookings/:id/           - Cancel booking
```

### Payment Endpoints

```
POST   /api/payments/create-intent/ - Create payment intent
POST   /api/payments/webhook/       - Stripe webhook handler
GET    /api/payments/history/       - Payment history
```

## 🔍 Security Audit

### Security Testing Performed
- ✅ SQL Injection testing
- ✅ XSS vulnerability scanning
- ✅ CSRF protection verification
- ✅ Authentication bypass attempts
- ✅ Authorization testing (IDOR)
- ✅ Session management testing
- ✅ Input validation testing
- ✅ Rate limiting verification
- ✅ Payment security audit

### Security Tools Used
- OWASP ZAP
- Burp Suite Community
- npm audit / pip-audit
- Django Debug Toolbar
- Custom security scripts

### Compliance
- OWASP Top 10 (2021) compliant
- PCI DSS Level 1 (via Stripe)
- GDPR considerations implemented

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow PEP 8 for Python code
- Use ESLint/Prettier for TypeScript/React code
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Subas Kandel**
- Student ID: CU ID 14180916
- University: Coventry University
- Course: BSc (Hons) Computing
- Project Supervisor: Arya Pokharel

## 🙏 Acknowledgments

- OWASP for security guidelines and best practices
- Stripe for payment processing infrastructure
- Django and Next.js communities for excellent documentation
- Coventry University for academic support

## 📞 Contact

For questions or feedback, please contact:
- Email: subas@nestnepal.com.np
- GitHub: subaseyy

---

**⚠️ Disclaimer:** This is an academic project for educational purposes. While security best practices have been implemented, this application should undergo a professional security audit before being used in production.

**Made with ❤️ for secure web development**
