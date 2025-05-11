# app/api/v1/endpoints/leader.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi import Form  # Add this import
from sqlalchemy.orm import Session
from app.crud import leader as crud_leader
from app.schemas.leader import Leader, LeaderCreate 
from app.db.session import get_db
from typing import List
from pathlib import Path
import shutil
import os
import uuid

router = APIRouter()

# Get the project root directory (Sequencia folder)
PROJECT_ROOT = Path(__file__).parents[3]  # Goes up 3 levels from leader.py
UPLOAD_DIR = PROJECT_ROOT / "static" / "leaders"
os.makedirs(UPLOAD_DIR, exist_ok=True)

print(f"Files will save to: {UPLOAD_DIR}") 
print(f"Directory exists: {os.path.exists(UPLOAD_DIR)}")

@router.post("/", response_model=Leader)
def create_leader(
    name: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    country: str = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    leader_data = {
        "name": name,
        "title": title,
        "description": description,
        "country": country,
        "image_url": None
    }

    if image:
        filename = f"{uuid.uuid4()}{os.path.splitext(image.filename)[1]}"
        image_path = UPLOAD_DIR / filename
        
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
            
        leader_data["image_url"] = f"/static/leaders/{filename}"
    
    return crud_leader.create_leader(db, leader_data)

#@router.get("/", response_model=List[Leader])
#def read_leaders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    #return crud_leader.get_leader(db, skip=skip, limit=limit)

@router.get("/", response_model=List[Leader])
def read_leaders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_leader.get_leaders(db, skip=skip, limit=limit)  # Call get_leaders (plural)

@router.get("/{leader_id}", response_model=Leader)
def read_leader(leader_id: int, db: Session = Depends(get_db)):
    leader = crud_leader.get_leader(db, leader_id=leader_id)
    if leader is None:
        raise HTTPException(status_code=404, detail="Leader not found")
    return leader

@router.put("/{leader_id}", response_model=Leader)
def update_leader(
    leader_id: int,
    name: str = None,
    title: str = None,
    description: str = None,
    country: str = None,
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    leader_data = {}
    if name: leader_data["name"] = name
    if title: leader_data["title"] = title
    if description: leader_data["description"] = description
    if country: leader_data["country"] = country
    
    if image:
        image_path = f"{UPLOAD_DIR}/{image.filename}"
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        leader_data["image_url"] = f"/{image_path}"
    
    return crud_leader.update_leader(db, leader_id=leader_id, leader_data=leader_data)

@router.delete("/{leader_id}")
def delete_leader(leader_id: int, db: Session = Depends(get_db)):
    db_leader = crud_leader.delete_leader(db, leader_id=leader_id)
    if not db_leader:
        raise HTTPException(status_code=404, detail="Leader not found")
    return db_leader