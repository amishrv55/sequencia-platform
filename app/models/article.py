# app/models/article.py

#from sqlalchemy import Column, Integer, String, Text, DateTime
#from sqlalchemy.orm import relationship
#from datetime import datetime
#from app.db.base_class import Base

#class Article(Base):
    #__tablename__ = "articles"

    #id = Column(Integer, primary_key=True, index=True)
    #title = Column(String, nullable=False)
    #summary = Column(Text, nullable=True)
    #content = Column(Text, nullable=False)
    #image_url = Column(String, nullable=True)
    #created_at = Column(DateTime, default=datetime.utcnow)

    #keywords = relationship("ArticleKeyword", back_populates="article", passive_deletes=True)

from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(JSON, nullable=False)  # Changed from Text to JSON
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    approval_rating = Column(Float, nullable=True)  # New field
    sentiment_score = Column(Float, nullable=True)  # New field

    keywords = relationship("ArticleKeyword", back_populates="article",cascade="all, delete-orphan",passive_deletes=True)