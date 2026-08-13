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
        # Route 53 allows multiple values separated by newlines
        lines = [line.strip() for line in self.value.split('\n') if line.strip()]
        
        if not lines:
            raise ValueError("Record value cannot be empty")

        for value in lines:
            if record_type == "A":
                try:
                    ipaddress.IPv4Address(value)
                except ValueError:
                    raise ValueError(f"Invalid IPv4 address for A record: {value}")
            elif record_type == "AAAA":
                try:
                    ipaddress.IPv6Address(value)
                except ValueError:
                    raise ValueError(f"Invalid IPv6 address for AAAA record: {value}")
            elif record_type in ("CNAME", "NS", "PTR"):
                # Simple hostname validation, allowing trailing dot
                val_to_check = value[:-1] if value.endswith('.') else value
                if not re.match(r'^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$', val_to_check) and val_to_check != "localhost":
                    raise ValueError(f"Invalid hostname for {record_type} record: {value}")
            elif record_type == "MX":
                # Very basic check: 10 mail.example.com
                if not re.match(r'^\d+\s+\S+$', value):
                    raise ValueError(f"Invalid MX record format. Expected: <priority> <mail-server>, got: {value}")
            elif record_type == "SRV":
                # Priority Weight Port Target
                if not re.match(r'^\d+\s+\d+\s+\d+\s+\S+$', value):
                    raise ValueError(f"Invalid SRV format. Expected: <priority> <weight> <port> <target>, got: {value}")
            elif record_type == "CAA":
                # Flag Tag Value
                if not re.match(r'^\d+\s+\S+\s+".*"$', value):
                    raise ValueError(f"Invalid CAA format. Expected: <flag> <tag> \"<value>\", got: {value}")
        
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
