from fastapi import APIRouter
from app.api.v1.auth import router as auth_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# We will include other routers here later (e.g. hosted_zones, records)
@api_router.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
