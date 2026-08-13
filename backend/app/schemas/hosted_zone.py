from pydantic import BaseModel, constr
from datetime import datetime
from typing import Optional

class HostedZoneBase(BaseModel):
    name: constr(min_length=1, max_length=255) # type: ignore
    description: Optional[str] = None
    is_private: bool = False

class HostedZoneCreate(HostedZoneBase):
    pass

class HostedZoneUpdate(BaseModel):
    description: Optional[str] = None

class HostedZoneResponse(BaseModel):
    id: str
    name: str
    zone_type: str
    comment: Optional[str] = None
    is_private: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class HostedZoneSingleResponse(BaseModel):
    data: HostedZoneResponse
