from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    comment_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="comments", passive_deletes=True)
    question = relationship("Question", back_populates="comments", passive_deletes=True)