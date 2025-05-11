from sqlalchemy.orm import Session
from app.models.ticker import Ticker
from app.schemas.ticker import TickerCreate

def create_ticker(db: Session, ticker: TickerCreate):
    db_ticker = Ticker(**ticker.dict())
    db.add(db_ticker)
    db.commit()
    db.refresh(db_ticker)
    return db_ticker

def get_tickers(db: Session):
    return db.query(Ticker).all()


def update_ticker(db: Session, ticker_id: int, ticker_data: TickerCreate):
    ticker = db.query(Ticker).filter(Ticker.id == ticker_id).first()
    if not ticker:
        return None

    ticker.name = ticker_data.name
    ticker.value = ticker_data.value
    ticker.icon_url = ticker_data.icon_url

    db.commit()
    db.refresh(ticker)
    return ticker

