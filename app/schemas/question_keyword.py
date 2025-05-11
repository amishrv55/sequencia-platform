# schemas/question_keyword.py
from pydantic import BaseModel

class QuestionKeywordCreate(BaseModel):
    question_id: int
    keyword_id: int
