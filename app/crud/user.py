from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.auth.hashing import get_password_hash

def create_user(db: Session, user_data: UserCreate) -> User:
    hashed_pw = get_password_hash(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        location=user_data.location,
        hashed_password=hashed_pw
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()
