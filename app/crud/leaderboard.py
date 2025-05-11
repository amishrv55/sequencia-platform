from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.score import Score
from app.models.user import User

def get_leaderboard(db: Session):
    results = (
        db.query(
            User.id.label("user_id"),
            User.name,
            func.count(Score.id).label("total"),
            func.sum(Score.value).label("correct"),
            (func.sum(Score.value) * 100.0 / func.count(Score.id)).label("accuracy")
        )
        .join(Score, Score.user_id == User.id)
        .group_by(User.id, User.name)
        .order_by(((func.sum(Score.value) * 100.0) / func.count(Score.id)).desc())
        .limit(10)
        .all()
    )

    return results
