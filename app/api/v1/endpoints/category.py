from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.schemas.category import CategoryCreate, CategoryOut
from app.models.category import Category
from app.db.session import get_db
from app.crud import category as crud_category
from typing import Optional


router = APIRouter()


@router.get("/", response_model=list[CategoryOut])
def get_all_categories(
    db: Session = Depends(get_db),
    domain: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    return crud_category.get_all_categories(db, domain=domain, search=search)

@router.post("/", response_model=CategoryOut)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.name.ilike(category.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    return crud_category.create_category(db, category_data=category)

@router.put("/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    updated_category: CategoryCreate,
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if name is being changed to an existing name
    if (updated_category.name and 
        updated_category.name.lower() != category.name.lower() and
        db.query(Category).filter(Category.name.ilike(updated_category.name)).first()):
        raise HTTPException(status_code=400, detail="Category name already exists")
    
    # Update fields that are provided
    for field, value in updated_category.dict(exclude_unset=True).items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    return category

@router.get("/{category_id}", response_model=CategoryOut)
def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category