from sqlalchemy import Column, Integer, String, Float
from app.db.base_class import Base

class Ticker(Base):
    __tablename__ = "tickers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    icon_url = Column(String, nullable=True)
    value = Column(String, nullable=False)
