from pydantic import BaseModel, constr, model_validator
from datetime import datetime
from typing import Optional
import ipaddress
import re

class DNSRecordBase(BaseModel):
    name: str
    type: str
    ttl: int = 300
    value: str
    routing_policy: str = "Simple"

    @model_validator(mode='after')
    def validate_record_value(self):
        record_type = self.type.upper()
        value = self.value.strip()

        if record_type == "A":
            try:
                ipaddress.IPv4Address(value)
            except ValueError:
                raise ValueError("Invalid IPv4 address for A record")
        elif record_type == "AAAA":
            try:
                ipaddress.IPv6Address(value)
            except ValueError:
                raise ValueError("Invalid IPv6 address for AAAA record")
        elif record_type in ("CNAME", "NS", "PTR"):
            # Simple hostname validation
            if not re.match(r'^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$', value) and not value.endswith('.'):
                raise ValueError(f"Invalid hostname for {record_type} record")
        elif record_type == "MX":
            # Very basic check: 10 mail.example.com
            if not re.match(r'^\d+\s+\S+$', value):
                raise ValueError("Invalid MX record format. Expected: <priority> <mail-server>")
        elif record_type == "TXT":
            if not value:
                raise ValueError("TXT record cannot be empty")
        elif record_type == "SRV":
            # Priority Weight Port Target
            if not re.match(r'^\d+\s+\d+\s+\d+\s+\S+$', value):
                raise ValueError("Invalid SRV format. Expected: <priority> <weight> <port> <target>")
        elif record_type == "CAA":
            # Flag Tag Value
            if not re.match(r'^\d+\s+\S+\s+".*"$', value):
                raise ValueError("Invalid CAA format. Expected: <flag> <tag> \"<value>\"")
        
        return self

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
