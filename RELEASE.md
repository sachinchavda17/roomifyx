# RoomifyX v1.0.0

**Full-stack hotel management and booking platform**

The first release of RoomifyX — a complete hotel management system featuring a React Native mobile app and FastAPI backend with MongoDB.

---

## Highlights

- **Complete Mobile App** built with React Native + Expo, featuring hotel discovery, booking, and property management
- **Production-ready Backend API** with FastAPI, JWT authentication, and role-based access control
- **End-to-end Booking Flow** — from browsing hotels to selecting rooms and completing reservations

---

## What's Included

### Mobile App (React Native + Expo)
- Hotel browsing with search, filters (district, type), and category tabs
- Hotel detail pages with image carousel, amenities, room listings, and contact info
- Full reservation flow: date selection, room picker, guest info, price calculation
- User bookings management
- Hotel & room CRUD for property owners
- User authentication (login/signup) with secure token storage
- Profile management with edit, logout, and delete account
- Bottom tab navigation (Explore, Bookings, Profile)
- Smooth animations and polished UI with custom design system

### Backend API (FastAPI + MongoDB)
- JWT-based authentication with bcrypt password hashing
- Role-based access control (admin, owner, staff, user)
- Hotels CRUD with support for multiple property types (hotel, resort, guest house, apartment)
- Rooms management with type, pricing, status, and amenities
- Bookings with date overlap prevention, auto price calculation, and full status workflow
- Dashboard analytics endpoints (room availability, active bookings, revenue)
- Swagger/OpenAPI documentation
- CORS configured for cross-origin access

### Web Frontend (Next.js — Skeleton)
- Initial Next.js 16 project setup with Tailwind CSS
- Placeholder for future web interface

---

## Tech Stack

| Component | Technologies |
|-----------|-------------|
| Mobile | React Native 0.81, Expo SDK 54, Expo Router, TanStack React Query, React Hook Form, Axios |
| Backend | FastAPI, MongoDB (Motor/PyMongo), JWT (OAuth2), Pydantic, Uvicorn |
| Frontend | Next.js 16, Tailwind CSS v4, React 19 |

---

## Setup

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Configure .env (MONGO_URI, DB_NAME, JWT_SECRET)
uvicorn app.main:app --reload
```

### Mobile
```bash
cd mobile
npm install
# Configure .env (EXPO_PUBLIC_BASE_URL)
npx expo start
```

---

## Known Issues

- Form validation is incomplete across some screens
- Duplicate hotel names are currently allowed (no uniqueness constraint)

---

## What's Next

- Full Next.js web frontend
- Payment integration
- Push notifications
- Cloud image uploads
- Reviews & ratings
- Social authentication (Google, Apple)

---

**Full Changelog**: Initial release
