from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union, Any

class Settings(BaseSettings):
    PROJECT_NAME: str = "AWS Route53 Clone API"
    API_V1_STR: str = "/api/v1"
    
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite:///./route53_clone.db"
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, v: Any) -> str:
        if not v or not str(v).strip():
            return "sqlite:///./route53_clone.db"
        return str(v)
    
    SECRET_KEY: str = "supersecretkey_please_change_in_production"
    SESSION_EXPIRY: int = 86400
    
    # CORS Origins
    CORS_ORIGINS: Union[List[str], str] = ["*"]
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if not v.startswith("["):
                return [i.strip() for i in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"

settings = Settings()
