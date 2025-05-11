from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut
from app.schemas.auth import Token
from app.auth.jwt_handler import create_access_token
from app.auth.auth_utils import authenticate_user, get_password_hash
from app.crud import user as user_crud
from app.db.session import get_db
from app.schemas.auth import LoginRequest

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if user_crud.get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_crud.create_user(db, user_data)

@router.post("/login", response_model=Token)
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_request.email, login_request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
