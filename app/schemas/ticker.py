from pydantic import BaseModel
from typing import Optional

class TickerBase(BaseModel):
    name: str
    icon_url: Optional[str]
    value: str

class TickerCreate(TickerBase):
    pass

class TickerOut(TickerBase):
    id: int

    class Config:
        from_attributes = True
