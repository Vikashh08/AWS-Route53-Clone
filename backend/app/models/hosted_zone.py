from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False) # e.g. example.com
    zone_type = Column(String, nullable=False, default="Public") # Public or Private
    comment = Column(Text, nullable=True)
    is_private = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # We might associate it with a user later if needed, but the prompt says 
    # "User 1 -- N Hosted Zones"
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    user = relationship("User")
    records = relationship("DNSRecord", back_populates="hosted_zone", cascade="all, delete-orphan")
