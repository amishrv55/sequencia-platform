from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.schemas.article import ArticleCreate, ArticleOut
from app.db.session import get_db
from app.models.question import Question
from app.models.article import Article
from app.crud import article as crud_article
from sqlalchemy.orm import joinedload
from app.models.article_keyword import ArticleKeyword
from app.models.keyword import Keyword

from fastapi import Response, status
from app.models.user import User  # If using auth
from app.auth.auth_utils import get_current_user  # If using auth
from sqlalchemy.exc import SQLAlchemyError
from app.crud.article import search_articles

router = APIRouter()


@router.post("/", response_model=ArticleOut)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    db_article = crud_article.create_article(db, article)
    
    # Manually convert to the output format
    return {
        "id": db_article.id,
        "title": db_article.title,
        "summary": db_article.summary,
        "content": db_article.content,
        "image_url": db_article.image_url,
        "created_at": db_article.created_at,
        "approval_rating": db_article.approval_rating,
        "sentiment_score": db_article.sentiment_score,
        "keywords": [kw.keyword.text for kw in db_article.keywords]  # Convert to strings
    }



@router.get("/", response_model=List[ArticleOut])
def get_all_articles(db: Session = Depends(get_db)):
    articles = db.query(Article).options(
        joinedload(Article.keywords).joinedload(ArticleKeyword.keyword)
    ).all()
    
    return [
        {
            "id": article.id,
            "title": article.title,
            "summary": article.summary,
            "content": article.content,
            "image_url": article.image_url,
            "created_at": article.created_at,
            "keywords": [ak.keyword.text for ak in article.keywords]
        }
        for article in articles
    ]

@router.get("/by-keywords/", response_model=List[ArticleOut])
def get_articles_by_keywords(
    keywords: List[str] = Query(...),
    db: Session = Depends(get_db)
):
    articles = (
        db.query(Article)
        .join(ArticleKeyword)
        .join(Keyword)
        .filter(Keyword.text.in_(keywords))
        .options(
            joinedload(Article.keywords).joinedload(ArticleKeyword.keyword)
        )
        .distinct()
        .all()
    )
    
    return [
        {
            "id": article.id,
            "title": article.title,
            "summary": article.summary,
            "content": article.content,
            "image_url": article.image_url,
            "created_at": article.created_at,
            "keywords": [ak.keyword.text for ak in article.keywords]
        }
        for article in articles
    ]

@router.get("/related/{question_id}", response_model=List[ArticleOut])
def get_articles_related_to_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question or not question.keywords:
        return []

    keyword_list = [k.keyword.text.lower() for k in question.keywords]

    articles = db.query(Article).all()
    related_articles = []
    for article in articles:
        article_keywords = [k.keyword.text.lower() for k in article.keywords]
        if any(k in article_keywords for k in keyword_list):
            related_articles.append({
                "id": article.id,
                "title": article.title,
                "summary": article.summary,
                "content": article.content,
                "image_url": article.image_url,
                "created_at": article.created_at,
                "keywords": article_keywords
            })

    return related_articles


@router.get("/{article_id}")
def get_article_by_id(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    return {
        "id": article.id,
        "title": article.title,
        "summary": article.summary,
        "content": article.content,
        "image_url": article.image_url,
        "created_at": article.created_at,
        "keywords": [ak.keyword.text for ak in article.keywords]  # ✅ Fix is here
    }

# Add proper error handling for database operations
@router.delete("/{article_id}", status_code=204)
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        article = db.query(Article).options(
            joinedload(Article.keywords)
        ).filter(Article.id == article_id).first()
        
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")

        # Explicitly delete all related ArticleKeyword records first
        db.query(ArticleKeyword).filter(
            ArticleKeyword.article_id == article_id
        ).delete(synchronize_session=False)
        
        db.delete(article)
        db.commit()
        
        return Response(status_code=204)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error occurred while deleting article: {str(e)}"
        )


@router.get("/timeline-articles/", response_model=List[ArticleOut])
def get_timeline_articles(
    leader: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    try:
        leader_article_ids = (
            db.query(ArticleKeyword.article_id)
            .join(Keyword)
            .filter(Keyword.text == leader)
            .subquery()
        )
        
        timeline_article_ids = (
            db.query(ArticleKeyword.article_id)
            .join(Keyword)
            .filter(Keyword.text == "Timeline")
            .subquery()
        )
        
        articles = (
            db.query(Article)
            .filter(Article.id.in_(leader_article_ids))
            .filter(Article.id.in_(timeline_article_ids))
            .options(joinedload(Article.keywords).joinedload(ArticleKeyword.keyword))
            .order_by(Article.created_at.desc())
            .all()
        )
        
        # Validate before serialization
        if not articles:
            return []
            
        # Debug logging
        print(f"Found {len(articles)} articles")
        if articles:
            print("Sample article content type:", type(articles[0].content))
        
        return [serialize_article(article) for article in articles]
        
    except Exception as e:
        print(f"Error in timeline articles: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/articles/by-leader/", response_model=List[ArticleOut])
def get_articles_by_leader(
    leader: str = Query(..., min_length=1, description="Leader name to search for"),
    db: Session = Depends(get_db)
):
    """
    Get all articles that have the specified leader name as a keyword.
    """
    # First validate the leader name contains only allowed characters
    if not all(c.isalnum() or c.isspace() for c in leader):
        raise HTTPException(
            status_code=422,
            detail="Leader name can only contain letters, numbers and spaces"
        )

    articles = (
        db.query(Article)
        .join(ArticleKeyword)
        .join(Keyword)
        .filter(Keyword.text.ilike(leader.strip()))  # Case-insensitive search
        .options(
            joinedload(Article.keywords).joinedload(ArticleKeyword.keyword)
        )
        .order_by(Article.created_at.desc())  # Newest first
        .all()
    )

    return [serialize_article(article) for article in articles]


@router.get("/articles/search", response_model=List[ArticleOut])
def search_articles(query: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return search_articles(db=db, query=query)