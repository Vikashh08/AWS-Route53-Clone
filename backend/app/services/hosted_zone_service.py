from sqlalchemy.orm import Session
from app.repositories.hosted_zone_repository import HostedZoneRepository
from app.services.dns_record_service import DNSRecordService
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate, HostedZoneResponse
from app.schemas.dns_record import DNSRecordCreate
from app.core.exceptions import AppError
import math

class HostedZoneService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = HostedZoneRepository(db)

    def create(self, zone_in: HostedZoneCreate, user_id: str):
        existing = self.repo.get_by_name(zone_in.name, user_id)
        if existing:
            raise AppError(f"Hosted zone '{zone_in.name}' already exists.", status_code=409, code="HOSTED_ZONE_EXISTS")
        
        zone = self.repo.create(zone_in, user_id)
        
        # Auto-create default NS and SOA records
        record_service = DNSRecordService(self.db)
        
        ns_record = DNSRecordCreate(
            name=zone.name,
            type="NS",
            ttl=172800,
            value="ns-1.route53clone.local\nns-2.route53clone.local\nns-3.route53clone.local\nns-4.route53clone.local"
        )
        record_service.create(zone.id, ns_record, user_id)
        
        soa_record = DNSRecordCreate(
            name=zone.name,
            type="SOA",
            ttl=900,
            value="ns-1.route53clone.local. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"
        )
        record_service.create(zone.id, soa_record, user_id)
        
        return zone

    def get_by_id(self, zone_id: str, user_id: str):
        zone = self.repo.get_by_id(zone_id, user_id)
        if not zone:
            raise AppError("Hosted zone not found", status_code=404, code="HOSTED_ZONE_NOT_FOUND")
        return zone

    def search(self, user_id: str, search: str = None, page: int = 1, page_size: int = 20):
        skip = (page - 1) * page_size
        items, total = self.repo.search(user_id, search, skip, limit=page_size)
        total_pages = math.ceil(total / page_size) if page_size > 0 else 1
        return items, {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages
        }

    def get_stats(self, user_id: str):
        return self.repo.get_stats(user_id)

    def update(self, zone_id: str, zone_in: HostedZoneUpdate, user_id: str):
        zone = self.get_by_id(zone_id, user_id)
        return self.repo.update(zone, zone_in)

    def delete(self, zone_id: str, user_id: str):
        zone = self.get_by_id(zone_id, user_id)
        self.repo.delete(zone)
