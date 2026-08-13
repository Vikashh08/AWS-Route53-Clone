from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "AWS Route53 Clone API"
    API_V1_STR: str = "/api/v1"
    
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite:///./route53_clone.db"
    
    SECRET_KEY: str = "supersecretkey_please_change_in_production"
    SESSION_EXPIRY: int = 86400
    
    # CORS Origins
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
