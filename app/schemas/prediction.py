from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.score import ScoreOut
from app.schemas.question import QuestionOut
from app.schemas.user import UserOut

class PredictionBase(BaseModel):
    question_id: int
    predicted_binary: Optional[str] = None  # "yes" or "no"
    predicted_range_min: Optional[float] = None
    predicted_range_max: Optional[float] = None
    confidence: Optional[int] = Field(default=None, ge=50, le=100)

class PredictionCreate(PredictionBase):
    pass

class PredictionOut(PredictionBase):
    id: int
    user_id: int
    created_at: datetime
    user: Optional[UserOut]
    score: Optional[ScoreOut]
    question: Optional[QuestionOut]
    
    class Config:
        from_attributes = True
