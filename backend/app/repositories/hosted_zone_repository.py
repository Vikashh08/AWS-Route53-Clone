from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.hosted_zone import HostedZone
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate

class HostedZoneRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, zone_in: HostedZoneCreate, user_id: str) -> HostedZone:
        db_zone = HostedZone(
            name=zone_in.name,
            comment=zone_in.description,
            is_private=zone_in.is_private,
            zone_type="Private" if zone_in.is_private else "Public",
            user_id=user_id
        )
        self.db.add(db_zone)
        self.db.commit()
        self.db.refresh(db_zone)
        return db_zone

    def get_by_id(self, zone_id: str, user_id: str) -> HostedZone | None:
        return self.db.query(HostedZone).filter(
            HostedZone.id == zone_id,
            HostedZone.user_id == user_id
        ).first()
        
    def get_by_name(self, name: str, user_id: str) -> HostedZone | None:
        return self.db.query(HostedZone).filter(
            HostedZone.name == name,
            HostedZone.user_id == user_id
        ).first()

    def search(self, user_id: str, search: str = None, skip: int = 0, limit: int = 20) -> tuple[list[HostedZone], int]:
        query = self.db.query(HostedZone).filter(HostedZone.user_id == user_id)
        if search:
            query = query.filter(or_(
                HostedZone.name.ilike(f"%{search}%"),
                HostedZone.comment.ilike(f"%{search}%")
            ))
        total = query.count()
        items = query.order_by(HostedZone.name).offset(skip).limit(limit).all()
        return items, total

    def update(self, db_zone: HostedZone, zone_in: HostedZoneUpdate) -> HostedZone:
        if zone_in.description != None:
            db_zone.comment = zone_in.description
        self.db.commit()
        self.db.refresh(db_zone)
        return db_zone

    def delete(self, db_zone: HostedZone) -> None:
        self.db.delete(db_zone)
        self.db.commit()
