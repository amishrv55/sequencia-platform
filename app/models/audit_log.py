from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.db.base_class import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    action = Column(String)
    object_type = Column(String)
    object_id = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)