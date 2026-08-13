from pydantic import BaseModel, constr
from datetime import datetime
from typing import Optional

class DNSRecordBase(BaseModel):
    name: str
    type: str
    ttl: int = 300
    value: str
    routing_policy: str = "Simple"

class DNSRecordCreate(DNSRecordBase):
    pass

class DNSRecordUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    ttl: Optional[int] = None
    value: Optional[str] = None
    routing_policy: Optional[str] = None

class DNSRecordResponse(BaseModel):
    id: str
    hosted_zone_id: str
    name: str
    type: str
    ttl: int
    value: str
    routing_policy: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DNSRecordSingleResponse(BaseModel):
    data: DNSRecordResponse
