from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    hosted_zone_id = Column(String, ForeignKey("hosted_zones.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, index=True, nullable=False)
    type = Column(String, index=True, nullable=False)
    ttl = Column(Integer, nullable=False, default=300)
    value = Column(Text, nullable=False)
    routing_policy = Column(String, nullable=False, default="Simple")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hosted_zone = relationship("HostedZone", back_populates="records")
