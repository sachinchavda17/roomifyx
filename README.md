# 🏨 RoomifyX – Backend API

RoomifyX is a **modern hotel management system backend** built with **FastAPI** and **MongoDB**, designed with a **scalable, feature-based architecture**.  
It provides secure authentication, role-based access, room management, booking workflows, and dashboard analytics.

> ⚠️ Frontend integration (Next.js) will be added in a future update.

---

## 🚀 Live API

```
https://<your-render-url>
```

Swagger Docs:
```
https://<your-render-url>/docs
```

---

## 🧱 Tech Stack

- **Framework:** FastAPI (Python)
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT (OAuth2 Bearer)
- **Password Hashing:** bcrypt + passlib
- **Deployment:** Render (Free Tier)
- **Architecture:** Feature-based (Domain-driven)

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── core/
│   ├── features/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── rooms/
│   │   ├── bookings/
│   │   └── dashboard/
│   └── main.py
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🔐 Authentication & Roles

### Roles Supported
- **admin**
- **staff**

JWT tokens must be sent in headers:
```
Authorization: Bearer <token>
```

---

## 🏨 Core Features

### 👤 Authentication
- User registration
- Secure login
- JWT-based authentication
- Role-based access control

### 🏠 Rooms
- Create and manage rooms
- Update room status
- View rooms

### 📅 Bookings
- Create bookings
- Prevent date overlaps
- Auto price calculation
- Cancel, check-in, check-out

### 📊 Dashboard
- Room availability
- Active bookings
- Daily stats
- Revenue analytics

---

## ⚙️ Environment Variables

```env
MONGO_URI=your_mongodb_uri
DB_NAME=roomifyx_db
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
```

---

## 🛠️ Local Development

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🌍 Deployment

- Hosted on **Render**
- MongoDB Atlas (M0)
- Free-tier friendly

---

## 👨‍💻 Author

**Sachin Chavda**  
IT Engineering | MERN & Python Developer

---

## 🧭 Roadmap

- Frontend (Next.js)
- Payments
- Reports
- Admin dashboard UI
