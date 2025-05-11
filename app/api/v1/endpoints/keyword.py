from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud.keyword import search_questions_by_keyword
from app.schemas.question import QuestionOut
from app.models.category import Category

router = APIRouter()

@router.get("/search", response_model=list[QuestionOut])
def search_questions(keyword: str = Query(...), db: Session = Depends(get_db)):
    return search_questions_by_keyword(db, keyword)


# In your keywords router (app/api/v1/endpoints/keyword.py)

@router.get("/category/{category_id}")
def get_keywords_by_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    keywords = db.query(Keyword)\
        .join(QuestionKeyword)\
        .join(Question)\
        .filter(Question.category_id == category_id)\
        .distinct()\
        .all()
    
    return keywords
