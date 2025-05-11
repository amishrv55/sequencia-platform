# app/models/keyword.py

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, unique=True, index=True)

    question_keywords = relationship("QuestionKeyword", back_populates="keyword", passive_deletes=True)
    article_keywords = relationship("ArticleKeyword", back_populates="keyword", passive_deletes=True)
