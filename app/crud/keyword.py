# crud/keyword.py
from sqlalchemy.orm import Session
from app.models.keyword import Keyword
from app.models.question import Question
from app.models.question_keyword import QuestionKeyword

def get_or_create_keyword(db: Session, word: str):
    keyword = db.query(Keyword).filter_by(word=word).first()
    if not keyword:
        keyword = Keyword(word=word)
        db.add(keyword)
        db.commit()
        db.refresh(keyword)
    return keyword

def link_keyword_to_question(db: Session, question_id: int, keyword_id: int):
    link = QuestionKeyword(question_id=question_id, keyword_id=keyword_id)
    db.add(link)
    db.commit()
    return link

def search_questions_by_keyword(db: Session, keyword: str):
    return (
        db.query(Question)
        .join(QuestionKeyword)
        .join(Keyword)
        .filter(Keyword.word.ilike(f"%{keyword}%"))
        .all()
    )
