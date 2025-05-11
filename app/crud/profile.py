# app/crud/profile.py

from sqlalchemy.orm import Session
from app.models.profile import Profile
from app.schemas.profile import ProfileUpdate

def get_profile_by_user(db: Session, user_id: int):
    return db.query(Profile).filter(Profile.user_id == user_id).first()

def update_profile(db: Session, user_id: int, profile_data: ProfileUpdate):
    profile = get_profile_by_user(db, user_id)
    if not profile:
        profile = Profile(user_id=user_id, **profile_data.dict())
        db.add(profile)
    else:
        for field, value in profile_data.dict().items():
            setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
