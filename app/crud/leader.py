# app/crud/leader.py
from sqlalchemy.orm import Session
from app.schemas.leader import LeaderCreate 
from app.schemas.leader import Leader as LeaderSchema
from app.models.leader import Leader as LeaderModel
from app.models.leader import Leader


def create_leader(db: Session, leader_data):
    db_leader = LeaderModel(**leader_data)  # Changed from Leader to LeaderModel
    db.add(db_leader)
    db.commit()
    db.refresh(db_leader)
    return db_leader

def get_leader(db: Session, leader_id: int):
    db_leader = db.query(LeaderModel).filter(LeaderModel.id == leader_id).first()
    if db_leader:
        return LeaderSchema.model_validate(db_leader)
    return None

def get_leaders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(LeaderModel).offset(skip).limit(limit).all()


def update_leader(db: Session, leader_id: int, leader_data):
    db_leader = db.query(Leader).filter(Leader.id == leader_id).first()
    if db_leader:
        for key, value in leader_data.items():
            setattr(db_leader, key, value)
        db.commit()
        db.refresh(db_leader)
    return db_leader

def delete_leader(db: Session, leader_id: int):
    db_leader = db.query(Leader).filter(Leader.id == leader_id).first()
    if db_leader:
        db.delete(db_leader)
        db.commit()
    return db_leader