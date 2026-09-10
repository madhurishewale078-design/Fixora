from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, services, troubleshooting, bookings, notifications, reviews, complaints, admin

# Auto-create tables on startup if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-assisted Smart Home Service Platform - 'Diagnose First. Book Only When Needed.'",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS if isinstance(settings.BACKEND_CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
api_v1 = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1)
app.include_router(services.router, prefix=api_v1)
app.include_router(troubleshooting.router, prefix=api_v1)
app.include_router(bookings.router, prefix=api_v1)
app.include_router(notifications.router, prefix=api_v1)
app.include_router(reviews.router, prefix=api_v1)
app.include_router(complaints.router, prefix=api_v1)
app.include_router(admin.router, prefix=api_v1)

@app.get("/", tags=["General"])
def root():
    return {
        "name": settings.PROJECT_NAME,
        "tagline": "Diagnose First. Book Only When Needed.",
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/health", tags=["General"])
def health_check():
    return {"status": "healthy", "database": "connected"}
