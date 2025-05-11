from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class QuestionKeyword(Base):
    __tablename__ = "question_keywords"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete= "CASCADE"))
    keyword_id = Column(Integer, ForeignKey("keywords.id", ondelete= "CASCADE"))

    question = relationship("Question", back_populates="keywords", passive_deletes=True)
    keyword = relationship("Keyword", back_populates="question_keywords", passive_deletes=True)

    