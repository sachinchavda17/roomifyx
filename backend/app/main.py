from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.features.auth.routes import router as auth_router
from app.features.rooms.routes import router as rooms_router
from app.features.bookings.routes import router as bookings_router
from app.features.dashboard.routes import router as dashboard_router
from app.features.hotels.routes import router as hotels_router

app = FastAPI(title="RoomifyX API", version="1.0.0")

# 🔓 CORS (adjust origins later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later: ["https://roomifyx.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(rooms_router)
app.include_router(bookings_router)
app.include_router(dashboard_router)
app.include_router(hotels_router)

@app.get("/")
def health():
    return {"status": "RoomifyX backend running 🚀"}
