# app/schemas/profile.py

from pydantic import BaseModel
from typing import Optional

class ProfileBase(BaseModel):
    education: Optional[str] = None
    achievements: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    experience_years: Optional[int] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    pass

    class Config:
        from_attributes = True
