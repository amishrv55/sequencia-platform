from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Leaderboard(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_score = Column(Float)
    rank = Column(Integer)
    last_updated = Column(DateTime, default=datetime.utcnow)