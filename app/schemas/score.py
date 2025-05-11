from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScoreOut(BaseModel):
    id: int
    question_id: int
    value: int                            # ✅ Add this
    accuracy: Optional[float] = None
    precision: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
