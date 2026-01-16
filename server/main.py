from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from routers import auth, admin, public
from database import engine, SessionLocal
import model

app = FastAPI(
    title="Foundry Backend",
    description="Enterprise Development & Deployment Starter Platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom validation error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = []
    for error in exc.errors():
        field = ".".join(str(x) for x in error["loc"][1:])
        message = error["msg"]
        errors.append(f"{field}: {message}")
    
    return JSONResponse(
        status_code=422,
        content={
            "detail": "; ".join(errors) if errors else "Validation error"
        }
    )

# Create database tables
model.Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(public.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Foundry Backend",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Foundry Backend is running"
    }