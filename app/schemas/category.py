from pydantic import BaseModel, Field
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    description: str
    domain: Optional[str] = Field(None, max_length=50)  # Optional field with max length

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True