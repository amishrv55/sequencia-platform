# schemas/keyword.py
from pydantic import BaseModel

class KeywordBase(BaseModel):
    word: str

class KeywordOut(KeywordBase):
    id: int

    class Config:
        from_attributes = True
