from app.utils.scoring import calculate_score
from app.models.score import Score

def evaluate_prediction(db: Session, prediction):
    score_value = calculate_score(prediction, prediction.question)
    new_score = Score(
        prediction_id=prediction.id,
        question_id=prediction.question_id,
        user_id=prediction.user_id,
        value=score_value
    )
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score
