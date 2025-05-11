from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.profile import ProfileOut

class UserBase(BaseModel):
    name: str
    email: EmailStr
    location: Optional[str]
    profile: Optional[ProfileOut]
    is_admin: bool

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    

    class Config:
        from_attributes = True