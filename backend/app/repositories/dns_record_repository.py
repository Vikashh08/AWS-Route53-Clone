from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.dns_record import DNSRecord
from app.schemas.dns_record import DNSRecordCreate, DNSRecordUpdate

class DNSRecordRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, zone_id: str, record_in: DNSRecordCreate) -> DNSRecord:
        db_record = DNSRecord(
            hosted_zone_id=zone_id,
            name=record_in.name,
            type=record_in.type,
            ttl=record_in.ttl,
            value=record_in.value,
            routing_policy=record_in.routing_policy
        )
        self.db.add(db_record)
        self.db.commit()
        self.db.refresh(db_record)
        return db_record

    def get_by_id(self, record_id: str, zone_id: str) -> DNSRecord | None:
        return self.db.query(DNSRecord).filter(
            DNSRecord.id == record_id,
            DNSRecord.hosted_zone_id == zone_id
        ).first()

    def get_all(self, zone_id: str) -> list[DNSRecord]:
        return self.db.query(DNSRecord).filter(
            DNSRecord.hosted_zone_id == zone_id
        ).order_by(DNSRecord.name, DNSRecord.type).all()

    def search(self, zone_id: str, search: str = None, record_type: str = None, skip: int = 0, limit: int = 20) -> tuple[list[DNSRecord], int]:
        query = self.db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == zone_id)
        if search:
            query = query.filter(or_(
                DNSRecord.name.ilike(f"%{search}%"),
                DNSRecord.value.ilike(f"%{search}%")
            ))
        if record_type:
            query = query.filter(DNSRecord.type == record_type)
            
        total = query.count()
        items = query.order_by(DNSRecord.name, DNSRecord.type).offset(skip).limit(limit).all()
        return items, total

    def update(self, db_record: DNSRecord, record_in: DNSRecordUpdate) -> DNSRecord:
        update_data = record_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_record, field, value)
        self.db.commit()
        self.db.refresh(db_record)
        return db_record

    def delete(self, db_record: DNSRecord) -> None:
        self.db.delete(db_record)
        self.db.commit()
