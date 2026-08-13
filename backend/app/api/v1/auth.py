from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse, CurrentUserResponse
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService
from app.core.config import settings
from app.core.exceptions import AppError

router = APIRouter()

def get_token_from_request(request: Request) -> str | None:
    # Check cookie first
    token = request.cookies.get("session_token")
    if token:
        return token
    # Fallback to Authorization header (Bearer)
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    return None

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = get_token_from_request(request)
    if not token:
        raise AppError("Not authenticated", status_code=401, code="UNAUTHORIZED")
    
    auth_service = AuthService(db)
    return auth_service.get_current_user(token)

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    token, session_data = auth_service.login(login_data)
    
    # Set HTTP-only cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=settings.SESSION_EXPIRY
    )
    
    return {"data": session_data["user"]}

@router.post("/signup", response_model=LoginResponse)
def signup(user_data: UserCreate, response: Response, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    token, session_data = auth_service.signup(user_data)
    
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=settings.SESSION_EXPIRY
    )
    
    return {"data": session_data["user"]}

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    token = get_token_from_request(request)
    if token:
        auth_service = AuthService(db)
        auth_service.logout(token)
    
    response.delete_cookie("session_token", secure=True, samesite="none")
    return {"data": {"message": "Logged out successfully"}}

@router.get("/me", response_model=CurrentUserResponse)
def get_me(current_user = Depends(get_current_user)):
    return {"data": current_user}
