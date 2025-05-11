# app/models/leader.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.db.base_class import Base

class Leader(Base):
    __tablename__ = "leaders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    country = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)