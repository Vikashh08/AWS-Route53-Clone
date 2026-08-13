from sqlalchemy.orm import Session
from app.repositories.hosted_zone_repository import HostedZoneRepository
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate, HostedZoneResponse
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
        
        return self.repo.create(zone_in, user_id)

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

    def update(self, zone_id: str, zone_in: HostedZoneUpdate, user_id: str):
        zone = self.get_by_id(zone_id, user_id)
        return self.repo.update(zone, zone_in)

    def delete(self, zone_id: str, user_id: str):
        zone = self.get_by_id(zone_id, user_id)
        self.repo.delete(zone)
