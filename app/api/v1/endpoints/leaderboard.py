from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.leaderboard import LeaderboardUser
from app.crud.leaderboard import get_leaderboard

router = APIRouter()

@router.get("/", response_model=list[LeaderboardUser])
def fetch_leaderboard(db: Session = Depends(get_db)):
    return get_leaderboard(db)
