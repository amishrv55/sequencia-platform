# app/api/v1/endpoints/profile.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.auth.auth_utils import get_current_user
from app.schemas.profile import ProfileUpdate, ProfileOut
from app.crud import profile as crud_profile

router = APIRouter()

@router.get("/me", response_model=ProfileOut)
def get_my_profile(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return crud_profile.get_profile_by_user(db, user.id)

@router.put("/me", response_model=ProfileOut)
def update_my_profile(data: ProfileUpdate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return crud_profile.update_profile(db, user.id, data)
