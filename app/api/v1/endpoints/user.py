from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserOut
from app.auth.auth_utils import get_current_user
from app.db.session import get_db
from app.crud import user as crud_user
from sqlalchemy.orm import joinedload
from app.models.user import User
from fastapi import HTTPException

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_my_user_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = (
        db.query(User)
        .options(joinedload(User.profile))  # 👈 This eagerly loads the profile
        .filter(User.id == current_user.id)
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    return crud_user.get_user_by_id(db, user_id)