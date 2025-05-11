from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    question_id: int
    comment_text: str

class CommentCreate(CommentBase):
    pass

class CommentOut(CommentBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
