from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.question import QuestionCreate, QuestionOut, QuestionUpdate
from app.auth.auth_utils import get_current_user
from app.crud import question as crud_question
from app.db.session import get_db
from app.models.question import Question
from app.models.prediction import Prediction
from app.models.score import Score
from app.models.user import User
import random
from app.schemas.question import QuestionOut, QuestionEdit


router = APIRouter()

@router.post("/", response_model=QuestionOut)
def create_question(
    question: QuestionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return crud_question.create_question(db, question, user.id)

@router.get("/", response_model=list[QuestionOut])
def get_all_questions(db: Session = Depends(get_db)):
    return crud_question.get_all_questions(db)

@router.get("/featured", response_model=QuestionOut)
def fetch_random_featured_question(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")
    return random.choice(questions)

@router.get("/{question_id}", response_model=QuestionOut)
def get_question_by_id(question_id: int, db: Session = Depends(get_db)):
    return crud_question.get_question_by_id(db, question_id)

@router.get("/category/{category_name}", response_model=list[QuestionOut])
def get_questions_by_category(category_name: str, db: Session = Depends(get_db)):
    return crud_question.get_questions_by_category(db, category_name)

    # app/api/v1/endpoints/question.py

@router.patch("/{question_id}/resolve")
def set_actual_outcome(
    question_id: int,
    update: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    if update.actual_binary:
        question.actual_binary = update.actual_binary
    if update.actual_range_min is not None:
        question.actual_range_min = update.actual_range_min
    if update.actual_range_max is not None:
        question.actual_range_max = update.actual_range_max

    db.commit()

    # ⏱ Score all predictions after setting outcome
    predictions = db.query(Prediction).filter(Prediction.question_id == question_id).all()
    for pred in predictions:
        score_value = 0

        # ✅ Binary Scoring
        if question.prediction_type == "binary" and pred.predicted_binary:
            score_value = 1 if pred.predicted_binary == question.actual_binary else 0

        # ✅ Range Scoring
        elif question.prediction_type == "range" and pred.predicted_range_min is not None:
            predicted_min = pred.predicted_range_min
            predicted_max = pred.predicted_range_max
            actual_value = float(question.actual_range_min)  # 🟡 Temporary: storing 1 value
            score_value = 1 if predicted_min <= actual_value <= predicted_max else 0

        score = Score(
            prediction_id=pred.id,
            user_id=pred.user_id,
            question_id=question.id,
            value=score_value,
            accuracy=float(score_value),
            precision=1.0  # ⏳ Placeholder, can enhance later
        )

        db.add(score)

    db.commit()
    return {"message": "Outcome set and predictions scored."}

@router.delete("/{question_id}", status_code=200)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(question)
    db.commit()
    return {"message": "Question deleted successfully."}

@router.patch("/{question_id}/unset-outcome", status_code=200)
def unset_actual_outcome(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    question.actual_binary = None
    question.actual_range_min = None
    question.actual_range_max = None

    # Remove associated scores
    db.query(Score).filter(Score.question_id == question_id).delete()

    db.commit()
    return {"message": "Outcome and scores reset successfully."}

@router.put("/{question_id}", response_model=QuestionOut)
def update_question(question_id: int, updated_question: QuestionEdit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    for field, value in updated_question.dict(exclude_unset=True).items():
        setattr(question, field, value)

    db.commit()
    db.refresh(question)
    return question




