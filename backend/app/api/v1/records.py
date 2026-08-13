from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.v1.auth import get_current_user
from app.schemas.dns_record import DNSRecordCreate, DNSRecordUpdate, DNSRecordSingleResponse, DNSRecordResponse
from app.schemas.common import PaginatedResponse
from app.services.dns_record_service import DNSRecordService
from app.models.user import User

router = APIRouter()

@router.post("", response_model=DNSRecordSingleResponse, status_code=201)
def create_dns_record(
    zone_id: str,
    record_in: DNSRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DNSRecordService(db)
    record = service.create(zone_id, record_in, current_user.id)
    return {"data": record}

@router.get("", response_model=PaginatedResponse[DNSRecordResponse])
def get_dns_records(
    zone_id: str,
    search: str = Query(None, description="Search by name or value"),
    record_type: str = Query(None, alias="type", description="Filter by record type"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DNSRecordService(db)
    items, pagination = service.search(zone_id, current_user.id, search, record_type, page, page_size)
    return {"data": items, "pagination": pagination}

@router.get("/{record_id}", response_model=DNSRecordSingleResponse)
def get_dns_record(
    zone_id: str,
    record_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DNSRecordService(db)
    record = service.get_by_id(record_id, zone_id, current_user.id)
    return {"data": record}

@router.patch("/{record_id}", response_model=DNSRecordSingleResponse)
def update_dns_record(
    zone_id: str,
    record_id: str,
    record_in: DNSRecordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DNSRecordService(db)
    record = service.update(record_id, zone_id, record_in, current_user.id)
    return {"data": record}

@router.delete("/{record_id}", status_code=204)
def delete_dns_record(
    zone_id: str,
    record_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DNSRecordService(db)
    service.delete(record_id, zone_id, current_user.id)
    return Response(status_code=204)
