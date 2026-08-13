from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.hosted_zones import router as hosted_zones_router
from app.api.v1.records import router as records_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(hosted_zones_router, prefix="/hosted-zones", tags=["Hosted Zones"])
api_router.include_router(records_router, prefix="/hosted-zones/{zone_id}/records", tags=["DNS Records"])

# We will include other routers here later (e.g. hosted_zones, records)
@api_router.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
