from sqlalchemy import Column, String, DateTime, Boolean, Integer
from sqlalchemy.orm import relationship
from app.models.profile import Profile
from app.models.user_badge import UserBadge
from app.models.comment import Comment
from app.models.prediction import Prediction
from datetime import datetime
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    location = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete", passive_deletes=True)
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete", passive_deletes=True)
    comments = relationship("Comment", back_populates="user",cascade="all, delete", passive_deletes=True)
    badges = relationship("UserBadge", back_populates="user", cascade="all, delete", passive_deletes=True)
    questions = relationship("Question", back_populates="author", cascade="all, delete", passive_deletes=True)

    is_admin = Column(Boolean, default=False, nullable=False)