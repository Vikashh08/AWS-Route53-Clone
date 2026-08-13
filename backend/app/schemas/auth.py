from pydantic import BaseModel
from app.schemas.user import UserResponse

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    data: UserResponse

class CurrentUserResponse(BaseModel):
    data: UserResponse
