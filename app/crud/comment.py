from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate

def create_comment(db: Session, comment_data: CommentCreate, user_id: int) -> Comment:
    comment = Comment(**comment_data.dict(), user_id=user_id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_comments_for_question(db: Session, question_id: int):
    return db.query(Comment).filter(Comment.question_id == question_id).order_by(Comment.created_at).all()
