from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.comment import CommentCreate, CommentOut
from app.auth.auth_utils import get_current_user
from app.db.session import get_db
from app.crud import comment as crud_comment

router = APIRouter()

@router.post("/", response_model=CommentOut)
def create_comment(
    comment: CommentCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return crud_comment.create_comment(db, comment, user.id)

@router.get("/question/{question_id}", response_model=list[CommentOut])
def get_comments_for_question(question_id: int, db: Session = Depends(get_db)):
    return crud_comment.get_comments_for_question(db, question_id)