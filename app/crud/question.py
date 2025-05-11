from sqlalchemy.orm import Session
from app.models.question import Question
from app.schemas.question import QuestionCreate
from app.models.keyword import Keyword
from app.models.question_keyword import QuestionKeyword

def create_question(db: Session, question: QuestionCreate, user_id: int):
    db_question = Question(
        title=question.title,
        description=question.description,
        category_id=question.category_id,
        prediction_type=question.prediction_type,
        user_id=user_id,
        image_url=question.image_url,
        file_url=question.file_url,
    )
    db.add(db_question)
    db.flush()  # To get the ID

    for kw in question.keywords:
        keyword = db.query(Keyword).filter_by(text=kw).first()
        if not keyword:
            keyword = Keyword(text=kw)
            db.add(keyword)
            db.flush()
        db.add(QuestionKeyword(question_id=db_question.id, keyword_id=keyword.id))

    db.commit()
    db.refresh(db_question)
    return db_question


def get_all_questions(db: Session):
    return db.query(Question).order_by(Question.created_at.desc()).all()

#def get_question_by_id(db: Session, question_id: int):
#    return db.query(Question).filter(Question.id == question_id).first()

def get_question_by_id(db: Session, question_id: int) -> Question:
    return db.query(Question).filter(Question.id == question_id).first()

def get_questions_by_category(db: Session, category_name: str):
    from app.models.category import Category
    from app.models.question import Question

    category = db.query(Category).filter(Category.name.ilike(category_name)).first()
    if not category:
        return []
    return db.query(Question).filter(Question.category_id == category.id).all()
