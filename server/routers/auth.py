from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from model import Admin
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
import logging
import schemas

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

SECRET_KEY = "your-secret-key-change-in-production-197b2c37c391bed93fe80344fe73b806"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="api/auth/login")

logger = logging.getLogger("auth")
logger.setLevel(logging.INFO)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


def authenticate_admin(username: str, password: str, db: Session):
    admin = db.query(Admin).filter(Admin.username == username).first()
    
    if not admin:
        return False
    
    if not bcrypt_context.verify(password, admin.hashed_password):
        return False
    
    return admin


def create_access_token(username: str, admin_id: int, expires_delta: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": username,
        "id": admin_id,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_admin(token: Annotated[str, Depends(oauth2_bearer)], db: db_dependency):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        
        username: str = payload.get("sub")
        admin_id: int = payload.get("id")
        
        if username is None or admin_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
        
        admin = db.query(Admin).filter(Admin.id == admin_id).first()
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Admin not found"
            )
        
        return admin
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )


@router.post("/signup", response_model=schemas.AdminResponse, status_code=status.HTTP_201_CREATED)
async def register_admin(
    admin_data: schemas.AdminCreate,
    db: db_dependency
):
    """Register a new admin user"""
    
    # Check if this specific username or email already exists
    existing_admin = db.query(Admin).filter(
        (Admin.username == admin_data.username) |
        (Admin.email == admin_data.email)
    ).first()
    
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    hashed_password = bcrypt_context.hash(admin_data.password)
    
    new_admin = Admin(
        username=admin_data.username,
        email=admin_data.email,
        hashed_password=hashed_password,
        role="admin"
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    logger.info(f"Admin '{admin_data.username}' registered successfully")
    
    return new_admin


@router.post("/login", response_model=schemas.TokenResponse)
async def login_admin(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency
):
    """Admin login endpoint"""
    
    admin = authenticate_admin(form_data.username, form_data.password, db)
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token = create_access_token(
        username=admin.username,
        admin_id=admin.id,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    logger.info(f"Admin '{admin.username}' logged in successfully")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": admin
    }


@router.get("/admin", response_model=schemas.AdminResponse)
async def get_current_admin_info(current_admin: Annotated[Admin, Depends(get_current_admin)]):
    """Get current admin user info"""
    return current_admin
