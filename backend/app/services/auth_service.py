from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.repositories.session_repository import SessionRepository
from app.schemas.auth import LoginRequest
from app.schemas.user import UserCreate
from app.core.security import verify_password, generate_session_token, generate_session_expires_at
from app.core.exceptions import AppError
import hashlib
from datetime import datetime

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.session_repo = SessionRepository(db)

    def login(self, login_data: LoginRequest) -> tuple[str, dict]:
        # Clean up old sessions first (optional but good practice)
        self.session_repo.delete_expired_sessions()

        user = self.user_repo.get_by_email(login_data.email)
        if not user or not verify_password(login_data.password, user.password_hash):
            raise AppError("Invalid email or password", status_code=401, code="UNAUTHORIZED")

        # Create session
        token = generate_session_token()
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        expires_at = generate_session_expires_at()

        self.session_repo.create(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at
        )

        return token, {"user": user, "expires_at": expires_at}

    def signup(self, user_in: UserCreate) -> tuple[str, dict]:
        existing_user = self.user_repo.get_by_email(user_in.email)
        if existing_user:
            raise AppError("Email already registered", status_code=400, code="BAD_REQUEST")
        
        user = self.user_repo.create(user_in)
        
        # Create session
        token = generate_session_token()
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        expires_at = generate_session_expires_at()

        self.session_repo.create(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at
        )

        return token, {"user": user, "expires_at": expires_at}

    def logout(self, token: str) -> None:
        if token:
            token_hash = hashlib.sha256(token.encode()).hexdigest()
            self.session_repo.delete_by_token_hash(token_hash)

    def get_current_user(self, token: str):
        if not token:
            raise AppError("Not authenticated", status_code=401, code="UNAUTHORIZED")
        
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        session = self.session_repo.get_by_token_hash(token_hash)
        
        if not session or session.expires_at < datetime.utcnow():
            raise AppError("Session expired or invalid", status_code=401, code="UNAUTHORIZED")

        return session.user
