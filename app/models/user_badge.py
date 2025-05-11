from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base
from app.models.badge import Badge

class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    badge_id = Column(Integer, ForeignKey("badges.id", ondelete="CASCADE"))
    awarded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="badges", passive_deletes=True)
    badge = relationship("Badge", back_populates="users", passive_deletes=True)