from sqlalchemy.orm import Session
from app.repositories.dns_record_repository import DNSRecordRepository
from app.repositories.hosted_zone_repository import HostedZoneRepository
from app.schemas.dns_record import DNSRecordCreate, DNSRecordUpdate
from app.core.exceptions import AppError
import math

class DNSRecordService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = DNSRecordRepository(db)
        self.zone_repo = HostedZoneRepository(db)

    def _ensure_zone_access(self, zone_id: str, user_id: str):
        zone = self.zone_repo.get_by_id(zone_id, user_id)
        if not zone:
            raise AppError("Hosted zone not found or access denied", status_code=404, code="HOSTED_ZONE_NOT_FOUND")
        return zone

    def create(self, zone_id: str, record_in: DNSRecordCreate, user_id: str):
        self._ensure_zone_access(zone_id, user_id)
        return self.repo.create(zone_id, record_in)

    def get_by_id(self, record_id: str, zone_id: str, user_id: str):
        self._ensure_zone_access(zone_id, user_id)
        record = self.repo.get_by_id(record_id, zone_id)
        if not record:
            raise AppError("DNS record not found", status_code=404, code="RECORD_NOT_FOUND")
        return record

    def get_all(self, zone_id: str, user_id: str):
        self._ensure_zone_access(zone_id, user_id)
        return self.repo.get_all(zone_id)

    def search(self, zone_id: str, user_id: str, search: str = None, record_type: str = None, page: int = 1, page_size: int = 20):
        self._ensure_zone_access(zone_id, user_id)
        skip = (page - 1) * page_size
        items, total = self.repo.search(zone_id, search, record_type, skip, limit=page_size)
        total_pages = math.ceil(total / page_size) if page_size > 0 else 1
        return items, {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages
        }

    def update(self, record_id: str, zone_id: str, record_in: DNSRecordUpdate, user_id: str):
        record = self.get_by_id(record_id, zone_id, user_id)
        return self.repo.update(record, record_in)

    def delete(self, record_id: str, zone_id: str, user_id: str):
        record = self.get_by_id(record_id, zone_id, user_id)
        self.repo.delete(record)
