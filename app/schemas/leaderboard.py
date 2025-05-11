from pydantic import BaseModel

class LeaderboardUser(BaseModel):
    user_id: int
    name: str
    total: int
    correct: int
    accuracy: float

    class Config:
        orm_mode = True
