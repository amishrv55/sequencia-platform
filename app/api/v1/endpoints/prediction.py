from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.prediction import PredictionCreate, PredictionOut
from app.auth.auth_utils import get_current_user
from app.db.session import get_db
from app.crud import prediction as crud_prediction
from app.models.prediction import Prediction
from sqlalchemy.orm import joinedload

router = APIRouter()

@router.post("/", response_model=PredictionOut)
def create_prediction(
    prediction: PredictionCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return crud_prediction.create_prediction(db, prediction, user.id)

@router.get("/by-user", response_model=list[PredictionOut])
def get_user_predictions(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return (
        db.query(Prediction)
        .filter(Prediction.user_id == user.id)
        .options(joinedload(Prediction.score), joinedload(Prediction.question))
        .all()
    )

# endpoints/prediction.py

@router.get("/question/{question_id}", response_model=list[PredictionOut])
def get_predictions_for_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    return crud_prediction.get_predictions_for_question(db, question_id)
