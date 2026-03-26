# RoomifyX

A full-stack hotel management and booking platform with a **React Native mobile app**, **FastAPI backend**, and **Next.js web frontend**.

RoomifyX enables hotel owners to manage properties and rooms, while guests can discover, explore, and book accommodations — all from a single system.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | React Native, Expo SDK 54, Expo Router, TanStack React Query, React Hook Form |
| **Backend** | FastAPI, MongoDB (Atlas), JWT Auth, Pydantic, Motor |
| **Frontend** | Next.js 16, Tailwind CSS, React 19 |
| **Deployment** | Render (Backend), MongoDB Atlas (Database) |

---

## Features

### Mobile App
- **Explore Hotels** — Search, filter by district/type, browse categories
- **Hotel Details** — Image carousel, amenities, room listings, contact info
- **Reservations** — Date picker, room selection, guest info, price breakdown
- **My Bookings** — View and manage active bookings
- **Hotel Management** — Create, edit, delete hotels and rooms (for owners)
- **User Profile** — Edit profile, account settings, logout/delete account
- **Authentication** — Login/signup with secure JWT token storage

### Backend API
- **Auth** — Registration, login, JWT tokens, role-based access control (admin, owner, staff, user)
- **Hotels CRUD** — Multi-type support (hotel, resort, guest house, apartment), owner-scoped access
- **Rooms CRUD** — Room types (standard, premium, deluxe, suite), status management, amenities
- **Bookings** — Date overlap prevention, auto price calculation, status workflow (pending → confirmed → checked-in → checked-out)
- **Dashboard** — Room availability stats, active bookings, revenue analytics

---

## Project Structure

```
roomifyx/
├── backend/
│   ├── app/
│   │   ├── core/           # Config, database, security, dependencies
│   │   ├── features/       # Feature modules
│   │   │   ├── auth/       # Registration, login, JWT
│   │   │   ├── users/      # User management
│   │   │   ├── hotels/     # Hotel CRUD & search
│   │   │   ├── rooms/      # Room management
│   │   │   ├── bookings/   # Booking workflows
│   │   │   └── dashboard/  # Analytics
│   │   └── main.py
│   └── requirements.txt
├── mobile/
│   ├── app/
│   │   ├── (tabs)/         # Explore, Bookings, Profile tabs
│   │   ├── (auth)/         # Login, Signup screens
│   │   ├── hotels/         # Hotel management screens
│   │   ├── rooms/          # Room management screens
│   │   ├── hotel-detail/   # Hotel detail view
│   │   └── reserve/        # Reservation flow
│   ├── components/         # UI components (base, molecules, organisms)
│   ├── context/            # Auth context
│   ├── hooks/              # useQuery, useMutation wrappers
│   ├── services/           # API service layer (Axios)
│   └── constants/          # Theme, hotel types
└── frontend/               # Next.js web app (in progress)
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Expo CLI (`npm install -g expo-cli`)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=roomifyx_db
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=3600
```

Run the server:
```bash
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`

### Mobile App

```bash
cd mobile
npm install
```

Create a `.env` file:
```env
EXPO_PUBLIC_BASE_URL=http://YOUR_LOCAL_IP:8000
```

Run the app:
```bash
npx expo start
```

Scan the QR code with Expo Go (Android/iOS) to run on your device.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login & get JWT token |
| GET | `/hotels/public` | Browse all active hotels |
| GET | `/hotels/public/{id}` | Hotel details |
| GET | `/hotels/me` | Owner's hotels |
| POST | `/hotels/` | Create hotel |
| PUT | `/hotels/{id}` | Update hotel |
| DELETE | `/hotels/{id}` | Delete hotel |
| GET | `/rooms/public/hotels/{hotel_id}/rooms` | Public room listing |
| POST | `/rooms/` | Create room |
| PUT | `/rooms/{id}` | Update room |
| DELETE | `/rooms/{id}` | Delete room |
| POST | `/bookings/` | Create booking |
| GET | `/bookings/me` | User's bookings |
| PUT | `/bookings/{id}/status` | Update booking status |
| PUT | `/bookings/{id}/cancel` | Cancel booking |

All protected endpoints require: `Authorization: Bearer <token>`

---

## Roles & Permissions

| Role | Capabilities |
|------|-------------|
| **admin** | Full system access, database management |
| **owner** | Create & manage own hotels and rooms |
| **staff** | View bookings, update room status |
| **user** | Browse hotels, make bookings, manage profile |

---

## Deployment

- **Backend**: Hosted on [Render](https://render.com) (free tier)
- **Database**: MongoDB Atlas (M0 free tier)
- **Mobile**: Built with EAS Build for Android/iOS distribution

---

## Roadmap

- [ ] Web frontend (Next.js) — full implementation
- [ ] Payment integration
- [ ] Push notifications for booking updates
- [ ] Image upload to cloud storage
- [ ] Reports & analytics dashboard UI
- [ ] Social authentication (Google, Apple)
- [ ] Reviews and ratings system

---

## Author

**Sachin Chavda**
IT Engineering | Full-Stack Developer

---

## License

This project is for educational and portfolio purposes.
