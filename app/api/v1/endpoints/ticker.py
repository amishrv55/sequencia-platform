# app/api/v1/endpoints/ticker.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.ticker import TickerCreate, TickerOut
from app.crud import ticker as crud_ticker  # ✅ Use the CRUD
from app.models.ticker import Ticker
from app.auth.auth_utils import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=TickerOut)
def create_ticker(ticker: TickerCreate, db: Session = Depends(get_db)):
    return crud_ticker.create_ticker(db, ticker)

@router.get("/", response_model=list[TickerOut])
def get_tickers(db: Session = Depends(get_db)):
    return crud_ticker.get_tickers(db)


@router.patch("/{ticker_id}", response_model=TickerOut)
def update_ticker(ticker_id: int, ticker: TickerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    updated = crud_ticker.update_ticker(db, ticker_id, ticker)
    if not updated:
        raise HTTPException(status_code=404, detail="Ticker not found")
    return updated

@router.delete("/{ticker_id}", status_code=200)
def delete_ticker(ticker_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    ticker = db.query(Ticker).filter(Ticker.id == ticker_id).first()
    if not ticker:
        raise HTTPException(status_code=404, detail="Ticker not found")

    db.delete(ticker)
    db.commit()
    return {"message": "Ticker deleted successfully."}
