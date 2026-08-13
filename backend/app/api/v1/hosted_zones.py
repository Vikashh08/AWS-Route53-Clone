from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.v1.auth import get_current_user
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate, HostedZoneSingleResponse, HostedZoneResponse
from app.schemas.common import PaginatedResponse
from app.services.hosted_zone_service import HostedZoneService
from app.models.user import User

router = APIRouter()

@router.post("", response_model=HostedZoneSingleResponse, status_code=201)
def create_hosted_zone(
    zone_in: HostedZoneCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = HostedZoneService(db)
    zone = service.create(zone_in, current_user.id)
    return {"data": zone}

@router.get("/stats")
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = HostedZoneService(db)
    return service.get_stats(current_user.id)

@router.get("", response_model=PaginatedResponse[HostedZoneResponse])
def get_hosted_zones(
    search: str = Query(None, description="Search by name or comment"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = HostedZoneService(db)
    items, pagination = service.search(current_user.id, search, page, page_size)
    return {"data": items, "pagination": pagination}

@router.get("/{zone_id}", response_model=HostedZoneSingleResponse)
def get_hosted_zone(
    zone_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = HostedZoneService(db)
    zone = service.get_by_id(zone_id, current_user.id)
    return {"data": zone}

@router.patch("/{zone_id}", response_model=HostedZoneSingleResponse)
def update_hosted_zone(
    zone_id: str,
    zone_in: HostedZoneUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = HostedZoneService(db)
    zone = service.update(zone_id, zone_in, current_user.id)
    return {"data": zone}

@router.delete("/{zone_id}", status_code=204)
def delete_hosted_zone(
    zone_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = HostedZoneService(db)
    service.delete(zone_id, current_user.id)
    return Response(status_code=204)
