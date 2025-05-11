from sqlalchemy.orm import Session
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionCreate
from sqlalchemy.orm import Session, joinedload

def create_prediction(db: Session, prediction: PredictionCreate, user_id: int) -> Prediction:
    new_prediction = Prediction(
        question_id=prediction.question_id,
        user_id=user_id,
        predicted_binary=prediction.predicted_binary,
        #predicted_probability=prediction.predicted_probability,
        predicted_range_min=prediction.predicted_range_min,
        predicted_range_max=prediction.predicted_range_max,
        confidence=prediction.confidence,
    )
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    return new_prediction

def get_predictions_by_question(db: Session, question_id: int):
    return db.query(Prediction).filter(Prediction.question_id == question_id).all()

def get_predictions_by_user(db: Session, user_id: int):
    return db.query(Prediction).filter(Prediction.user_id == user_id).all()

def get_predictions_for_question(db: Session, question_id: int):
    return (
        db.query(Prediction)
        .filter(Prediction.question_id == question_id)
        .options(joinedload(Prediction.user))  # For username/email
        .all()
    )