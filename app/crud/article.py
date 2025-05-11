from sqlalchemy.orm import Session
from app.models.article import Article
from app.models.keyword import Keyword
from app.models.article_keyword import ArticleKeyword
from app.schemas.article import ArticleCreate
from typing import List
from sqlalchemy import or_
from app.models.article import Article




def get_articles_by_keywords(db: Session, keyword_list: list[str]):
    return (
        db.query(Article)
        .join(ArticleKeyword)
        .join(Keyword)
        .filter(Keyword.text.in_(keyword_list))
        .distinct()
        .all()
    )

def create_article(db: Session, article_data: ArticleCreate) -> Article:
    # Convert ContentBlocks to serializable dictionaries
    serialized_content = [block.dict() for block in article_data.content]
    
    article = Article(
        title=article_data.title,
        summary=article_data.summary,
        content=serialized_content,  # Use serialized content
        image_url=article_data.image_url,
        approval_rating=article_data.approval_rating,
        sentiment_score=article_data.sentiment_score
    )
    db.add(article)
    db.flush()

    keyword_texts = []
    for kw in article_data.keywords:
        keyword = db.query(Keyword).filter_by(text=kw).first()
        if not keyword:
            keyword = Keyword(text=kw)
            db.add(keyword)
            db.flush()
        link = ArticleKeyword(article_id=article.id, keyword_id=keyword.id)
        db.add(link)
        keyword_texts.append(kw)

    db.commit()
    db.refresh(article)
    return article

def serialize_article(article: Article) -> dict:
    return {
        "id": article.id,
        "title": article.title,
        "summary": article.summary,
        "content": article.content,
        "image_url": article.image_url,
        "created_at": article.created_at,
        "approval_rating": article.approval_rating,
        "sentiment_score": article.sentiment_score,
        "keywords": [ak.keyword.text for ak in article.keywords]
    }



def search_articles(db: Session, query: str):
    return db.query(Article).filter(
        or_(
            Article.title.ilike(f"%{query}%"),
            Article.summary.ilike(f"%{query}%")
        )
    ).order_by(Article.created_at.desc()).all()