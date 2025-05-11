# app/models/profile.py

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    education = Column(String)
    achievements = Column(Text)
    bio = Column(Text)
    location = Column(String)
    experience_years = Column(Integer)

    user = relationship("User", back_populates="profile", passive_deletes=True)
