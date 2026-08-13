from datetime import datetime, timezone
from passlib.context import CryptContext
from app.core.config import settings
import secrets

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

def generate_session_expires_at() -> datetime:
    # return naive datetime because SQLite doesn't natively support tz-aware
    return datetime.utcnow() + __import__("datetime").timedelta(seconds=settings.SESSION_EXPIRY)
