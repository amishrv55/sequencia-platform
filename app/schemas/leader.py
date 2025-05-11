from pydantic import BaseModel
from datetime import datetime

class LeaderBase(BaseModel):
    name: str
    title: str
    description: str | None = None
    image_url: str | None = None
    country: str | None = None

class LeaderCreate(LeaderBase):
    pass

class Leader(LeaderBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True