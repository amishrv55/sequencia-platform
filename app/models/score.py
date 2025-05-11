from sqlalchemy import Column, Integer, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    value = Column(Integer)
    prediction = relationship("Prediction", back_populates="score", passive_deletes=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id", ondelete="CASCADE"))
