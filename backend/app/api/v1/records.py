from fastapi import APIRouter, Depends, Query, Response, UploadFile, File
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.v1.auth import get_current_user
from app.schemas.dns_record import DNSRecordCreate, DNSRecordUpdate, DNSRecordSingleResponse, DNSRecordResponse
from app.schemas.common import PaginatedResponse
from app.services.dns_record_service import DNSRecordService
from app.services.hosted_zone_service import HostedZoneService
from app.models.user import User
from app.core.exceptions import AppError
import io
import dns.zone
import dns.rdatatype

router = APIRouter()

router = APIRouter()

@router.get("/export")
def export_dns_records(
    zone_id: str,
    format: str = Query("json", description="Export format: json or bind"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DNSRecordService(db)
    zone_service = HostedZoneService(db)
    zone = zone_service.get_by_id(zone_id, current_user.id)
    records = service.get_all(zone_id, current_user.id)
    
    if format == "json":
        return {"data": records}
    elif format == "bind":
        output = io.StringIO()
        output.write(f"$ORIGIN {zone.name}.\n")
        output.write(f"$TTL 300\n")
        for r in records:
            vals = r.value.split('\\n')
            for val in vals:
                output.write(f"{r.name}. {r.ttl} IN {r.type} {val}\n")
        
        headers = {
            "Content-Disposition": f"attachment; filename={zone.name}.zone"
        }
        return Response(content=output.getvalue(), media_type="text/plain", headers=headers)
    else:
        raise AppError("Invalid format", status_code=400)

@router.post("/import")
async def import_dns_records(
    zone_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DNSRecordService(db)
    zone_service = HostedZoneService(db)
    zone = zone_service.get_by_id(zone_id, current_user.id)
    
    content = await file.read()
    try:
        text = content.decode('utf-8')
        z = dns.zone.from_text(text, origin=zone.name, relativize=False)
        
        imported_count = 0
        for name, node in z.nodes.items():
            for rdataset in node.rdatasets:
                record_type = dns.rdatatype.to_text(rdataset.rdtype)
                ttl = rdataset.ttl
                
                values = []
                for rdata in rdataset:
                    values.append(rdata.to_text())
                
                value_str = "\\n".join(values)
                
                record_in = DNSRecordCreate(
                    name=name.to_text(),
                    type=record_type,
                    ttl=ttl,
                    value=value_str,
                    routing_policy="Simple"
                )
                try:
                    service.create(zone_id, record_in, current_user.id)
                    imported_count += 1
                except Exception:
                    pass # Ignore validation errors for individual records during import
                    
        return {"message": f"Successfully imported {imported_count} records"}
    except Exception as e:
        raise AppError(f"Failed to parse BIND file: {str(e)}", status_code=400)

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
